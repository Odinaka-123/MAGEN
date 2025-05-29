// services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendAlertEmail = async (to, subject, message) => {
  const mailOptions = {
    from: `MAGEN Security <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: message,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: #1a237e; color: #fff; padding: 24px 24px 12px 24px;">
          <h2 style="margin: 0; font-size: 1.5em;">🔒 MAGEN Security Alert</h2>
        </div>
        <div style="padding: 24px; background: #fafafa;">
          <p style="font-size: 1.1em; color: #222; margin-bottom: 18px;">Dear user,</p>
          <p style="font-size: 1.1em; color: #222; margin-bottom: 18px;">${message}</p>
          <p style="font-size: 1em; color: #444; margin-bottom: 18px;">If you did not expect this alert, please review your account security and contact support if needed.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;" />
          <p style="font-size: 0.95em; color: #888;">This is an automated message from the MAGEN Security Platform.<br>Do not reply to this email.</p>
        </div>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendAlertEmail };