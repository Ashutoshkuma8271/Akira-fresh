# 🍗 A_S FOODY — Restaurant-Grade Fresh Snacks & Delicacies E-Commerce Platform

> **A next-generation, high-performance grocery & ready-to-cook snacks e-commerce platform built with React 19, Vite, Tailwind CSS, Express backend, Supabase PostgreSQL synchronization, and Razorpay payment gateway.**

---

## 📑 Table of Contents
1. [Overview](#-overview)
2. [Visual Design & Aesthetics](#-visual-design--aesthetics)
3. [Key Features & User Journey](#-key-features--user-journey)
4. [Technology Stack](#-technology-stack)
5. [Environment Setup (`.env`)](#-environment-setup-env)
6. [Local Installation & Development](#-local-installation--development)
7. [Production Deployment](#-production-deployment)

---

## 🍗 Overview

**A_S FOODY** combines the speed of modern quick commerce, the elegance of a luxury D2C culinary brand, and the reliability of sub-zero cold-chain fulfillment:
- **Artisanal & Restaurant-Grade**: Melt-in-mouth Awadhi Galouti kebabs, Malai chicken tikkas, crispy Amritsari fish fillets, gourmet patties, and sub-zero blast-frozen snacks.
- **Cold-Chain Express Delivery**: 2-hour temperature-controlled deliveries across Delhi NCR.
- **Enterprise Security**: 6-digit email OTP signup verification, cryptographic token password resets, role-based admin controls, and secure payments.

---

## 🎨 Visual Design & Aesthetics

- **Color Palette**: Deep Forest Green (`#06170E`, `#0B2B1B`), Rich Gold (`#D4AF37`), Warm Ivory (`#FBF9F4`), and Soft Leaf Green (`#22C55E`).
- **Typography**: Editorial Serif (`Playfair Display`, `Cinzel`) for major luxury headlines paired with crisp UI sans-serif (`Plus Jakarta Sans`, `Outfit`).
- **Micro-Interactions**: Smooth quantity steppers, live predictive search, filter badges, and sticky mobile navigation.

---

## 🛒 Key Features

1. **Top Announcement Bar**:
   - Freshness guarantee & express delivery indicator.
   - Click-to-copy `FOODY15` coupon widget with instant feedback.
   - Delhi NCR delivery zone selector and order tracking link.

2. **Translucent Sticky Glassmorphic Navbar**:
   - A_S FOODY signature gold & emerald crest.
   - Live predictive search with instant filtering across all items.
   - Category navigation and mega-menu with featured chef specials.
   - Cart drawer trigger with live item counter and subtotal calculation.

3. **Product Catalog & Custom Filters**:
   - Real-time dietary filters (100% Halal, Antibiotic-Free, Air-Fry Ready, Spicy).
   - Itemized nutrition, cooking instructions, and cold-chain storage guidance.

4. **Cart, Checkout & Tax Invoices**:
   - Real-time GST calculation (CGST/SGST), coupon code discounts, and free delivery thresholds.
   - Instant downloadable FSSAI-compliant tax invoices.

---

## 💻 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI / Client** | React 19, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **State Management** | React Context (Cart, Wishlist, Auth, Settings, Toast) |
| **Backend API** | Node.js, Express 5, Helmet, Compression, Rate Limiting |
| **Database & Auth** | Supabase PostgreSQL, JWT, BCrypt, Local JSON File-DB Fallback |
| **Payment Gateway** | Razorpay Gateway SDK + Cash on Delivery (COD) + Direct UPI QR |

---

## ⚙️ Environment Setup (`.env`)

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=production

# Supabase Credentials (Optional for permanent cloud sync)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Razorpay Payment Gateway (Optional for live payments)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

---

## 🚀 Local Installation & Development

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

The application will start on `http://localhost:3000`.
