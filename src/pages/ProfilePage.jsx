import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
  const [qrOpen, setQrOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const phones = profile.phones || [];
  const links = profile.links.filter((item) => item.label && item.url);
  const profileUrl = `${window.location.origin}/profile`;
  const digits = (phones[0] || '').replace(/\D/g, '');
  const whatsappPhone = digits.startsWith('254') ? digits : digits.startsWith('0') ? `254${digits.slice(1)}` : digits;
  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Hi ${profile.name}, I found your profile on Vexa.`)}`
    : '';

  const shareProfile = async () => {
    const shareData = {
      title: `${profile.name} · Vexa`,
      text: 'Connect with me on Vexa.',
      url: profileUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareStatus('Profile shared.');
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(profileUrl);
      setShareStatus('Profile link copied.');
    } catch {
      setShareStatus('Copy the profile address from your browser to share it.');
    }
  };

  return (
    <main className="profile-shell">
      <div className="profile-atmosphere" aria-hidden="true" />

      <header className="profile-topbar">
        <a className="profile-brand" href="/profile" aria-label="Vexa profile">
          <span className="profile-brand-mark">v</span>
          <span>Vexa</span>
        </a>
        <span className="profile-topbar-note"><span className="topbar-spark" /> DIGITAL CONTACT CARD</span>
      </header>

      <section className="profile-card" aria-labelledby="profile-name">
        <aside className="profile-identity">
          <div className="profile-identity-art" aria-hidden="true">
            <span className="identity-orbit identity-orbit-one" />
            <span className="identity-orbit identity-orbit-two" />
            <span className="identity-orbit identity-orbit-three" />
            <span className="identity-art-label">VEXA<br />NETWORK</span>
          </div>

          <div className="profile-identity-body">
            <div className="profile-avatar-wrap">
              {profile.photo ? (
                <img className="profile-avatar" src={profile.photo} alt={profile.name} />
              ) : (
                <div className="profile-avatar profile-avatar-initials" aria-hidden="true">{initials(profile.name)}</div>
              )}
            </div>
            <p className="profile-kicker">A new connection</p>
            <h1 id="profile-name">{profile.name || 'Your name'}</h1>
            <p className="profile-role">{[profile.role, profile.organization].filter(Boolean).join(' · ')}</p>
            {profile.location && <p className="profile-location"><span aria-hidden="true">⌖</span> {profile.location}</p>}
            <div className="identity-tag"><span /> NFC PROFILE</div>
          </div>

          <div className="identity-side-note" aria-hidden="true">MEET · CONNECT · FOLLOW UP</div>
        </aside>

        <div className="profile-details">
          <section className="about-section" aria-labelledby="about-heading">
            <div className="section-heading">
              <span className="section-index">01</span>
              <h2 id="about-heading">A little about me</h2>
            </div>
            <p className="profile-bio">{profile.bio}</p>
          </section>

          <section className="contact-section" aria-labelledby="contact-heading">
            <div className="section-heading section-heading-compact">
              <span className="section-index">02</span>
              <h2 id="contact-heading">Let’s connect</h2>
            </div>
            <div className="profile-actions">
              {phones.map((phone, index) => (
                <a key={phone} className="contact-action contact-call" href={`tel:${phone}`} aria-label={`Call ${phone}`}>
                  <span className="action-icon" aria-hidden="true">↗</span>
                  <span><small>{index === 0 ? 'PHONE' : 'ALTERNATE'}</small><strong>{phone.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3')}</strong></span>
                </a>
              ))}
              {profile.email && (
                <a className="contact-action contact-email" href={`mailto:${profile.email}`}>
                  <span className="action-icon" aria-hidden="true">@</span>
                  <span><small>EMAIL</small><strong>{profile.email}</strong></span>
                </a>
              )}
              {whatsappUrl && (
                <a className="contact-action contact-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
                  <span className="action-icon" aria-hidden="true">WA</span>
                  <span><small>MESSAGE ME</small><strong>WhatsApp</strong></span>
                </a>
              )}
              <button className="contact-action contact-save" onClick={contactFile} type="button">
                <span className="action-icon" aria-hidden="true">＋</span>
                <span><small>KEEP IN TOUCH</small><strong>Save contact</strong></span>
              </button>
              <button className="contact-action contact-share" onClick={shareProfile} type="button">
                <span className="action-icon" aria-hidden="true">↗</span>
                <span><small>PASS IT ON</small><strong>Share profile</strong></span>
              </button>
            </div>
            <p className="share-status" role="status" aria-live="polite">{shareStatus}</p>
          </section>

          {links.length > 0 && (
            <section className="work-section" aria-labelledby="work-heading">
              <div className="section-heading section-heading-compact">
                <span className="section-index">03</span>
                <h2 id="work-heading">A few things I’ve built</h2>
              </div>
              <nav className="profile-links" aria-label="Websites and profiles">
                {links.map((item, index) => (
                  <a key={item.label} href={item.url} target="_blank" rel="noreferrer">
                    <span className="project-number">0{index + 1}</span>
                    <span className="project-name">{item.label}</span>
                    <span className="project-arrow" aria-hidden="true">↗</span>
                  </a>
                ))}
              </nav>
            </section>
          )}

          <section className="qr-section" aria-labelledby="qr-heading">
            <div className="qr-section-top">
              <div className="section-heading section-heading-compact">
                <span className="section-index">04</span>
                <h2 id="qr-heading">No NFC? Scan instead.</h2>
              </div>
              <button
                className="qr-toggle"
                type="button"
                aria-expanded={qrOpen}
                aria-controls="profile-qr-panel"
                onClick={() => setQrOpen((open) => !open)}
              >
                {qrOpen ? 'Hide QR' : 'Show QR'}
                <span aria-hidden="true">{qrOpen ? '−' : '+'}</span>
              </button>
            </div>
            {qrOpen && (
              <div className="profile-qr-panel" id="profile-qr-panel">
                <div className="qr-code-shell">
                  <QRCodeSVG
                    value={profileUrl}
                    size={156}
                    level="M"
                    includeMargin
                    title={`QR code for ${profile.name}'s Vexa profile`}
                    bgColor="#ffffff"
                    fgColor="#111622"
                  />
                </div>
                <div className="qr-copy">
                  <strong>Scan to open this profile</strong>
                  <span>Save the QR code or scan it with your phone camera to connect.</span>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>

      <footer className="profile-footer">
        <span>Met through an NFC card</span><span className="footer-dot">✳</span><span>Powered by Vexa</span>
      </footer>
    </main>
  );
}
