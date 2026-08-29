// Email Delivery Service for A_S FOODY
// Multi-layer delivery: Supabase Auth SMTP (Brevo), Direct Brevo API, Nodemailer SMTP, and Local Console Log

import nodemailer from 'nodemailer';
import { supabase } from '../services/supabase.js';

const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.BREVO_SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.BREVO_SMTP_KEY || process.env.BREVO_API_KEY;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }
  return null;
};

export const sendSignupOtpEmail = async (email, name, otp) => {
  const cleanEmail = email.toLowerCase().trim();
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FBF9F4; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Arial, sans-serif; color: #13231B;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FBF9F4; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #06170E; border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 24px; overflow: hidden; box-shadow: 0 15px 40px rgba(6, 23, 14, 0.15);">
          <!-- Header Branding -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
              <span style="font-family: Georgia, serif; font-size: 26px; font-weight: 800; color: #FAF7F0; letter-spacing: 2px;">A_S <span style="color: #22C55E;">FOODY</span></span>
              <p style="margin: 5px 0 0 0; font-size: 10px; color: #F5B83D; letter-spacing: 3px; text-transform: uppercase;">Gourmet Cold-Chain Delivery</p>
            </td>
          </tr>
          <!-- Content Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: #FFFFFF; text-align: center;">Verify Your Account</h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #D1D5DB; text-align: center;">
                Welcome to A_S FOODY. Please enter the following 6-digit one-time passcode to complete verification:
              </p>
              <!-- Passcode Display -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 15px 36px; background-color: rgba(34, 197, 94, 0.1); border: 2px solid #22C55E; color: #22C55E; font-size: 32px; font-weight: 800; border-radius: 12px; letter-spacing: 6px; font-family: monospace;">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0 0; font-size: 12px; color: #9CA3AF; text-align: center;">
                ⏱️ Code is valid for 15 minutes. Never share this code with anyone.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 20px 40px 40px 40px; background-color: #04100a; border-top: 1px solid rgba(255, 255, 255, 0.03);">
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #9CA3AF;">Need assistance? Contact our concierge service.</p>
              <p style="margin: 0; font-size: 11px; color: #F5B83D; font-weight: 600;">+91 63862 56770 &bull; ashutoshgifthamper9334@gmail.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // 1. Try Nodemailer SMTP if configured
  const transporter = getTransporter();
  if (transporter) {
    try {
      const senderEmail = process.env.SMTP_FROM_EMAIL || 'ashutoshgifthamper9334@gmail.com';
      await transporter.sendMail({
        from: `"A_S FOODY" <${senderEmail}>`,
        to: cleanEmail,
        subject: `${otp} is your A_S FOODY verification code`,
        html: htmlContent
      });
      console.log(`✉️ [Nodemailer SMTP] Verification email sent to ${cleanEmail}`);
      return { success: true };
    } catch (e) {
      console.warn('Nodemailer delivery notice:', e.message);
    }
  }

  // 2. Try Direct Brevo API if BREVO_API_KEY is configured
  if (process.env.BREVO_API_KEY) {
    try {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'A_S FOODY', email: process.env.SMTP_FROM_EMAIL || 'ashutoshgifthamper9334@gmail.com' },
          to: [{ email: cleanEmail, name: name || 'Valued Customer' }],
          subject: `${otp} is your A_S FOODY verification code`,
          htmlContent: htmlContent,
        }),
      });
      console.log(`✉️ [Brevo API] Verification email sent to ${cleanEmail}`);
      return { success: true };
    } catch (e) {
      console.warn('Brevo API delivery note:', e.message);
    }
  }

  // 3. Local Server Console Log for instantaneous developer testing
  console.log(`\n======================================================`);
  console.log(`✉️  [EMAIL SERVICE] SIGNUP VERIFICATION OTP`);
  console.log(`To: ${cleanEmail} (${name || 'Customer'})`);
  console.log(`OTP Code: ${otp}`);
  console.log(`Valid for: 15 Minutes`);
  console.log(`======================================================\n`);

  return { success: true };
};

export const sendPasswordResetEmail = async (email, resetUrl, role = 'customer') => {
  const cleanEmail = email.toLowerCase().trim();
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FBF9F4; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Arial, sans-serif; color: #13231B;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FBF9F4; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #06170E; border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 24px; overflow: hidden; box-shadow: 0 15px 40px rgba(6, 23, 14, 0.15);">
          <!-- Header Branding -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
              <span style="font-family: Georgia, serif; font-size: 26px; font-weight: 800; color: #FAF7F0; letter-spacing: 2px;">A_S <span style="color: #22C55E;">FOODY</span></span>
              <p style="margin: 5px 0 0 0; font-size: 10px; color: #F5B83D; letter-spacing: 3px; text-transform: uppercase;">Gourmet Cold-Chain Delivery</p>
            </td>
          </tr>
          <!-- Content Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: #FFFFFF; text-align: center;">Reset Password Request</h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #D1D5DB; text-align: center;">
                We received a request to update the password for your A_S FOODY account. Click the button below to set a new password:
              </p>
              <!-- Button -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #22C55E 0%, #15803D 100%); color: #06170E; font-size: 13px; font-weight: 800; text-decoration: none; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);">
                      Set New Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0 0; font-size: 12px; color: #9CA3AF; text-align: center;">
                🔒 Link expires in 15 minutes. If you did not request this, you can safely ignore this email.
              </p>
              <p style="margin: 12px 0 0 0; font-size: 10px; color: #6B7280; text-align: center; word-break: break-all;">
                Direct link: <a href="${resetUrl}" style="color: #22C55E;">${resetUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 20px 40px 40px 40px; background-color: #04100a; border-top: 1px solid rgba(255, 255, 255, 0.03);">
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #9CA3AF;">Need assistance? Contact our concierge service.</p>
              <p style="margin: 0; font-size: 11px; color: #F5B83D; font-weight: 600;">+91 63862 56770 &bull; ashutoshgifthamper9334@gmail.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // 1. Try Nodemailer SMTP if configured
  const transporter = getTransporter();
  if (transporter) {
    try {
      const senderEmail = process.env.SMTP_FROM_EMAIL || 'ashutoshgifthamper9334@gmail.com';
      await transporter.sendMail({
        from: `"A_S FOODY Security" <${senderEmail}>`,
        to: cleanEmail,
        subject: `Reset Your A_S FOODY Password`,
        html: htmlContent
      });
      console.log(`✉️ [Nodemailer SMTP] Password reset email sent to ${cleanEmail}`);
      return { success: true };
    } catch (e) {
      console.warn('Nodemailer delivery notice:', e.message);
    }
  }

  // 2. Try Direct Brevo API
  if (process.env.BREVO_API_KEY) {
    try {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'A_S FOODY Security', email: process.env.SMTP_FROM_EMAIL || 'ashutoshgifthamper9334@gmail.com' },
          to: [{ email: cleanEmail }],
          subject: `Reset Your A_S FOODY Password`,
          htmlContent
        })
      });
      console.log(`✉️ [Brevo API] Password reset email delivered to ${cleanEmail}`);
      return { success: true };
    } catch (e) {
      console.warn(`Brevo API delivery note:`, e.message);
    }
  }

  // 3. Trigger Supabase Auth Password Reset Email
  try {
    await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: resetUrl
    });
    console.log(`✉️ [Supabase Auth Brevo] Password reset email triggered for ${cleanEmail}`);
  } catch (e) {
    console.warn(`Supabase Auth reset email trigger note:`, e.message);
  }

  // 4. Developer / Local Server Console Log
  console.log(`\n======================================================`);
  console.log(`✉️  [EMAIL SERVICE] PASSWORD RESET LINK`);
  console.log(`To: ${cleanEmail} (${role})`);
  console.log(`Reset Link: ${resetUrl}`);
  console.log(`Valid for: 15 Minutes`);
  console.log(`======================================================\n`);

  return { success: true };
};
