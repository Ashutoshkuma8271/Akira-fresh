import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, initDB } from './db.js';
import adminAuthRouter from './routes/adminAuth.js';
import adminDashboardRouter from './routes/adminDashboard.js';
import paymentRouter from './routes/payment.js';
import { testSupabaseConnection } from './services/supabase.js';
import { uploadToCloudinary } from './services/cloudinary.js';
import crypto from 'crypto';
import { sendSignupOtpEmail, sendPasswordResetEmail } from './utils/emailService.js';
import { JWT_SECRET, requireCustomer } from './middleware/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable trust proxy for reverse proxies
app.set('trust proxy', true);

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Security: Rate Limiters against Brute-Force & DoS attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 auth attempts per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
  }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  message: {
    success: false,
    message: 'Rate limit exceeded. Please throttle your requests.'
  }
});

// In-Memory Password Reset OTP Storage with 15-Minute Expiry
const customerResetOTPs = new Map();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are permitted (JPEG, PNG, WebP)'), false);
    }
  }
});

// Performance: Gzip/Brotli Payload Compression
app.use(compression());

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: false,
}));

app.use(express.json({ limit: '1mb' }));
app.use('/api', apiLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Public Website Settings API
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.getSettings();
    return res.json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
});

// Payment Gateway Routes (Razorpay)
app.use('/api/payment', paymentRouter);

// Admin Auth Routes (with Brute-Force Rate Limiting)
app.use('/api/admin/auth', authLimiter, adminAuthRouter);

// Protected Admin Dashboard Routes
app.use('/api/admin', adminDashboardRouter);

// Customer User Registration with 6-Digit Email OTP
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body || {};
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Administrative role cannot be assigned through public registration.'
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    // Customer Password Policy: Min 6 characters
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }


    const cleanEmail = email.trim().toLowerCase();
    const adminExisting = await db.getAdminByEmailAsync(cleanEmail);
    if (adminExisting) {
      return res.status(403).json({
        success: false,
        message: 'This email is reserved for store administration. It cannot be used as a customer account.'
      });
    }

    const existing = await db.getUserByEmailAsync(cleanEmail);
    if (existing && existing.isVerified) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please sign in.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity
    const passwordHash = await bcrypt.hash(password, 10);

    if (existing && !existing.isVerified) {
      await db.updateUserAsync(existing.id, {
        name,
        phone: phone || '',
        passwordHash,
        verificationOtp: otp,
        otpExpiresAt
      });
      await db.setSignupOtpAsync(cleanEmail, otp, otpExpiresAt);
    } else {
      await db.createUser({
        name,
        email: cleanEmail,
        phone: phone || '',
        passwordHash,
        role: 'customer',
        isVerified: false,
        verificationOtp: otp,
        otpExpiresAt
      });
    }

    // Send Luxury HTML OTP Email via Brevo / SMTP
    try {
      await sendSignupOtpEmail(cleanEmail, name, otp);
    } catch (mailErr) {
      console.warn('⚠️ OTP Email delivery failed but account was created in DB:', mailErr.message);
    }

    return res.json({
      success: true,
      requireOtp: true,
      email: cleanEmail,
      message: 'OTP sent to your email'
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Customer User Verify Signup OTP
app.post('/api/auth/verify-signup-otp', authLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit OTP are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const result = await db.verifyUserOtpAsync(cleanEmail, otp);

    if (!result.success) {
      return res.json({ success: false, message: result.message || 'Invalid verification code' });
    }


    const user = result.user;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: 'customer',
        addresses: user.addresses || [],
        wishlist: user.wishlist || []
      },
      token,
      message: 'Account verified successfully'
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ success: false, message: 'OTP verification failed' });
  }
});

// Customer User Resend Signup OTP
app.post('/api/auth/resend-signup-otp', authLimiter, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await db.getUserByEmailAsync(cleanEmail);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Account is already verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    await db.setSignupOtpAsync(cleanEmail, otp, expiresAt);
    try {
      await sendSignupOtpEmail(cleanEmail, user.name, otp);
    } catch (mailErr) {
      console.warn('⚠️ Resent OTP Email delivery failed:', mailErr.message);
    }

    return res.json({
      success: true,
      message: 'OTP resent to your email'
    });
  } catch (err) {
    console.error('Resend OTP error:', err);
    return res.status(500).json({ success: false, message: 'Failed to resend OTP' });
  }
});

// Customer User Login
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Strict Security Guard: Admins cannot log in via Customer Storefront
    const adminUser = await db.getAdminByEmailAsync(cleanEmail);
    if (adminUser) {
      return res.status(403).json({
        success: false,
        isAdminAccount: true,
        message: 'Admin account — please use Admin Portal.'
      });
    }

    // 2. Customer User Lookup
    const user = await db.getUserByEmailAsync(cleanEmail);
    if (!user) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }


    if (user.isVerified === false) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 15 * 60 * 1000;
      await db.setSignupOtpAsync(cleanEmail, otp, expiresAt);
      try {
        await sendSignupOtpEmail(cleanEmail, user.name, otp);
      } catch (mailErr) {
        console.warn('⚠️ Login OTP Email delivery failed:', mailErr.message);
      }

      return res.json({
        success: false,
        requireOtp: true,
        email: cleanEmail,
        message: 'Verification code sent to your email.'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: 'customer',
        addresses: user.addresses || [],
        wishlist: user.wishlist || []
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Customer Forgot Password (Dispatch Luxury Email Reset Link + 6-Digit OTP)
app.post('/api/auth/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await db.getUserByEmailAsync(cleanEmail);

    if (!user) {
      const adminUser = await db.getAdminByEmailAsync(cleanEmail);
      if (adminUser) {
        return res.status(403).json({
          success: false,
          message: 'Admin account — please use Admin Portal.'
        });
      }
      return res.status(400).json({ success: false, message: 'No account found with this email. Please check your spelling.' });
    }


    // Generate cryptographic stateless JWT recovery token & 6-digit OTP
    const token = jwt.sign(
      { email: cleanEmail, role: 'customer', type: 'password_reset' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    await db.createPasswordReset({ token, otp, adminEmail: cleanEmail, expiresAt });

    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
    const baseUrl = req.headers.origin || `${protocol}://${host}`;
    const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(cleanEmail)}`;

    try {
      await sendPasswordResetEmail(cleanEmail, resetUrl, 'customer', otp);
    } catch (mErr) {
      console.warn('Password reset email dispatch note:', mErr.message);
    }

    return res.json({
      success: true,
      message: 'If an account exists for this email, password reset instructions have been sent.'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process password reset request.' });
  }
});

// Reset Password with Token or 6-Digit OTP (Strict Previous Password Reuse Prevention)
app.post(['/api/auth/reset-password-with-token', '/api/auth/reset-password-with-otp', '/api/auth/reset-password'], authLimiter, async (req, res) => {
  try {
    const { token, otp, email, newPassword } = req.body || {};
    if (!newPassword) {
      return res.status(400).json({ success: false, message: 'New password is required.' });
    }

    let user = null;
    let cleanEmail = email ? email.trim().toLowerCase() : '';
    let validatedBy = 'Token';

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && decoded.email) {
          cleanEmail = decoded.email.trim().toLowerCase();
          validatedBy = 'Magic Link Token (Signed JWT)';
        }
      } catch (jwtErr) {
        const resetRecord = db.getPasswordReset(token);
        if (!resetRecord) {
          return res.status(400).json({ success: false, message: 'Invalid or expired password recovery link. Please request a new link.' });
        }
        if (Date.now() > resetRecord.expiresAt) {
          return res.status(400).json({ success: false, message: 'This recovery link has expired. Please request a fresh link.' });
        }
        cleanEmail = cleanEmail || (resetRecord.adminEmail || '').trim().toLowerCase();
        validatedBy = 'Magic Link Token';
      }
    } else if (otp && cleanEmail) {
      const otpCheck = await db.verifyPasswordResetOtpAsync(cleanEmail, otp);
      if (!otpCheck.valid) {
        return res.status(400).json({ success: false, message: otpCheck.message || 'Invalid 6-digit password reset code.' });
      }
      validatedBy = '6-Digit OTP';
    } else {
      return res.status(400).json({ success: false, message: 'Either a recovery token or your registered email with 6-digit OTP is required.' });
    }

    if (!cleanEmail) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    user = await db.getUserByEmailAsync(cleanEmail);
    if (!user) {
      return res.status(404).json({ success: false, message: 'No registered account found with this email.' });
    }

    // Validate Strong Password
    const hasMinLength = newPassword.length >= 8;
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      });
    }

    // Enforce Strict Rule: New password CANNOT be the same as previous password
    if (user.passwordHash) {
      const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
      if (isSamePassword) {
        return res.status(400).json({
          success: false,
          message: 'New password cannot be the same as your previous password. Please choose a different password for security.'
        });
      }
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.updateUserAsync(user.id, { passwordHash });

    db.markPasswordResetUsed(token || otp, cleanEmail);

    // Track Audit Log in database.json password_resets table
    db.createPasswordResetRecord({
      id: `rst-${Date.now()}`,
      email: cleanEmail,
      role: user.role || 'customer',
      action: `Password Reset via ${validatedBy}`,
      status: 'Completed',
      ip: req.ip || '127.0.0.1'
    });

    return res.json({
      success: true,
      message: 'Password updated securely! You can now sign in with your new password.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Password reset failed.' });
  }
});

// Customer Profile Picture Upload to Cloudinary & Supabase
app.post('/api/users/upload-avatar', requireCustomer, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    const result = await uploadToCloudinary(req.file.buffer, 'as-commerce/avatars');
    return res.json({
      success: true,
      url: result.secure_url,
      message: 'Profile picture uploaded to Cloudinary successfully'
    });
  } catch (err) {
    console.error('Avatar upload error:', err);
    return res.status(500).json({ success: false, message: 'Avatar upload failed' });
  }
});

// Customer User Profile, Addresses & Wishlist Database Synchronization
app.put(['/api/users/me', '/api/users/profile'], requireCustomer, async (req, res) => {
  try {
    const { name, phone, addresses, wishlist, avatar, role } = req.body || {};
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Role modification is not allowed.'
      });
    }

    const user = req.user;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (addresses !== undefined) updates.addresses = addresses;
    if (wishlist !== undefined) updates.wishlist = wishlist;
    if (avatar !== undefined) updates.avatar = avatar;

    const updated = db.updateUser(user.id, updates);
    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone || '',
        addresses: updated.addresses || [],
        wishlist: updated.wishlist || [],
        avatar: updated.avatar || ''
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// Customer & Scoped Orders API
app.get('/api/orders', requireCustomer, async (req, res) => {
  try {
    let orders = await db.getOrdersAsync();
    const cleanEmail = req.user.email.trim().toLowerCase();
    orders = orders.filter(o => (o.customerEmail || o.email || o.shippingAddress?.email || '').trim().toLowerCase() === cleanEmail);

    return res.json({ success: true, orders });
  } catch (err) {
    console.error('Fetch orders error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', requireCustomer, async (req, res) => {
  try {
    const orderData = {
      ...(req.body || {}),
      userId: req.user.id,
      customerId: req.user.id,
      customerEmail: req.user.email,
      customerName: req.user.name,
      customerPhone: req.user.phone || '',
      paymentStatus: 'Pending'
    };
    const newOrder = await db.createOrder(orderData);
    console.log(`⚡ Order Placed: #${newOrder.id} (Total: ₹${newOrder.total}) and saved to database & Supabase`);
    return res.json({
      success: true,
      message: 'Order created successfully and synchronized with Supabase database.',
      order: newOrder
    });
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const order = db.getOrderById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        carrier: order.carrier,
        trackingNumber: order.trackingNumber,
        date: order.date,
        estimatedDelivery: order.estimatedDelivery,
        timeline: order.timeline
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to find order' });
  }
});

// 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found.' });
});

export default app;

async function startServer() {
  try {
    await initDB();
    await testSupabaseConnection();

    // Mount Vite dev middleware in development or static assets in production
    if (process.env.NODE_ENV !== 'production') {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        root: rootDir,
        server: {
          middlewareMode: true,
          hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);

      app.listen(PORT, '0.0.0.0', () => {
        console.log(`[A_S FOODY Server] Server running on http://localhost:${PORT}`);
      });
      return;
    } else {
      const distPath = path.join(rootDir, 'dist');
      app.use(express.static(distPath));
      app.use((req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });

      app.listen(PORT, '0.0.0.0', () => {
        console.log(`[A_S FOODY Server] Server running on http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}


if (!process.env.VERCEL) {
  startServer();
}
