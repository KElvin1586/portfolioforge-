# Installation

## Requirements

- Node.js 18+ (Node 20+ recommended) and npm.

## Setup

```bash
git clone <repo-url>
cd portfolioforge
npm install
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server (defaults to http://localhost:5173). |
| `npm run build` | Type-check and produce a production bundle in `dist/`. |
| `npm run preview` | Serve the production bundle locally. |
| `npm run test` | Run the vitest suite. |
| `npm run typecheck` | Type-only check with `tsc --noEmit`. |

## Optional configuration

Premium pricing, currency, and the checkout URL are configurable with Vite environment variables. Copy `.env.example` to `.env` (git-ignored) and fill in your values:

```
VITE_PREMIUM_PRICE=$9.99
VITE_PREMIUM_CURRENCY=USD
VITE_UPGRADE_URL=https://kelvindigitaltools.lemonsqueezy.com/checkout/buy/5a9a0680-dbb4-4c1b-b38c-02c8bbd20fe1
```

Defaults: price `$9.99`, currency `USD`, and the production Lemon Squeezy checkout URL above (already the default, so no override is required). Premium is activated after purchase with the Lemon Squeezy license key emailed to the buyer — the app verifies keys against Lemon Squeezy's public license API. Full details in DEPLOYMENT.md and PRICING.md. Never put private API keys or payment secrets in `VITE_*` variables; they ship publicly in the frontend bundle.

## Troubleshooting

- If the dev server port is taken, pass one: `npm run dev -- --port 3000`.
- If `npm install` fails with a proxy/registry error, retry with npm's default registry.
- To clear saved data, open the app and run `localStorage.clear()` in dev tools, or use the browser's Clear Site Data UI.
