import { profile } from '../data/profile.js';
import './ProfilePage.css';

function initials(name) {
  return (name || ' ').trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
}

function contactFile() {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.name}`,
    `TITLE:${profile.role}`,
    `ORG:${profile.organization}`,
    ...(profile.phones || []).map((phone) => `TEL;TYPE=CELL:${phone}`),
    profile.email ? `EMAIL:${profile.email}` : '',
    ...profile.links.filter((item) => item.url).slice(0, 1).map((item) => `URL:${item.url}`),
    'END:VCARD',
  ].filter(Boolean);
  const blob = new Blob([lines.join('\r\n')], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(profile.name || 'contact').trim().replace(/\s+/g, '-')}.vcf`;
  link.click();
  URL.revokeObjectURL(url);
}

export function ProfilePage() {
  const phones = profile.phones || [];
  const hasContact = phones.length > 0 || profile.email;
  const links = profile.links.filter((item) => item.label && item.url);

  return (
    <main className="profile-shell">
      <div className="profile-grain" aria-hidden="true" />
      <header className="profile-topbar">
        <a className="profile-brand" href="/profile" aria-label="Vexa profile">
          <span className="profile-brand-mark">v</span>
          <span>Vexa</span>
        </a>
        <span className="profile-topbar-note">A little more than a business card</span>
      </header>

      <section className="profile-card" aria-labelledby="profile-name">
        <div className="profile-card-cover" aria-hidden="true">
          <span className="cover-orbit cover-orbit-one" />
          <span className="cover-orbit cover-orbit-two" />
          <span className="cover-stamp">CONNECT<br />WITH INTENTION</span>
        </div>

        <div className="profile-content">
          <div className="profile-avatar-wrap">
            {profile.photo ? (
              <img className="profile-avatar" src={profile.photo} alt={profile.name} />
            ) : (
              <div className="profile-avatar profile-avatar-initials" aria-hidden="true">{initials(profile.name)}</div>
            )}
            <span className="profile-online-dot" aria-label="Vexa digital profile" />
          </div>

          <p className="profile-kicker">A new connection</p>
          <h1 id="profile-name">{profile.name || 'Your name'}</h1>
          {(profile.role || profile.organization) && (
            <p className="profile-role">{[profile.role, profile.organization].filter(Boolean).join(' · ')}</p>
          )}
          {profile.location && <p className="profile-location"><span aria-hidden="true">⌖</span> {profile.location}</p>}
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}

          {hasContact && (
            <div className="profile-actions">
              {phones.map((phone) => <a key={phone} className="profile-button profile-button-primary" href={`tel:${phone}`} aria-label={`Call ${phone}`}>{phone.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3')}</a>)}
              {profile.email && <a className="profile-button profile-button-secondary" href={`mailto:${profile.email}`}>Email</a>}
              <button className="profile-button profile-button-outline" onClick={contactFile} type="button">Save contact</button>
            </div>
          )}

          {links.length > 0 && (
            <nav className="profile-links" aria-label="Professional links">
              {links.map((item) => (
                <a key={item.label} href={item.url} target="_blank" rel="noreferrer">
                  <span>{item.label}</span><span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          )}

          <div className="profile-bottom-rule"><span /> <span>MAKE THE INTRODUCTION COUNT</span> <span /></div>
        </div>
      </section>

      <footer className="profile-footer">
        <span>Met through an NFC card</span>
        <span className="footer-dot">·</span>
        <span>Powered by Vexa</span>
      </footer>
    </main>
  );
}
