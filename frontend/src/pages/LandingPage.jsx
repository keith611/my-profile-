import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader.jsx';
import { useSurvey } from '../context/SurveyContext.jsx';

export function LandingPage() {
  const { submitted, resetSurvey } = useSurvey();

  return (
    <div className="page page--landing">
      <SiteHeader />
      <main className="hero">
        <p className="eyebrow">Early access · Market validation</p>
        <h1 className="display">
          Meet. Connect.
          <br />
          Remember. Follow Up.
        </h1>
        <p className="lede">
          Vexa is exploring a better way for professionals to exchange contacts, build meaningful
          connections, remember the people they meet, and follow up.
        </p>
        <div className="hero__actions">
          <Link className="button button--ghost" to="/trading-bot">
            Open Trading Strategy
          </Link>
          {submitted ? (
            <Link className="button button--primary" to="/intro" onClick={resetSurvey}>
              Start the Survey
            </Link>
          ) : (
            <Link className="button button--primary" to="/intro">
              Start the Survey
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
