import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { profile } from '../data/profile.js';
import './ProfilePage.css';

function initials(name) {
  return (name || ' ').trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
}

async function contactFile(onStatus, forceDownload = false) {
  const escapeVCard = (value = '') => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  const lines = [
    'BEGIN:VCARD', 'VERSION:3.0', `FN:${escapeVCard(profile.name)}`,
    `TITLE:${escapeVCard(profile.role)}`, `ORG:${escapeVCard(profile.organization)}`,
    ...(profile.phones || []).map((phone) => `TEL;TYPE=CELL:${phone}`),
    profile.email ? `EMAIL:${profile.email}` : '',
    'END:VCARD',
  ].filter(Boolean);
  const vCard = new Blob([lines.join('\r\n')], { type: 'text/vcard;charset=utf-8' });
  const fileName = `${(profile.name || 'contact').trim().replace(/\s+/g, '-')}.vcf`;
  const link = document.createElement('a');
  const isPhone = navigator.userAgentData?.mobile || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  if (isPhone && !forceDownload) {
    if (isAndroid) {
      const androidContactIntent = [
        'intent:#Intent',
        'action=android.intent.action.INSERT',
        'type=vnd.android.cursor.dir/contact',
        `S.name=${encodeURIComponent(profile.name || '')}`,
        `S.phone=${encodeURIComponent(profile.phones?.[0] || '')}`,
        `S.email=${encodeURIComponent(profile.email || '')}`,
        `S.company=${encodeURIComponent(profile.organization || '')}`,
        `S.job_title=${encodeURIComponent(profile.role || '')}`,
        'end',
      ].join(';');
      onStatus('Opening Contacts with your details ready to save.');
      window.location.href = androidContactIntent;
      window.setTimeout(() => {
        if (document.visibilityState === 'visible') {
          onStatus('Contacts did not open. Your browser may block direct app launches.');
          setContactFallbackVisible(true);
        }
      }, 1200);
      return;
    }

    const contact = new File([vCard], fileName, { type: 'text/vcard' });
    if (navigator.canShare?.({ files: [contact] }) && navigator.share) {
      try {
        await navigator.share({ files: [contact], title: `Save ${profile.name} to Contacts` });
        onStatus('Choose Contacts or your phone’s save-contact option to finish.');
        return;
      } catch (error) {
        if (error.name === 'AbortError') {
          onStatus('Contact sharing cancelled. Tap Save Contact to try again.');
          return;
        }
      }
    }
    onStatus('Your browser cannot open the contact share menu. Opening the contact file instead.');
  }

  const fileUrl = URL.createObjectURL(vCard);
  link.href = fileUrl;
  link.download = `${(profile.name || 'contact').trim().replace(/\s+/g, '-')}.vcf`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
  if (!isPhone) onStatus('Contact card downloaded. Open it to add the contact.');
}

export function ProfilePage() {
  const [qrOpen, setQrOpen] = useState(false);
  const [nfcOpen, setNfcOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [contactFallbackVisible, setContactFallbackVisible] = useState(false);
  const phones = profile.phones || [];
  const links = profile.links.filter((item) => item.label && item.url);
  const projects = links.filter((item) => ['Fidika', 'Africa Dining'].includes(item.label));
  const socialLinks = links.filter((item) => ['GitHub', 'LinkedIn', 'Instagram'].includes(item.label));
  const profileUrl = `${window.location.origin}/profile`;
  const whatsappDigits = (phones[1] || '').replace(/\D/g, '');
  const whatsappPhone = whatsappDigits.startsWith('254') ? whatsappDigits : whatsappDigits.startsWith('0') ? `254${whatsappDigits.slice(1)}` : whatsappDigits;
  const whatsappUrl = whatsappPhone ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Hi ${profile.name}, I found your profile on Vexa.`)}` : '';

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${profile.name} · Vexa`, text: 'Connect with me on Vexa.', url: profileUrl });
        setStatus('Profile shared.');
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    copyDetail(profileUrl, 'Profile link');
  };

  const copyDetail = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(`${label} copied.`);
    } catch {
      setStatus(`Could not copy ${label.toLowerCase()}. Please copy it from the profile.`);
    }
  };

  const checkProfileLink = async () => {
    try {
      const response = await fetch(profileUrl, { method: 'HEAD', cache: 'no-store' });
      setStatus(response.ok ? 'Profile link is reachable and ready to add to your NFC card.' : 'Profile link could not be reached. Check the deployed website and try again.');
    } catch {
      setStatus('Profile link could not be reached. Check your connection and try again.');
    }
  };

  const downloadQrCode = () => {
    const source = document.querySelector('#profile-qr-panel svg');
    if (!source) return setStatus('Open the QR code first, then download it.');
    const svg = source.cloneNode(true);
    const [width, height] = svg.getAttribute('viewBox').split(' ').slice(2).map(Number);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', '#ffffff');
    svg.insertBefore(background, svg.firstChild);
    const file = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' });
    const fileUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'David-Keith-Egwa-QR-Code.svg';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
    setStatus('QR code downloaded. It is ready to print or share.');
  };

  return (
    <main className="profile-shell">
      <div className="profile-atmosphere" aria-hidden="true" />
      <article className="profile-page">
        <section className="hero-card" aria-labelledby="profile-name">
          <header className="hero-brand-row">
            <a className="profile-brand" href="/profile" aria-label="Vexa profile">
              <span className="profile-brand-mark" aria-hidden="true">ϟ</span>
              <span><strong>VEXA</strong><small>DIGITAL IDENTITY</small></span>
            </a>
            <span className="identity-tag">PERSONAL PROFILE</span>
          </header>

          <div className="hero-avatar" aria-label={`${profile.name} profile photo placeholder`}>
            {profile.photo ? <img src={profile.photo} alt={profile.name} /> : <span>{initials(profile.name)}</span>}
            <span className="avatar-caption">NAIROBI · KENYA</span>
          </div>

          <p className="profile-kicker">TECHNOLOGY BUILDER · ASPIRING ENTREPRENEUR</p>
          <h1 id="profile-name">{profile.name || 'Your name'}</h1>
          <p className="profile-role">{[profile.role, profile.organization].filter(Boolean).join(' · ')}</p>
          <p className="hero-summary">Turning ideas into useful software and working products.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => { setContactFallbackVisible(false); contactFile(setStatus); }} type="button"><span aria-hidden="true">＋</span> Save Contact</button>
            <button className="button button-secondary" onClick={shareProfile} type="button"><span aria-hidden="true">↗</span> Connect</button>
          </div>
          {contactFallbackVisible && <button className="contact-fallback" onClick={() => { setContactFallbackVisible(false); contactFile(setStatus, true); }} type="button">Download contact file instead</button>}
        </section>

        <div className="profile-content">
          <section className="content-section about-section" aria-labelledby="about-heading">
            <h2 id="about-heading">About me</h2>
            <p>An emerging technology professional passionate about creating useful software, building systems, apps, and websites, and turning ideas into working products.</p>
          </section>

          <section className="content-section" aria-labelledby="skills-heading">
            <h2 id="skills-heading">What I do</h2>
            <ul className="skills-list">
              <li><span className="skill-icon" aria-hidden="true">&lt;/&gt;</span><span><strong>Software development</strong><small>Python, React, Vite, Kotlin, and databases</small></span></li>
              <li><span className="skill-icon" aria-hidden="true">◈</span><span><strong>Systems &amp; applications</strong><small>Building useful systems, apps, and websites</small></span></li>
              <li><span className="skill-icon" aria-hidden="true">✳</span><span><strong>Product building</strong><small>Ideas, prototypes, and startup projects</small></span></li>
            </ul>
          </section>

          {projects.length > 0 && (
            <section className="content-section" aria-labelledby="projects-heading">
              <h2 id="projects-heading">Selected projects</h2>
              <nav className="project-list" aria-label="Selected projects">
                {projects.map((item, index) => (
                  <a className="project-item" key={item.label} href={item.url} target="_blank" rel="noreferrer">
                    <span className={`project-mark project-mark-${index + 1}`} aria-hidden="true">{index === 0 ? 'F' : 'A'}</span>
                    <span className="project-text"><strong>{item.label}</strong><small>Explore project <span aria-hidden="true">↗</span></small></span>
                    <span className="project-arrow" aria-hidden="true">↗</span>
                  </a>
                ))}
              </nav>
            </section>
          )}

          <section className="content-section connect-section" aria-labelledby="connect-heading">
            <h2 id="connect-heading">Let’s connect</h2>
            <nav className="social-links" aria-label="Contact and social links">
              {socialLinks.map((item) => (
                <a key={item.label} href={item.url} target="_blank" rel="noreferrer" aria-label={item.label} title={item.label}>
                  <span aria-hidden="true">{{ GitHub: 'GH', LinkedIn: 'in', Instagram: '◎' }[item.label]}</span>
                </a>
              ))}
              {profile.email && <a href={`mailto:${profile.email}`} aria-label="Email" title="Email"><span aria-hidden="true">@</span></a>}
              {phones[0] && <a href={`tel:${phones[0]}`} aria-label={`Call ${phones[0]}`} title="Call"><span aria-hidden="true">⌕</span></a>}
              {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp" title="WhatsApp"><span aria-hidden="true">WA</span></a>}
            </nav>
            <div className="direct-contact">
              {profile.email && <button type="button" onClick={() => copyDetail(profile.email, 'Email address')}>Copy email</button>}
              {phones.map((phone) => <button type="button" key={phone} onClick={() => copyDetail(phone, 'Phone number')}>Copy {phone}</button>)}
            </div>
            <p className="share-status" role="status" aria-live="polite">{status}</p>
          </section>

          <section className="utility-section" aria-label="QR and NFC tools">
            <div className="utility-heading">
              <div><span className="utility-label">BACKUP</span><h2>No NFC? Scan instead.</h2></div>
              <button className="text-button" type="button" aria-expanded={qrOpen} aria-controls="profile-qr-panel" onClick={() => setQrOpen((open) => !open)}>{qrOpen ? 'Hide QR' : 'Show QR'} <span aria-hidden="true">{qrOpen ? '−' : '+'}</span></button>
            </div>
            {qrOpen && (
              <div className="profile-qr-panel" id="profile-qr-panel">
                <div className="qr-code-shell"><QRCodeSVG value={profileUrl} size={156} level="M" includeMargin title={`QR code for ${profile.name}'s Vexa profile`} bgColor="#ffffff" fgColor="#111622" /></div>
                <div className="qr-copy"><strong>Scan to open this profile</strong><small>Download to print or share.</small><button className="button button-primary qr-download-button" type="button" onClick={downloadQrCode}>Download QR code</button></div>
              </div>
            )}
            <div className="nfc-setup">
              <div className="utility-heading">
                <div><span className="utility-label">NFC CARD</span><h2>Set up your card</h2></div>
                <button className="text-button" type="button" aria-expanded={nfcOpen} aria-controls="nfc-setup-panel" onClick={() => setNfcOpen((open) => !open)}>{nfcOpen ? 'Close' : 'Setup check'} <span aria-hidden="true">{nfcOpen ? '−' : '+'}</span></button>
              </div>
              {nfcOpen && (
                <div className="nfc-setup-panel" id="nfc-setup-panel">
                  <p>Use this profile address as the link on your NFC card:</p>
                  <div className="nfc-profile-url"><code>{profileUrl}</code><button type="button" onClick={() => copyDetail(profileUrl, 'Profile link')}>Copy link</button></div>
                  <ol><li>Write this link to your NFC card with your phone’s NFC writing app.</li><li>Tap the card with another phone and confirm this profile opens.</li></ol>
                  <button className="text-button" type="button" onClick={checkProfileLink}>Check profile link ↗</button>
                  <small>This checks that the website responds. Tap your card with another phone to confirm the NFC setup.</small>
                </div>
              )}
            </div>
          </section>
        </div>
      </article>
      <footer className="profile-footer"><span>MEET · CONNECT · REMEMBER · FOLLOW UP</span><span>Powered by Vexa</span></footer>
    </main>
  );
}
