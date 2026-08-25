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

Configure the one-time premium price and the checkout URL at build time. Copy `.env.example` to `.env` (git-ignored) or use your host's environment-variable settings:

```
VITE_PREMIUM_PRICE=$9.99
VITE_PREMIUM_CURRENCY=USD
VITE_UPGRADE_URL=https://kelvindigitaltools.lemonsqueezy.com/checkout/buy/5a9a0680-dbb4-4c1b-b38c-02c8bbd20fe1
```

`VITE_UPGRADE_URL` defaults to the production Lemon Squeezy checkout above, so no env override is needed unless you change providers or products. The checkout is hosted by Lemon Squeezy; after purchase, customers receive a license key by email and activate Premium inside the app (the key is verified against Lemon Squeezy's public license API — see PRICING.md for the full flow and security model).

If you ever switch providers:

1. Create the product in your provider's dashboard (enable license keys if you want in-app activation).
2. Set `VITE_UPGRADE_URL` to the new public checkout URL.
3. Rebuild with `npm run build` — `VITE_*` values are baked into the bundle at build time, so changing them requires a rebuild and redeploy.
4. Test the checkout end-to-end (use the provider's test mode first).
5. Never put private API keys or payment secrets in `VITE_*` variables — they ship publicly in the frontend bundle. This app never touches provider credentials.

The development-only premium test toggle is compiled out of production builds; it is unrelated to real customer payment.

## Exported portfolio sites

The HTML file produced by *Export HTML* is likewise static: users can drop `index.html` onto any static host and the generated CSS/metadata works without this app.

## Post-deploy checklist

1. Open the deployed app; make a sample export and verify the downloaded `index.html`.
2. Confirm the upgrade URL points to your checkout page.
3. Confirm correct MIME type for HTML/JS assets on your static host.
