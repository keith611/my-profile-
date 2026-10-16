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

The repository includes `vercel.json` for Vercel builds. Set the Vercel project root directory to the repository root (`./`). The QR code, sharing action, and downloadable contact card use the stable public profile URL configured in `src/pages/ProfilePage.jsx`. Set `VITE_PUBLIC_PROFILE_URL` in Vercel to override that URL if the production domain changes. After deployment, write the same public URL to the NFC card using an NFC writing app. The profile route works at `/` and at `/profile`.

## Update profile details

Edit `src/data/profile.js`. Add a professional photo under `public` and set `photo` to its public path; DK initials remain as the fallback. This file also defines the project cards, contact details, and social links used by the downloadable vCard.
