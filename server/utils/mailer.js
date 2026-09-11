// server/utils/mailer.js
import nodemailer from 'nodemailer';

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Visitor-supplied text lands in an HTML email body, so it has to be escaped —
// otherwise a submitted <a href> or <img src> renders live in the inbox.
function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendContactEmail({ name, email, message }) {
  const transporter = getTransporter();

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  await transporter.sendMail({
    // Header injection guard: a newline in `name` would otherwise let a
    // submitter append their own Bcc/Subject headers.
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_TO || process.env.SMTP_USER,
    replyTo: email.replace(/[\r\n]/g, ''),
    subject: `New message from ${String(name).replace(/[\r\n]/g, ' ')} — rehanfazal.dev`,
    text: `From: ${name} (${email})\n\n${message}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2>New portfolio contact message</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      </div>
    `,
  });
}
