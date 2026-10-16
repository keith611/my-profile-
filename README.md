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

The repository includes `vercel.json` for Vercel builds. Set the Vercel project root directory to the repository root (`./`). After deployment, write the site's public URL to the NFC card using an NFC writing app. The profile route works at `/` and at `/profile`.

## Update profile details

Edit `src/data/profile.js`. Add a profile photo at `public` and set `photo` to its public path. The contact card includes tap-to-call links, email, a downloadable vCard, and the Fidika and Africa Dining project links.
