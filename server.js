const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Serve static assets from /public
app.use(express.static(path.join(__dirname, 'public')));

// ── Contact form API ────────────────────────────────────────────────────────
// Forwards the submission to Zazŭ (/api/public/nau-web/contact) which sends
// a Telegram message to the admin. Auth uses a static shared secret in the
// x-nau-web-secret header (NAU_WEB_WEBHOOK_SECRET env var).
app.post('/api/contact', async (req, res) => {
  const { name, email, service, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const zazuUrl = process.env.ZAZU_URL;
  const secret  = process.env.NAU_WEB_WEBHOOK_SECRET;

  if (!zazuUrl || !secret) {
    console.error('[Contact] ZAZU_URL or NAU_WEB_WEBHOOK_SECRET is not configured');
    return res.status(503).json({ error: 'Contact endpoint not configured' });
  }

  try {
    const response = await fetch(`${zazuUrl}/api/public/nau-web/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-nau-web-secret': secret,
      },
      body: JSON.stringify({ name, email, service, message }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[Contact] Zazŭ responded ${response.status}: ${text}`);
      return res.status(502).json({ error: 'Failed to forward contact' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[Contact] Failed to reach Zazŭ:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// SPA fallback — all other routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`9nau web running on port ${PORT}`);
});
