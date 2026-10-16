import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDisplayAnswer, validationMessage } from '../components/AnswerControl.jsx';
import { SiteHeader } from '../components/SiteHeader.jsx';
import { useSurvey } from '../context/SurveyContext.jsx';
import { submitSurvey } from '../services/surveyApi.js';

export function ReviewPage() {
  const navigate = useNavigate();
  const {
    answers,
    visibleQuestions,
    goToQuestion,
    submitted,
    clientRequestId,
    markSubmitted,
  } = useSurvey();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (submitted) {
      navigate('/thank-you', { replace: true });
    }
  }, [submitted, navigate]);

  const incomplete = visibleQuestions.find((question) => validationMessage(question, answers[question.id]));

  const handleEdit = (id) => {
    goToQuestion(id);
    navigate('/survey', { state: { questionId: id } });
  };

  const handleSubmit = async () => {
    if (submitting) return;

    if (incomplete) {
      setError('Please complete the required questions before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {};
      for (const question of visibleQuestions) {
        const value = answers[question.id];
        if (value !== undefined) {
          payload[question.id] = value;
        }
      }

      const result = await submitSurvey({
        responses: payload,
        clientRequestId,
      });

      markSubmitted(result.responseId);
      navigate('/thank-you', { replace: true });
    } catch (err) {
      setError(
        err.message ||
          'Something went wrong while submitting your response. Your answers are still here. Please try again.',
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <SiteHeader compact />
      <main className="narrow">
        <article className="card">
          <p className="eyebrow">Almost done</p>
          <h1>Review your responses</h1>
          <p className="copy">You can edit any answer before sending it.</p>

          <ol className="review-list">
            {visibleQuestions.map((question) => (
              <li key={question.id} className="review-item">
                <div>
                  <p className="review-item__q">{question.question}</p>
                  <p className="review-item__a">{formatDisplayAnswer(question, answers[question.id])}</p>
                </div>
                <button type="button" className="text-button" onClick={() => handleEdit(question.id)}>
                  Edit
                </button>
              </li>
            ))}
          </ol>

          {error ? (
            <p className="error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="actions">
            <button
              type="button"
              className="button button--ghost"
              onClick={() => navigate('/survey')}
              disabled={submitting}
            >
              Back
            </button>
            <button
              type="button"
              className="button button--primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit Responses'}
            </button>
          </div>
        </article>
      </main>
    </div>
  );
}
