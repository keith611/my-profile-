import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { validationMessage } from '../components/AnswerControl.jsx';
import { ProgressBar } from '../components/ProgressBar.jsx';
import { QuestionCard } from '../components/QuestionCard.jsx';
import { SiteHeader } from '../components/SiteHeader.jsx';
import { useSurvey } from '../context/SurveyContext.jsx';

export function SurveyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { answers, currentIndex, setIndex, setAnswer, visibleQuestions, submitted } = useSurvey();
  const [error, setError] = useState('');
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (submitted) {
      navigate('/thank-you', { replace: true });
    }
  }, [submitted, navigate]);

  useEffect(() => {
    if (currentIndex > visibleQuestions.length - 1) {
      setIndex(Math.max(0, visibleQuestions.length - 1));
    }
  }, [currentIndex, visibleQuestions.length, setIndex]);

  useEffect(() => {
    const targetId = location.state?.questionId;
    if (!targetId) return;
    const index = visibleQuestions.findIndex((question) => question.id === targetId);
    if (index >= 0) setIndex(index);
    navigate('/survey', { replace: true, state: {} });
  }, [location.state, navigate, setIndex, visibleQuestions]);

  const question = visibleQuestions[currentIndex];
  const total = visibleQuestions.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  const showFullDescription = useMemo(() => {
    if (!question?.sectionDescription) return false;
    const firstInSection = visibleQuestions.findIndex((item) => item.sectionId === question.sectionId);
    return firstInSection === currentIndex;
  }, [question, visibleQuestions, currentIndex]);

  if (!question) {
    return null;
  }

  const value = answers[question.id];

  const goNext = () => {
    const message = validationMessage(question, value);
    if (message) {
      setError(message);
      return;
    }
    setError('');
    if (isLast) {
      navigate('/review');
      return;
    }
    setIndex(currentIndex + 1);
    setAnimKey((key) => key + 1);
  };

  const goBack = () => {
    setError('');
    if (isFirst) {
      navigate('/intro');
      return;
    }
    setIndex(currentIndex - 1);
    setAnimKey((key) => key + 1);
  };

  const handleChange = (nextValue) => {
    setError('');
    setAnswer(question.id, nextValue);
  };

  return (
    <div className="page">
      <SiteHeader compact />
      <main className="narrow survey-main">
        <ProgressBar current={currentIndex + 1} total={total} />
        <div key={animKey} className="transition-panel">
          <QuestionCard
            question={question}
            value={value}
            onChange={handleChange}
            error={error}
            showFullDescription={showFullDescription}
          />
        </div>
        <div className="actions">
          <button type="button" className="button button--ghost" onClick={goBack}>
            Back
          </button>
          <button type="button" className="button button--primary" onClick={goNext}>
            {isLast ? 'Review' : 'Next'}
          </button>
        </div>
        <p className="fineprint">{question.required ? 'Required' : 'You can skip this question'}</p>
      </main>
    </div>
  );
}
