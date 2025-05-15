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
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: message
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendAlertEmail };