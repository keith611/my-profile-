# David Keith Egwa — NFC profile

A mobile-first digital contact page for David Keith Egwa. The Vexa profile is the website visitors see when they tap the NFC card.

## Develop locally

```bash
npm install --prefix frontend
npm run dev --prefix frontend
```

Open the local address printed by Vite.

## Build

```bash
npm run build --prefix frontend
```

The production site is generated in `frontend/dist`.

## Deploy

The repository includes `vercel.json` for Vercel builds. Import the repository into Vercel and deploy. After deployment, write the site's public URL to the NFC card using an NFC writing app. The profile route works at `/` and at `/profile`.

## Update profile details

Edit `frontend/src/data/profile.js`. Add a profile photo at `frontend/public` and set `photo` to its public path. The contact card includes tap-to-call links, email, a downloadable vCard, and the Fidika and Africa Dining project links.
