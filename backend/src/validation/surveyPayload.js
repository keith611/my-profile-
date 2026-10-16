import {
  allQuestions,
  CONDITIONAL_QUESTION_IDS,
  EARLY_ACCESS_CONTINUE_VALUES,
  EARLY_ACCESS_QUESTION_ID,
  isQuestionVisible,
  questionsById,
} from '../../../shared/survey.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isBlank(value) {
  return value == null || (typeof value === 'string' && value.trim() === '');
}

function serializeAnswer(question, value) {
  if (question.type === 'checkboxes') {
    const selected = Array.isArray(value) ? value : [];
    const allowed = new Set(question.options);
    const ordered = question.options.filter((option) => selected.includes(option));
    const extras = selected.filter((option) => !allowed.has(option));
    if (extras.length > 0) {
      return { error: `Invalid option for ${question.id}` };
    }
    return { value: JSON.stringify(ordered) };
  }

  if (isBlank(value)) {
    return { value: '' };
  }

  if (question.type === 'multiple_choice') {
    if (!question.options.includes(value)) {
      return { error: `Invalid option for ${question.id}` };
    }
    return { value: String(value) };
  }

  if (question.type === 'linear_scale') {
    const n = Number(value);
    if (!Number.isInteger(n) || n < question.scale.min || n > question.scale.max) {
      return { error: `Invalid scale value for ${question.id}` };
    }
    return { value: String(n) };
  }

  if (question.type === 'email') {
    const text = String(value).trim();
    if (!EMAIL_PATTERN.test(text)) {
      return { error: `Please enter a valid email for ${question.id}` };
    }
    return { value: text };
  }

  if (question.type === 'phone') {
    const text = String(value).trim();
    const digits = text.replace(/\D/g, '');
    if (digits.length < 7) {
      return { error: `Please enter a valid phone number for ${question.id}` };
    }
    return { value: text };
  }

  return { value: String(value).trim() };
}

export function validateSurveyPayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, status: 400, error: 'Invalid request body.' };
  }

  const incoming = body.responses;
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
    return { ok: false, status: 400, error: 'responses must be an object.' };
  }

  const unknownKeys = Object.keys(incoming).filter((key) => !questionsById[key]);
  if (unknownKeys.length > 0) {
    return { ok: false, status: 400, error: 'Unexpected question identifiers were submitted.' };
  }

  const answers = { ...incoming };
  const earlyAccess = answers[EARLY_ACCESS_QUESTION_ID];
  const includeTesterDetails = EARLY_ACCESS_CONTINUE_VALUES.includes(earlyAccess);

  if (!includeTesterDetails) {
    for (const id of CONDITIONAL_QUESTION_IDS) {
      delete answers[id];
    }
  }

  const serialized = {};

  for (const question of allQuestions) {
    const visible = isQuestionVisible(question, answers);
    const raw = answers[question.id];

    if (!visible) {
      serialized[question.id] = '';
      continue;
    }

    const result = serializeAnswer(question, raw);
    if (result.error) {
      return { ok: false, status: 400, error: result.error };
    }

    if (question.required) {
      if (question.type === 'checkboxes') {
        const parsed = JSON.parse(result.value || '[]');
        if (parsed.length === 0) {
          return {
            ok: false,
            status: 400,
            error: `Please select an answer for: ${question.question}`,
          };
        }
      } else if (isBlank(result.value)) {
        return {
          ok: false,
          status: 400,
          error: `Please provide an answer for: ${question.question}`,
        };
      }
    }

    serialized[question.id] = result.value;
  }

  return {
    ok: true,
    responses: serialized,
    clientRequestId:
      typeof body.clientRequestId === 'string' ? body.clientRequestId.slice(0, 80) : null,
  };
}
