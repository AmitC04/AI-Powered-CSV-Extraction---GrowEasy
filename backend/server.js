require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const aiService = require('./services/ai.service');
const csvService = require('./services/csv.service');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// In-memory storage — no disk I/O needed
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.originalname.endsWith('.csv')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are accepted.'));
    }
  },
});

// ── Health Check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    model: aiService.MODEL_NAME,
  });
});

// ── SSE helper ────────────────────────────────────────────────
function sendSSE(res, type, payload) {
  res.write(`event: ${type}\ndata: ${JSON.stringify(payload)}\n\n`);
}

// ── Main CSV Processing Endpoint ──────────────────────────────
app.post('/api/process', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No CSV file uploaded.' });
  }

  // Switch to SSE streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable Nginx buffering if applicable
  res.flushHeaders();

  try {
    sendSSE(res, 'progress', { percent: 2, message: 'Parsing CSV…', batch: 0, totalBatches: 0 });

    // 1. Parse CSV
    const records = await csvService.parseCsv(req.file.buffer);
    if (!records.length) {
      sendSSE(res, 'error', { message: 'The uploaded CSV file contains no data rows.' });
      return res.end();
    }

    const BATCH_SIZE = 10;
    const totalBatches = Math.ceil(records.length / BATCH_SIZE);

    sendSSE(res, 'progress', {
      percent: 5,
      message: `Parsed ${records.length} rows. Starting AI extraction…`,
      batch: 0,
      totalBatches,
    });

    // 2. Process in batches
    let allExtracted = [];
    let totalSkipped = 0;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batchIndex = Math.floor(i / BATCH_SIZE) + 1;
      const batch = records.slice(i, i + BATCH_SIZE);

      sendSSE(res, 'progress', {
        percent: Math.round(5 + (batchIndex / totalBatches) * 90),
        message: `Extracting batch ${batchIndex} of ${totalBatches} with AI…`,
        batch: batchIndex,
        totalBatches,
      });

      const { extracted, skipped } = await aiService.processBatch(batch);
      allExtracted = allExtracted.concat(extracted);
      totalSkipped += skipped;
    }

    // 3. Final result
    sendSSE(res, 'complete', {
      percent: 100,
      data: {
        totalImported: allExtracted.length,
        totalSkipped,
        records: allExtracted,
      },
    });
  } catch (err) {
    console.error('Error processing CSV:', err.message || err);
    sendSSE(res, 'error', {
      message: err.message || 'An unexpected error occurred during processing.',
    });
  } finally {
    res.end();
  }
});

// ── Multer error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

// ── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  GrowEasy Backend running on http://localhost:${PORT}`);
  console.log(`🤖  AI Model: ${aiService.MODEL_NAME}`);
  console.log(`🔑  Groq API Key: ${process.env.GROQ_API_KEY ? '✓ Found' : '✗ MISSING — set GROQ_API_KEY in .env'}\n`);
});
