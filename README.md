# David Keith Egwa — NFC profile

A mobile-first digital contact page for David Keith Egwa. The Vexa profile is the website visitors see when they tap the NFC card.

## Develop locally

```bash
npm install
npm run dev
```

Open the local address printed by Vite.

## Build

```bash
npm run build
```

The production site is generated in `dist`.

## Deploy

The repository includes `vercel.json` for Vercel builds. Set the Vercel project root directory to the repository root (`./`). The QR code, sharing action, and downloadable contact cards use the stable public profile URL configured in `src/pages/ProfilePage.jsx`. Set `VITE_PUBLIC_PROFILE_URL` in Vercel to override the production base URL if the domain changes. David's profile is at `/profile`; Emmanuel's is at `/emmanuel`.

## Update profile details

Edit `src/data/profile.js` or `src/data/emmanuelProfile.js` to update each person's profile. Add photos under `public` and set `photo` to the public path; initials remain as the fallback. These files define project cards, contact details, and social links used by each downloadable vCard.
