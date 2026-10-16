import express from 'express';
import { validateSurveyPayload } from '../validation/surveyPayload.js';

const recentRequestIds = new Map();
const REQUEST_TTL_MS = 1000 * 60 * 30;

function rememberRequest(id, responseId) {
  if (!id) return;
  recentRequestIds.set(id, { responseId, at: Date.now() });
  for (const [key, value] of recentRequestIds) {
    if (Date.now() - value.at > REQUEST_TTL_MS) {
      recentRequestIds.delete(key);
    }
  }
}

export function createSurveyRouter(storage) {
  const router = express.Router();

  router.post('/submit', async (req, res) => {
    const validated = validateSurveyPayload(req.body);
    if (!validated.ok) {
      return res.status(validated.status).json({
        success: false,
        error: validated.error,
      });
    }

    if (validated.clientRequestId && recentRequestIds.has(validated.clientRequestId)) {
      const existing = recentRequestIds.get(validated.clientRequestId);
      return res.json({
        success: true,
        responseId: existing.responseId,
        duplicate: true,
      });
    }

    try {
      const submittedAt = new Date().toISOString();
      const { responseId } = await storage.saveResponse({
        submittedAt,
        responses: validated.responses,
      });

      rememberRequest(validated.clientRequestId, responseId);

      return res.json({
        success: true,
        responseId,
      });
    } catch {
      return res.status(500).json({
        success: false,
        error:
          'Something went wrong while submitting your response. Your answers are still here. Please try again.',
      });
    }
  });

  return router;
}
