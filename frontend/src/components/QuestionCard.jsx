import { AnswerControl } from './AnswerControl.jsx';

export function QuestionCard({ question, value, onChange, error, showFullDescription }) {
  return (
    <article className="card question-card">
      <p className="eyebrow">{question.sectionTitle}</p>
      {showFullDescription && question.sectionDescription ? (
        <div className="section-copy">
          {question.sectionDescription.split('\n\n').map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      ) : null}
      <h1 className="question-title" id={`${question.id}-label`}>
        {question.question}
        {question.required ? (
          <span className="required" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="optional"> Optional</span>
        )}
      </h1>
      <AnswerControl question={question} value={value} onChange={onChange} />
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
    </article>
  );
}
