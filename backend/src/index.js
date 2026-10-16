import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createSurveyRouter } from './routes/survey.js';
import { ExcelStorage } from './storage/ExcelStorage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

dotenv.config({ path: path.join(rootDir, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = Number.parseInt(process.env.PORT || '4000', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(rootDir, process.env.DATA_DIR)
  : path.join(rootDir, 'data');
const EXCEL_FILENAME = process.env.EXCEL_FILENAME || 'vexa_responses.xlsx';
const excelPath = path.join(DATA_DIR, EXCEL_FILENAME);

const storage = new ExcelStorage({ filePath: excelPath });

const app = express();
app.disable('x-powered-by');
app.use(
  cors({
    origin: CORS_ORIGIN.split(',').map((value) => value.trim()),
  }),
);
app.use(express.json({ limit: '256kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/survey', createSurveyRouter(storage));

app.use((err, _req, res, _next) => {
  console.error('Unhandled error');
  res.status(500).json({
    success: false,
    error:
      'Something went wrong while submitting your response. Your answers are still here. Please try again.',
  });
});

app.listen(PORT, () => {
  console.log(`Vexa API listening on http://localhost:${PORT}`);
});
