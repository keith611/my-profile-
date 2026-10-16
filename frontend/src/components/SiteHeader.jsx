import { Link } from 'react-router-dom';
import { Logo } from './Logo.jsx';

export function SiteHeader({ compact = false }) {
  return (
    <header className="site-header">
      <Link to="/" className="site-header__brand" aria-label="Vexa home">
        <Logo compact={compact} />
      </Link>
    </header>
  );
}
