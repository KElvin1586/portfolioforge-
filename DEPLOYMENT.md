# Deployment

PortfolioForge builds to a static bundle in `dist/`. Host it anywhere that serves static files.

## Build

```bash
npm ci
npm run build
```

The output in `dist/` is everything you need. `tsc` runs as part of `npm run build` to fail on type errors.

## Static hosts

- **Netlify** — build command `npm run build`, publish directory `dist`.
- **Vercel** — same; no serverless functions required.
- **GitHub Pages** — run `npm run build`, push `dist/` to the `gh-pages` branch, or use the `dist/` output with GitHub Actions.
- **S3/CloudFront or any object storage** — upload `dist/` with correct `Content-Type` headers.

## SPA routing

PortfolioForge uses a single `index.html` with no client-side routing. No rewrite rules needed; every request just serves that file.

## Environment variables

Configure the one-time premium price and the upgrade URL at build time:

```
VITE_PREMIUM_PRICE=$9.99
VITE_PREMIUM_CURRENCY=USD
VITE_UPGRADE_URL=https://payments.yourdomain.com/portfolioforge
```

Commit a `.env` or use your host's environment-variable settings so the values are baked into the bundle. Without `VITE_UPGRADE_URL`, users land on the bundled test checkout page (`/checkout.html`); set a real provider URL before selling premium.

## Exported portfolio sites

The HTML file produced by *Export HTML* is likewise static: users can drop `index.html` onto any static host and the generated CSS/metadata works without this app.

## Post-deploy checklist

1. Open the deployed app; make a sample export and verify the downloaded `index.html`.
2. Confirm the upgrade URL points to your checkout page.
3. Confirm correct MIME type for HTML/JS assets on your static host.
