import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader.jsx';
import { SURVEY_INTRO, SURVEY_TITLE } from '../data/survey.js';

export function IntroPage() {
  return (
    <div className="page">
      <SiteHeader compact />
      <main className="narrow">
        <article className="card">
          <p className="eyebrow">Survey</p>
          <h1>{SURVEY_TITLE}</h1>
          {SURVEY_INTRO.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="copy">
              {paragraph}
            </p>
          ))}
          <div className="actions">
            <Link className="button button--ghost" to="/">
              Back
            </Link>
            <Link className="button button--primary" to="/survey">
              Start
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
