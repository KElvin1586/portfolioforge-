# Changelog

All notable changes to PortfolioForge.

## [1.2.0] — 2026-08-25

### Added
- Real payment integration with Lemon Squeezy: the Premium upgrade button opens the production hosted checkout, and Premium is unlocked by validating the license key emailed to the buyer (`POST /v1/licenses/validate` — public, CORS-enabled endpoint; no API secret ships in the bundle).
- License management: the upgrade modal accepts a license key, shows specific errors for invalid/disabled/expired keys, and the **Premium ✓** button opens a manage view with license details and per-device deactivation.
- Stored license keys are re-validated against Lemon Squeezy on every app load; refunded/disabled keys are revoked automatically (7-day offline grace window).
- Unit tests for license validation and premium state derivation (`src/lib/license.test.ts`, `src/lib/premium.test.ts`).

### Changed
- `VITE_UPGRADE_URL` now defaults to the production Lemon Squeezy checkout URL.
- Premium state is derived solely from a verified license key — there is no stored "premium flag", so editing localStorage cannot unlock Premium.

### Removed
- Internal fake checkout page (`public/checkout.html`) and all placeholder/example checkout URLs.

## [1.0.0] — 2024-08-25

### Added
- Full portfolio editor: profile, skills, projects, experience, education, certifications, contact/social links.
- Four-section live preview with desktop/mobile toggle rendered in an isolated frame.
- Five templates (Minimal, Bold free; Elegant, Midnight, Creative premium).
- Theme customization with palettes, font stacks, and dark-mode support.
- Freemium gating: premium features show lock badge + upgrade modal; free tier includes editor, 2 templates, 3 projects, JSON export.
- Export: `index.html` static site, JSON data export, batch all-template export (premium), JSON import with validation.
- Local persistence via `localStorage` with auto-save.
- Version history snapshots (premium).
- SEO metadata: title/description/keywords, Open Graph tags, JSON-LD structured data.
- Unit tests for export generation, feature gating, and storage round-trip.
- Docs: README, USER-GUIDE, INSTALLATION, DEPLOYMENT, LICENSE.

### Config
- `VITE_PREMIUM_PRICE` / `VITE_UPGRADE_URL` (defaults `$9.99` / placeholder URL).

---

## [1.1.0] — 2025-08-25

### Added
- Centralized entitlement registry (`src/lib/entitlements.ts`) replacing scattered gating checks.
- Internal test checkout page at `/checkout.html` (marked `noindex, nofollow`) used when no real checkout URL is configured.
- Favicon (`public/favicon.svg`) and OG metadata on the app shell `index.html`.
- `PRICING.md` and `COMMERCIAL-LICENSE.md`; renamed license to `LICENSE.md`.

### Changed
- Upgrade URL default previously pointed at a placeholder documentation domain. Now defaults to `/checkout.html`; production overrides via `VITE_UPGRADE_URL`.
- Premium test toggle is hidden in production builds and explicitly labelled "DEV test mode".
- Sample portfolio data no longer contains placeholder domains.
- Sample email updated to a non-placeholder domain.

### Fixed
- Preview iframe mobile width clamps under 400 px viewports; preview panel keeps a minimum height on narrow screens.
- Grid/list editor buttons now have accessible labels; upgrade modal supports Escape and grabs focus correctly.
