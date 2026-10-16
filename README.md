# Vexa validation mini-website

Polished early-access survey for Vexa. The questionnaire matches the original Google Form: same wording, options, required flags, order, and Yes/Maybe/No branching.

## Architecture

```text
React frontend  →  POST /api/survey/submit  →  Express API  →  ExcelStorage  →  data/vexa_responses.xlsx
```

The questionnaire UI never writes to Excel. Storage is isolated so `ExcelStorage` can later be replaced with `SupabaseStorage` without rebuilding the survey screens.

## Survey questions

Defined in [`shared/survey.js`](shared/survey.js). The frontend imports that file; the backend uses the same file to validate submissions.

## Where responses are stored

- File: `data/vexa_responses.xlsx` (created on first successful submit)
- Sheet: `Responses`
- One row per submission
- Columns: `response_id`, `submitted_at`, then stable question IDs (`email`, `full_name`, …)
- Timestamps are ISO-8601
- Response IDs look like `VEXA-0001`
- Checkbox answers are stored as JSON arrays, for example `["Business events","Conferences"]`
- Multiple-choice answers are stored as strings
- The Excel file is not served by the frontend and is gitignored

## Install

From the repository root:

```bash
npm run install:all
```

Or separately:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

Copy environment variables if needed:

```bash
copy .env.example .env
```

On macOS/Linux: `cp .env.example .env`

`.env` configures the API port, CORS origin, data directory, and Excel filename. Do not commit `.env` or the generated workbook.

## Run (development)

In one terminal, from the repo root:

```bash
npm run dev
```

This starts:

- Backend: http://localhost:4000
- Frontend: http://localhost:5173 (Vite proxies `/api` to the backend)

Or in two terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

## Production-style commands

```bash
npm run build          # frontend production build
npm start              # backend only
```

## API

`POST /api/survey/submit`

```json
{
  "clientRequestId": "optional-uuid-to-prevent-duplicates",
  "responses": {
    "email": "alex@example.com",
    "full_name": "Alex Example"
  }
}
```

Success:

```json
{
  "success": true,
  "responseId": "VEXA-0001"
}
```

`GET /api/health` returns `{ "ok": true }`.

## Replacing Excel with Supabase later

Keep the submit route. Implement the same `saveResponse({ submittedAt, responses })` method as in [`backend/src/storage/ExcelStorage.js`](backend/src/storage/ExcelStorage.js), then construct that adapter in [`backend/src/index.js`](backend/src/index.js) instead of `ExcelStorage`. The React app does not need to change.

## Testing a submission

1. Start `npm run dev`
2. Open http://localhost:5173
3. Complete the survey (choose **No** on the early-access question to skip tester details, or **Yes**/**Maybe** to see them)
4. Submit on the review screen
5. Confirm the thank-you page shows a response ID
6. Open `data/vexa_responses.xlsx` and check that a new row was added
