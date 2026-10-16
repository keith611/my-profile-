const API_BASE = import.meta.env.VITE_API_URL || '';

export async function submitSurvey({ responses, clientRequestId }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(`${API_BASE}/api/survey/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses, clientRequestId }),
      signal: controller.signal,
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok || !data?.success) {
      const error = new Error(
        data?.error ||
          'Something went wrong while submitting your response. Your answers are still here. Please try again.',
      );
      error.status = res.status;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(
        'Something went wrong while submitting your response. Your answers are still here. Please try again.',
      );
    }
    if (error instanceof TypeError) {
      throw new Error(
        'Something went wrong while submitting your response. Your answers are still here. Please try again.',
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
