const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Serve static assets from /public
app.use(express.static(path.join(__dirname, 'public')));

// ── Contact form API ────────────────────────────────────────────────────────
// Simple endpoint: logs to console + responds OK.
// For production, wire up an email service (Nodemailer / Resend) or
// forward to Zazŭ via the ZAZU_CONTACT_ENDPOINT env var.
app.post('/api/contact', (req, res) => {
  const { name, email, service, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Log the contact request (visible in Hostinger logs)
  console.log('── New contact submission ──────────────────────');
  console.log(`Name:    ${name}`);
  console.log(`Email:   ${email}`);
  console.log(`Service: ${service || 'Not specified'}`);
  console.log(`Message: ${message}`);
  console.log('────────────────────────────────────────────────');

  // TODO (optional): forward to Zazŭ Telegram or send email via Nodemailer/Resend

  return res.status(200).json({ ok: true });
});

// SPA fallback — all other routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`9nau web running on port ${PORT}`);
});
