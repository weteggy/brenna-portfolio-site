# Brenna Stevens — Portfolio

## Quick start (local)

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Add your photos

Drop image files into the `public/` folder, then update the references in
`src/BrennaPortfolio.jsx`:

- **Landing page photo** — search for `photo-placeholder.jpg` and replace with
  your filename (e.g. `headshot.jpg`)
- **About page carousel** — search for `Photo 1`, `Photo 2`, etc. in the
  `PhotoCarouselWithBio` component and replace with your image paths
- **Resume link** — search for `href="#resume"` and replace with a real URL or
  a path to a PDF in `public/` (e.g. `/Brenna-Stevens-Resume.pdf`)

Images in `public/` are served from the root, so `public/headshot.jpg` becomes
`/headshot.jpg` in your code.

## Build for production

```bash
npm run build
```

Output goes to `dist/`. You can preview it locally with `npm run preview`.

## Deploy to Vercel (recommended)

1. Push this folder to a GitHub repo
2. Go to vercel.com and sign in with GitHub
3. Click "New Project" and import your repo
4. Vercel auto-detects Vite — just click Deploy
5. (Optional) Add a custom domain in project settings

## Deploy to Netlify (alternative)

1. Push to GitHub
2. Go to netlify.com, sign in, click "Add new site" > "Import an existing project"
3. Select your repo — Netlify auto-detects the build command
4. Click Deploy

## Custom domain

Both Vercel and Netlify provide free subdomains, but for a portfolio you'll
want your own. Buy one from Namecheap, Cloudflare, or Google Domains, then
add it in your hosting provider's dashboard — they'll give you the DNS records
to point at.
