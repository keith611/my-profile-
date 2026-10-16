import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader.jsx';
import { useSurvey } from '../context/SurveyContext.jsx';

export function ThankYouPage() {
  const { responseId, answers, resetSurvey } = useSurvey();
  const earlyAccess = answers.early_access_interest;

  return (
    <div className="page page--landing">
      <SiteHeader />
      <main className="hero">
        <p className="eyebrow">{responseId ? `Response ${responseId}` : 'Received'}</p>
        <h1 className="display">Thank you for helping shape Vexa.</h1>
        <p className="lede">
          Your feedback will help shape the future of Vexa — how people meet, connect, remember who
          they met, and follow up.
        </p>
        {earlyAccess === 'Yes' || earlyAccess === 'Maybe' ? (
          <p className="copy">
            You indicated interest in testing Vexa before public launch. We recorded that with your
            responses.
          </p>
        ) : null}
        <div className="hero__actions">
          <Link className="button button--ghost" to="/" onClick={resetSurvey}>
            Back to Vexa
          </Link>
        </div>
      </main>
    </div>
  );
}
