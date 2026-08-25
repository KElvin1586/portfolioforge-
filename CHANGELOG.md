# Changelog

All notable changes to PortfolioForge.

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
