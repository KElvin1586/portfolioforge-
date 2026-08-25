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

The upgrade button points at `VITE_UPGRADE_URL`. Until you set it, the app uses the bundled internal test checkout page at `/checkout.html`.

## Free tier users

The free plan is genuinely usable: all editors, two templates, three projects, HTML & JSON export, local save, live preview. Premium features stay visible with a 🔒 PREMIUM badge; clicking opens the upgrade modal.

## Development premium test mode

Developers can toggle premium locally without touching the checkout — see USER-GUIDE. Only available when the app runs in development (`vite dev`), never in production builds.
