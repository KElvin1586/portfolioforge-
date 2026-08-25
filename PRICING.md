# PortfolioForge pricing

PortfolioForge uses a Free + Premium (freemium) model. Premium is a **one-time purchase**, not a subscription.

| | Free | Premium |
| --- | --- | --- |
| Price | $0 | $9.99 USD one-time (configurable) |
| Editor | ✅ all sections | ✅ |
| Templates | Minimal, Bold | All five |
| Projects | up to 3 | Unlimited |
| Themes | 2 palettes, 2 fonts | All palettes & fonts, dark mode |
| Export | HTML (current template) + JSON | + batch all-template export |
| SEO | auto-generated | fully editable |
| Custom sections | — | ✅ |
| Version history | — | ✅ |

## How pricing is configured

Price and currency come from build-time environment variables:

```
VITE_PREMIUM_PRICE=$9.99
VITE_PREMIUM_CURRENCY=USD
```

The upgrade button points at `VITE_UPGRADE_URL`. Until you set it, the app uses the bundled internal test checkout page at `/checkout.html`, which processes **no payments**.

## Connecting a real checkout

Premium activation is a simple link redirect — the app never handles card data or payment APIs. To sell Premium for real:

1. **Create the product** in your chosen payment provider (any provider that offers hosted checkout or payment links works).
2. **Create the checkout/payment link** for that product in the provider's dashboard.
3. **Set the environment variable** before building (`.env` is git-ignored; see `.env.example`):
   ```
   VITE_UPGRADE_URL=https://YOUR_REAL_CHECKOUT_URL
   ```
   Use your provider's real public checkout URL here — not a placeholder.
4. **Rebuild** the app (`npm run build`) — `VITE_*` variables are baked into the bundle at build time, not runtime.
5. **Test the checkout** end-to-end with the provider's test mode before going live.
6. **Never put private API keys or payment secrets in `VITE_*` variables** — everything prefixed `VITE_` ships publicly in the frontend JavaScript.

Until step 3–4 are done, no payment is possible; the upgrade flow lands on the clearly-labeled internal test page.

## Free tier users

The free plan is genuinely usable: all editors, two templates, three projects, HTML & JSON export, local save, live preview. Premium features stay visible with a 🔒 PREMIUM badge; clicking opens the upgrade modal.

## Development premium test mode

Development test mode ≠ real customer payment. The **DEV test mode** toggle exists only so developers can exercise the premium UI while building; it is compiled out of production builds entirely (`import.meta.env.DEV` gate) and never implies a purchase. Real customers unlock premium only through the configured checkout URL above. See USER-GUIDE for details.
