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

The upgrade button points at `VITE_UPGRADE_URL`, which defaults to the production Lemon Squeezy checkout:

```
https://kelvindigitaltools.lemonsqueezy.com/checkout/buy/5a9a0680-dbb4-4c1b-b38c-02c8bbd20fe1
```

## How Premium activation works (Lemon Squeezy license keys)

PortfolioForge uses Lemon Squeezy for checkout **and** license verification:

1. The customer clicks **Buy Premium** → the Lemon Squeezy checkout opens in a new tab.
2. After purchase, Lemon Squeezy emails the customer a **license key** (also shown on the order page under "Licenses").
3. The customer pastes the key into the upgrade modal's **Activate Premium** field.
4. The app validates the key directly against Lemon Squeezy's public license API
   (`POST https://api.lemonsqueezy.com/v1/licenses/validate`), which requires **no API key** and is CORS-enabled, so it can be called securely from the browser.
5. Only a `valid: true` response from Lemon Squeezy unlocks Premium. Invalid, disabled/refunded, or expired keys show a specific error and keep the app on Free.

### Security properties

- **No secrets in the bundle.** The validate endpoint is unauthenticated by design; no Lemon Squeezy API key, webhook secret, or payment credential is ever shipped. `VITE_*` variables are public by nature — only the public checkout URL goes there.
- **No premium flag in storage.** localStorage holds only the customer's license key (base64-obfuscated) plus a last-verified timestamp. Premium is derived in memory from a successful validation, so editing localStorage/URL/console values cannot unlock anything: an invented or tampered key fails revalidation on next load and is revoked.
- **Revalidation on every load.** The stored key is re-verified against Lemon Squeezy in the background on each app load. Refunded/disabled keys are downgraded as soon as the app is online. Offline users keep Premium for a 7-day grace window (`OFFLINE_GRACE_MS` in `src/lib/premium.ts`).
- **`validate` not `activate`.** Validation does not consume activation slots, so the same key works across reloads and devices (up to the key's activation limit policy on your Lemon Squeezy product).

### Lemon Squeezy product requirements

For activation to work, the product behind the checkout URL must:

1. Have **license key generation enabled** (product settings → "License keys"), so buyers receive a key after purchase.
2. Be a **one-time** product (matches the one-time pricing model).

Optional: point the product's redirect/receipt at the app, but customers can always copy the key from the email or order page.

**Never put private API keys or payment secrets in `VITE_*` variables** — everything prefixed `VITE_` ships publicly in the frontend JavaScript. This app needs none: checkout is hosted by Lemon Squeezy and license validation uses their public, unauthenticated endpoint.

## Free tier users

The free plan is genuinely usable: all editors, two templates, three projects, HTML & JSON export, local save, live preview. Premium features stay visible with a 🔒 PREMIUM badge; clicking opens the upgrade modal.

## Development premium test mode

Development test mode ≠ real customer payment. The **DEV test mode** toggle exists only so developers can exercise the premium UI while building; it is compiled out of production builds entirely (`import.meta.env.DEV` gate), does not touch localStorage license records, and never implies a purchase. Real customers unlock Premium only by validating a Lemon Squeezy license key issued after purchase. See USER-GUIDE for details.
