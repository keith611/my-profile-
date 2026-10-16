import fs from 'node:fs/promises';
import path from 'node:path';
import * as XLSX from 'xlsx';
import { COLUMN_ORDER } from '../../../shared/survey.js';
import { Storage } from './Storage.js';

const SHEET_NAME = 'Responses';
const ID_PREFIX = 'VEXA-';

function padId(n) {
  return `${ID_PREFIX}${String(n).padStart(4, '0')}`;
}

function parseNumericId(responseId) {
  if (typeof responseId !== 'string' || !responseId.startsWith(ID_PREFIX)) {
    return 0;
  }
  const n = Number.parseInt(responseId.slice(ID_PREFIX.length), 10);
  return Number.isFinite(n) ? n : 0;
}

export class ExcelStorage extends Storage {
  constructor({ filePath }) {
    super();
    this.filePath = filePath;
    this.queue = Promise.resolve();
  }

  async saveResponse(record) {
    return this.#enqueue(() => this.#writeRow(record));
  }

  #enqueue(work) {
    const run = this.queue.then(work, work);
    this.queue = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }

  async #writeRow(record) {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });

    let rows = [];
    try {
      await fs.access(this.filePath);
      const buffer = await fs.readFile(this.filePath);
      const existing = XLSX.read(buffer, { type: 'buffer', cellDates: true });
      const sheet = existing.Sheets[SHEET_NAME];
      if (sheet) {
        rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
      }
    } catch (error) {
      if (error && error.code !== 'ENOENT') {
        throw error;
      }
    }

    const nextNumber =
      rows.reduce((max, row) => Math.max(max, parseNumericId(row.response_id)), 0) + 1;
    const responseId = padId(nextNumber);

    const row = {};
    for (const column of COLUMN_ORDER) {
      if (column === 'response_id') {
        row[column] = responseId;
      } else if (column === 'submitted_at') {
        row[column] = record.submittedAt;
      } else {
        row[column] = record.responses[column] ?? '';
      }
    }

    rows.push(row);

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(rows, { header: COLUMN_ORDER });
    XLSX.utils.book_append_sheet(workbook, sheet, SHEET_NAME);

    const output = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const tempPath = `${this.filePath}.tmp`;
    await fs.writeFile(tempPath, output);
    await fs.rename(tempPath, this.filePath);

    return { responseId };
  }
}
