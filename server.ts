import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));

  // Telegram test endpoint
  app.post('/api/telegram/test', async (req, res) => {
    try {
      const { botToken, chatId } = req.body;
      if (!botToken || !chatId) {
        return res.status(400).json({ success: false, error: 'Bot Token and Chat ID are required.' });
      }

      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: '🟢 Test connection successful from Cassava Weighbridge & Invoice System!',
        }),
      });

      const data = await response.json();
      if (data.ok) {
        return res.json({ success: true, message: 'Connection successful!' });
      } else {
        return res.status(400).json({ success: false, error: data.description || 'Telegram API error' });
      }
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
    }
  });

  // Telegram send invoice endpoint
  app.post('/api/telegram/send-invoice', async (req, res) => {
    try {
      const { botToken, chatId, invoiceNumber, customerName, totalAmount, currency, imageBase64 } = req.body;
      if (!botToken || !chatId) {
        return res.status(400).json({ success: false, error: 'Telegram Bot Token and Chat ID not configured in settings.' });
      }
      if (!imageBase64) {
        return res.status(400).json({ success: false, error: 'Invoice image data is missing.' });
      }

      const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ success: false, error: 'Invalid image data format.' });
      }
      const buffer = Buffer.from(matches[2], 'base64');

      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append(
        'caption',
        `📄 *INVOICE / វិក្កយបត្រ*\n` +
        `• លេខវិក្កយបត្រ: \`${invoiceNumber}\`\n` +
        `• អតិថិជន: ${customerName || 'General Customer'}\n` +
        `• ទឹកប្រាក់សរុប: *${Number(totalAmount).toLocaleString()} ${currency === 'USD' ? '$' : '៛'}*`
      );
      formData.append('parse_mode', 'Markdown');

      const blob = new Blob([buffer], { type: 'image/png' });
      formData.append('photo', blob, `${invoiceNumber}.png`);

      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
      const response = await fetch(telegramUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.ok) {
        return res.json({ success: true, message: 'Invoice sent to Telegram successfully!' });
      } else {
        return res.status(400).json({ success: false, error: data.description || 'Failed to send to Telegram' });
      }
    } catch (err: any) {
      console.error('Telegram send error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Server error sending invoice to Telegram' });
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
