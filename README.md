# 🌿 Akira Fresh — Premium Modern Grocery E-Commerce Platform

> **A next-generation, high-performance grocery and organic produce e-commerce platform built with React 19, Vite, Tailwind CSS, Express backend, Supabase PostgreSQL synchronization, and Razorpay payment gateway.**

---

## 📑 Table of Contents
1. [Overview](#-overview)
2. [Visual Design & Aesthetics](#-visual-design--aesthetics)
3. [Key Features & User Journey](#-key-features--user-journey)
4. [Technology Stack](#-technology-stack)
5. [Project Architecture](#-project-architecture)
6. [Environment Setup (`.env`)](#-environment-setup-env)
7. [Local Installation & Development](#-local-installation--development)
8. [Production Deployment](#-production-deployment)

---

## 🍃 Overview

**Akira Fresh** combines the speed of quick commerce, the elegance of premium D2C organic brands, and the reliability of enterprise cold-chain grocery fulfillment:
- **Farm Fresh & Chemical-Free**: Morning-harvested vegetables, exotic fruits, pure A2 dairy, cold-pressed oils, artisanal bakery, and ready-to-cook delicacies.
- **Cold-Chain Express Delivery**: 2-hour temperature-controlled deliveries across 500+ pin codes in Delhi NCR.
- **Enterprise Security**: 6-digit email OTP signup verification, cryptographic token password resets, role-based admin controls, and secure Razorpay transactions.

---

## 🎨 Visual Design & Aesthetics

- **Color Palette**: Deep Forest Green (`#06170E`, `#0B2B1B`), Vibrant Leaf & Olive (`#22C55E`, `#84CC16`), Warm Ivory (`#FBF9F4`), and Soft Sage (`#E8EFE9`).
- **Typography**: Editorial Serif (`Playfair Display`, `Cinzel`) for major headlines paired with crisp modern UI sans-serif (`Plus Jakarta Sans`, `Outfit`).
- **Micro-Interactions**: Floating organic produce, interactive 5-step farm story milestones, smooth quantity steppers, live predictive search, and glassmorphic badges.

---

## 🛒 Key Features & User Journey

1. **Top Announcement Bar**:
   - Freshness tagline with animated leaf indicator.
   - Click-to-copy `FRESH15` coupon widget with instant feedback.
   - Delhi NCR delivery zone selector and order tracking link.

2. **Translucent Sticky Glassmorphic Navbar**:
   - Akira Fresh leaf emblem & typography.
   - Live predictive search with autocomplete across 500+ items.
   - Category mega-menu with featured daily harvests.
   - Cart drawer trigger with live item counter and subtotal calculation.

3. **Hero Section — Asymmetric 3D Produce Visual**:
   - Headline: *"Good Food Starts With Better Freshness."*
   - Layered 3D fresh produce composition, Akira Fresh cold-box, floating badges (*"Picked Today"*, *"100% Quality Assured"*), and live delivery indicator (*500+ Pin Codes*).
   - 50,000+ customer rating proof.

4. **Quick Categories & "Fresh Today" Showcase**:
   - Circular organic cards for all fresh food categories.
   - Tabbed produce filtering with weight tags, discount pills, quantity steppers, and quick-view modals.

5. **Farm-to-Table Interactive Story**:
   - 5-step milestone journey from verified organic farms to the dining table in under 12 hours.

6. **Quality Promises & Flash Deals**:
   - 5 trust promises (*Farm Fresh, Quality Checked, Hygienically Packed, Cold-Chain Fast, 100% Guarantee*).
   - Seasonal bundle discounts with live countdown timer.

7. **Customer Reviews & App Download**:
   - Verified community reviews across Delhi NCR.
   - Mobile app download showcase with 2-hour delivery callout.

---

## ⚡ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI / Client** | React 19, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **State Management** | React Context API (`AuthContext`, `CartContext`, `WishlistContext`, `OrderContext`, `ToastContext`, `ThemeContext`, `AdminAuthContext`) |
| **Backend API** | Node.js (ESM), Express 5, Helmet, Compression, Express Rate Limit, Multer |
| **Database & Auth** | Supabase Cloud PostgreSQL + Local Memory Fallback Cache (`database.json`) |
| **Payment Gateway** | Razorpay SDK (Orders, Signatures, Verification) |
| **Media CDN** | Cloudinary API (Automated Image Transformation & WebP Delivery) |
| **Email Service** | Brevo SMTP Relay & Nodemailer (Luxury HTML Templates) |

---

## 📂 Project Architecture

```text
akira-fresh/
├── public/                     # Static assets, SVG icons, logo
├── server/                     # Express Backend & Services
│   ├── data/                   # database.json local fallback
│   ├── middleware/             # auth.js rate limiters & audit logging
│   ├── routes/                 # adminAuth, adminDashboard, payment routes
│   ├── services/               # supabase.js, cloudinary.js
│   ├── utils/                  # emailService.js (Brevo / Nodemailer)
│   ├── db.js                   # Unified PostgreSQL + local database interface
│   └── server.js               # Express application entry point
├── src/                        # React Frontend Source
│   ├── components/
│   │   ├── common/             # ProductCard, QuickViewModal, Logo, CartDrawer, AuthModal
│   │   ├── home/               # HeroSection, CategorySection, FeaturedSection, FarmStorySection, DealsBanner, TestimonialsSection, AppDownloadSection, TrustBar
│   │   ├── layout/             # AnnouncementBar, MainHeader, NavigationBar, MegaMenu, MobileNav, Footer, Layout
│   │   └── admin/              # Admin dashboard & route guards
│   ├── context/                # Auth, Cart, Wishlist, Order, Toast contexts
│   ├── data/                   # categories.js, products.js grocery catalog
│   ├── pages/                  # HomePage, ShopPage, CategoryPage, ProductDetailsPage, CartPage, CheckoutPage, etc.
│   ├── App.jsx                 # Client router configuration
│   └── index.css               # Design system, animations & styling tokens
├── .gitignore                  # Git ignore rules (node_modules, .env, dist)
├── package.json                # Project dependencies
├── tailwind.config.js          # Forest green & lime theme tokens
└── vite.config.js              # Vite build setup
```

---

## ⚙️ Environment Setup (`.env`)

Create a `.env` file in the root directory:

```env
# Supabase Cloud Database & Auth
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=<your-supabase-anon-key>

VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# Cloudinary Media CDN
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
VITE_CLOUDINARY_CLOUD_NAME=<your-cloud-name>

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
VITE_RAZORPAY_KEY_ID=<your-razorpay-key-id>

# Server Configuration
PORT=5000
JWT_SECRET=<your-jwt-secret-key>

# Brevo SMTP (Transactional Emails)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=<your-brevo-smtp-login>
SMTP_PASS=<your-brevo-smtp-key>
SMTP_FROM_EMAIL=<your-verified-sender-email>
```

---

## 🚀 Local Installation & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
# Runs Express backend and Vite frontend concurrently
npm run dev

# Or run frontend only
npm run dev:frontend
```

### 3. Build for Production
```bash
npm run build
```

---

## 🌐 Deploy to Vercel / Netlify / GitHub

1. **GitHub Repository**: Push this repository to GitHub.
2. **Vercel / Netlify**: Import the repository and set the build command to `npm run build` and publish directory to `dist`.
3. Add your environment variables in the hosting dashboard.

---

### 🌿 Akira Fresh — Naturally Better. Delivered With Care.
