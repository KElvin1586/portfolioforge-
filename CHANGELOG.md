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
