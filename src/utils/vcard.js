function escapeVCard(value = '') {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function foldLine(line) {
  const chunks = [];
  let chunk = '';
  for (const character of line) {
    if (new TextEncoder().encode(chunk + character).length > 75) {
      chunks.push(chunk);
      chunk = ` ${character}`;
    } else {
      chunk += character;
    }
  }
  chunks.push(chunk);
  return chunks;
}

export function createVCard({ profile, phones, profileUrl, links }) {
  const nameParts = profile.name.trim().split(/\s+/);
  const familyName = nameParts.pop() || '';
  const givenName = nameParts.join(' ');
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeVCard(familyName)};${escapeVCard(givenName)};;;`,
    `FN:${escapeVCard(profile.name)}`,
    `TITLE:${escapeVCard(profile.title || '')}`,
    ...phones.map((phone) => `TEL;TYPE=CELL:${escapeVCard(phone.replace(/[^\d+]/g, ''))}`),
    ...(profile.email ? [`EMAIL;TYPE=INTERNET,WORK:${escapeVCard(profile.email)}`] : []),
    `URL:${escapeVCard(profileUrl)}`,
    ...links.map((item) => `URL:${escapeVCard(item.url)}`),
    'END:VCARD',
  ];
  return lines.flatMap(foldLine).join('\r\n');
}
