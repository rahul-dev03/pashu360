import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { speechToText, textToSpeech, getSarvamStatus } from './src/server/sarvamService.ts';

dotenv.config();

const app = express();
export default app;

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Body parsers for JSON and base64 audio data
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

/**
 * Sarvam AI Health / Config Status
 * Does not leak secrets; only indicates readiness
 */
app.get('/api/sarvam/status', (req, res) => {
  try {
    const status = getSarvamStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Server-side Speech-to-Text Proxy Route
 * Accepts audioBase64 or audioBuffer with languageCode and context
 */
app.post('/api/sarvam/stt', async (req, res) => {
  try {
    const { audioBase64, mimeType, languageCode, stepContext, promptHint } = req.body;

    const result = await speechToText({
      audioBase64,
      mimeType,
      languageCode,
      stepContext,
      promptHint,
    });

    res.json(result);
  } catch (err: any) {
    console.error('STT endpoint error:', err);
    res.status(500).json({
      error: err.message || 'Speech to text processing failed',
      isPlaceholder: true,
      transcript: 'Gauri gave 12.4 litres this morning.',
    });
  }
});

/**
 * Server-side Text-to-Speech Proxy Route
 * Accepts text and languageCode, returns base64 audio
 */
app.post('/api/sarvam/tts', async (req, res) => {
  try {
    const { text, languageCode, speaker, pace } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text string is required for TTS' });
      return;
    }

    const result = await textToSpeech({
      text,
      languageCode,
      speaker,
      pace,
    });

    res.json(result);
  } catch (err: any) {
    console.error('TTS endpoint error:', err);
    res.status(500).json({
      error: err.message || 'Text to speech synthesis failed',
      isPlaceholder: true,
    });
  }
});

/**
 * Mount Vite in dev or static files in production
 */
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      console.warn('Production build dist folder not found. Falling back.');
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Pashu360 Server] Running on http://0.0.0.0:${PORT} (env: ${isProd ? 'production' : 'development'})`);
  });
}

// Vercel invokes the exported Express app through its function adapter; it must
// not start a long-lived listener there. Keep the existing local dev/start flow.
if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
