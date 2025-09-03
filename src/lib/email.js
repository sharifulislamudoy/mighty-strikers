import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // you can swap with SES, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} html - html body
 */
export async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"CrickHeroes" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true, info };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}

/**
 * Send password reset code
 * @param {string} to - recipient email
 * @param {string} code - reset code
 */
export async function sendResetCode(to, code) {
  const subject = "Your CrickHeroes Password Reset Code";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f0c22c;">Password Reset Request</h2>
      <p>You requested to reset your password for your CrickHeroes account.</p>
      <p>Your verification code is: <strong style="font-size: 24px; color: #f0c22c;">${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this reset, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #888; font-size: 12px;">This is an automated message, please do not reply.</p>
    </div>
  `;
  return sendEmail(to, subject, html);
}