import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../db.js';
import { JWT_SECRET, requireAdmin, logAudit, loginRateLimiter, signupRateLimiter } from '../middleware/auth.js';
import { sendSignupOtpEmail, sendPasswordResetEmail } from '../utils/emailService.js';

const router = express.Router();

router.get('/status', async (req, res) => {
  try {
    const count = await db.getAdminCountAsync();
    const exists = count > 0;
    return res.json({
      success: true,
      exists,
      message: exists ? 'Administrator is configured.' : 'No administrator configured yet.'
    });
  } catch (err) {
    console.error('Status check error:', err);
    return res.status(500).json({ success: false, message: 'Server error checking admin status' });
  }
});

// 2. POST /api/admin/auth/signup — Bootstrap the Single Admin with 6-Digit Email OTP
router.post('/signup', signupRateLimiter, async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate Input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if customer account already exists with this email
    const customerExisting = await db.getUserByEmailAsync(cleanEmail);
    if (customerExisting) {
      return res.status(403).json({
        success: false,
        message: 'This email is already registered as a customer. Please use a distinct email address for administrative duties.'
      });
    }

    // CRITICAL SECURITY RULE: Enforce that only ONE admin can ever exist in database
    const existingCount = await db.getAdminCountAsync();
    if (existingCount > 0) {
      logAudit({
        action: 'Blocked Duplicate Admin Creation Attempt',
        adminEmail: cleanEmail,
        ip: req.ip,
        details: 'Attempted admin signup when admin already exists in database'
      });
      return res.status(403).json({
        success: false,
        message: 'Admin account already exists.'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 15 * 60 * 1000;
    const passwordHash = await bcrypt.hash(password, 12);
    const adminId = `adm-${Date.now()}`;

    try {
      await db.createFirstAdmin({
        id: adminId,
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: 'admin',
        isActive: 0, // Inactive until verified via 6-digit OTP
        isVerified: false,
        verificationOtp: otp,
        otpExpiresAt
      });
    } catch (err) {
      if (err.message === 'ADMIN_ALREADY_EXISTS') {
        return res.status(403).json({
          success: false,
          message: 'Admin account already exists.'
        });
      }
      throw err;
    }

    // Send 6-digit luxury OTP verification email
    try {
      await sendSignupOtpEmail(cleanEmail, name.trim(), otp, 'admin');
    } catch (mailErr) {
      console.warn('Admin OTP Email dispatch note:', mailErr.message);
    }

    logAudit({
      action: 'Admin signup initiated',
      adminId,
      adminEmail: cleanEmail,
      ip: req.ip,
      details: `First administrator (${name.trim()}) registered. Awaiting OTP verification.`
    });

    return res.status(201).json({
      success: true,
      requireOtp: true,
      email: cleanEmail,
      message: 'A 6-digit verification code has been sent to your email.'
    });

  } catch (err) {
    console.error('Admin signup error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error processing admin signup.'
    });
  }
});

// 2.5 POST /api/admin/auth/verify-signup-otp — Verify 6-digit Admin Signup OTP
router.post('/verify-signup-otp', async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and 6-digit verification code are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const result = await db.verifyAdminOtpAsync(cleanEmail, otp.trim());

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || 'Invalid or expired verification code.'
      });
    }

    const admin = result.admin;
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    logAudit({
      action: 'Admin email verified',
      adminId: admin.id,
      adminEmail: cleanEmail,
      ip: req.ip,
      details: 'Administrator account activated via OTP verification.'
    });

    return res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        isActive: 1,
        isVerified: true
      },
      message: 'Administrator verified successfully! Redirecting to Dashboard...'
    });
  } catch (err) {
    console.error('Admin verify OTP error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during OTP verification.'
    });
  }
});

// 3. POST /api/admin/auth/login — Admin Login
router.post('/login', loginRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query admin record asynchronously from Supabase
    const admin = await db.getAdminByEmailAsync(cleanEmail);

    if (!admin) {
      logAudit({
        action: 'Failed login',
        adminEmail: cleanEmail,
        ip: req.ip,
        details: 'Admin account not found'
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.'
      });
    }

    if (!admin.isActive) {
      logAudit({
        action: 'Unverified or Deactivated Admin Login Attempt',
        adminId: admin.id,
        adminEmail: admin.email,
        ip: req.ip
      });
      return res.status(403).json({
        success: false,
        message: 'Administrator account is unverified or disabled. Please verify via email OTP.'
      });
    }

    // Compare bcrypt password hash
    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      logAudit({
        action: 'Failed login',
        adminId: admin.id,
        adminEmail: admin.email,
        ip: req.ip,
        details: 'Incorrect password'
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.'
      });
    }

    // Update lastLoginAt
    const now = new Date().toISOString();
    db.updateAdmin(admin.id, { lastLoginAt: now });

    // Issue JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    logAudit({
      action: 'Admin login',
      adminId: admin.id,
      adminEmail: admin.email,
      ip: req.ip,
      details: 'Administrator logged in successfully'
    });

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        lastLoginAt: now,
      }
    });

  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login.'
    });
  }
});

// 4. POST /api/admin/auth/logout — Admin Logout
router.post('/logout', requireAdmin, (req, res) => {
  logAudit({
    action: 'Logout',
    adminId: req.admin.id,
    adminEmail: req.admin.email,
    ip: req.ip,
    details: 'Administrator logged out'
  });

  return res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

// 5. GET /api/admin/auth/me — Verified Session Context
router.get('/me', requireAdmin, (req, res) => {
  return res.json({
    success: true,
    admin: {
      id: req.admin.id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
      isActive: req.admin.isActive,
    }
  });
});

// 6. POST /api/admin/auth/forgot-password — Secure Recovery Token & 6-Digit OTP
router.post('/forgot-password', loginRateLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const admin = await db.getAdminByEmailAsync(cleanEmail);

    if (!admin || !admin.isActive) {
      return res.json({
        success: true,
        message: 'If the provided email belongs to the administrator, password reset instructions have been generated.'
      });
    }

    // Generate 32-byte cryptographically secure random token & 6-digit OTP
    const token = crypto.randomBytes(32).toString('hex');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins expiry

    db.createPasswordReset({ token, otp, adminEmail: cleanEmail, expiresAt });

    const baseUrl = req.headers.origin || 'http://localhost:5173';
    const resetUrl = `${baseUrl}/admin/reset-password?token=${token}`;

    await sendPasswordResetEmail(cleanEmail, resetUrl, 'admin', otp);

    logAudit({
      action: 'Password reset link sent',
      adminId: admin.id,
      adminEmail: cleanEmail,
      ip: req.ip,
      details: 'Password reset email link & OTP dispatched'
    });

    return res.json({
      success: true,
      message: 'Reset link and 6-digit OTP sent to your email.',
      resetToken: token,
      otp: otp,
      expiresInMinutes: 15
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, message: 'Server error processing request.' });
  }
});

// 7. POST /api/admin/auth/reset-password — Execute Password Reset via Token or 6-Digit OTP
router.post(['/api/admin/auth/reset-password', '/api/admin/auth/reset-password-with-otp'], async (req, res) => {
  try {
    const { token, otp, email, newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ success: false, message: 'New password is required.' });
    }

    // Validate Strong Password Policy
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

    let resetRecord = null;
    let targetEmail = (email || '').trim().toLowerCase();

    if (token) {
      resetRecord = db.getPasswordReset(token);
      if (!resetRecord) {
        return res.status(400).json({ success: false, message: 'Invalid or already used password reset token.' });
      }
      if (Date.now() > resetRecord.expiresAt) {
        return res.status(400).json({ success: false, message: 'Password reset token has expired. Please request a new one.' });
      }
      targetEmail = targetEmail || resetRecord.adminEmail;
    } else if (otp && targetEmail) {
      resetRecord = db.getPasswordResetByOtp(targetEmail, otp);
      if (!resetRecord) {
        return res.status(400).json({ success: false, message: 'Invalid 6-digit password reset code.' });
      }
      if (Date.now() > resetRecord.expiresAt) {
        return res.status(400).json({ success: false, message: 'Password reset code has expired. Please request a new one.' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Either a recovery token or email with 6-digit OTP is required.' });
    }

    const admin = await db.getAdminByEmailAsync(targetEmail);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Administrator account not found.' });
    }

    // Enforce Rule: New password CANNOT be identical to previous password
    if (admin.passwordHash) {
      const isSame = await bcrypt.compare(newPassword, admin.passwordHash);
      if (isSame) {
        return res.status(400).json({
          success: false,
          message: 'New password cannot be the same as your previous password. Please choose a different password for security.'
        });
      }
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    db.updateAdmin(admin.id, { passwordHash });
    db.markPasswordResetUsed(token || otp, targetEmail);

    logAudit({
      action: 'Password reset',
      adminId: admin ? admin.id : null,
      adminEmail: targetEmail,
      ip: req.ip,
      details: 'Password successfully reset using recovery token / OTP'
    });

    return res.json({
      success: true,
      message: 'Password has been successfully reset. Please log in with your new password.'
    });

  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Server error resetting password.' });
  }
});

// 8. POST /api/admin/auth/change-password — Authenticated Password Change
router.post('/change-password', requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New passwords do not match.' });
    }

    const admin = db.getAdminById(req.admin.id);
    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    db.updateAdmin(admin.id, { passwordHash });

    logAudit({
      action: 'Password changed',
      adminId: admin.id,
      adminEmail: admin.email,
      ip: req.ip,
      details: 'Password updated from admin profile'
    });

    return res.json({
      success: true,
      message: 'Password updated successfully.'
    });

  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating password.' });
  }
});

export default router;
