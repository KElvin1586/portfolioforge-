# PortfolioForge User Guide

## Getting started

1. Run `npm run dev` and open the app in your browser.
2. The screen has three columns: **section tabs**, **editor**, and **live preview**.
3. Start in **Profile** — fill in name, headline, and about text. Switch tabs on the left to edit each section.

Your work auto-saves to the browser on every keystroke (see the green "auto-saved" badge in the top bar).

## Editing sections

### Profile
Name, headline, about, location, and contact details (email, phone, website).

### Skills
Comma-separated list, shown as chips in the hero block.

### Projects
Each project has title, description, tech stack, live URL, repo URL, and a highlight flag. Free tier: up to 3 projects. Drag order with the ↑/↓ arrows.

### Experience / Education / Certifications
Role–company–period–description items; degree–institution–period for education; name–issuer–year for certifications.

### Contact & Social
Common networks (GitHub, LinkedIn, Twitter, Instagram, Dribbble, website). Empty links are omitted from the export.

### Template
Pick a layout. Free templates: **Minimal** and **Bold**. **Elegant**, **Midnight**, and **Creative** are marked 🔒 PREMIUM.

### Theme
Choose a color palette and a font, and toggle dark mode. Free tier: two palettes + two fonts. Other choices show the lock badge; clicking opens the upgrade modal.

### SEO
SEO title/description/keywords control what ends up in `<title>`, `<meta name="description">`, and OG tags. Without premium these are auto-generated from your profile. With premium you can edit them directly.

### Custom sections (premium)
Free-form titled blocks rendered between standard sections.

### History (premium)
Take named snapshots of the full portfolio, and restore or delete them later. Snapshots are stored locally alongside your data.

## Preview

The right pane renders your generated HTML in an isolated `<iframe>` — what you see is exactly what gets exported. Toggle between **Desktop** (full width) and **Mobile** (400 px) views.

## Export

- **Export HTML** — downloads `index.html`, the complete static site.
- **Export JSON** — downloads your editable portfolio data for backup or migration.
- **Import** — restores a previously exported JSON file (validated before applying).
- **Export All (premium)** — downloads one `index-<template>.html` per template at once.

The exported HTML is fully self-contained (inline CSS), semantic, and includes Open Graph and JSON-LD metadata for social/SEO sharability.

## Upgrading

Premium is a one-time purchase. The upgrade modal shows the configured price (defaults to **$9.99 USD**) and its **Buy Premium** button opens the Lemon Squeezy checkout in a new tab. No payment is processed inside the app.

**Activating Premium after purchase:**

1. Complete the checkout — Lemon Squeezy emails you a license key (it also appears on your order page under "Licenses").
2. Copy the key (format: `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`).
3. Back in PortfolioForge, open the upgrade modal, paste the key into the license field, and click **Activate Premium**.
4. The key is verified against Lemon Squeezy's license API. A valid key unlocks all Premium features instantly; invalid or refunded keys show an error and keep you on Free.

Your license key is saved locally and re-verified whenever the app loads, so Premium stays unlocked on this device. If the key is later refunded or disabled, Premium is revoked on the next online load. Click the **Premium ✓** button to view your license details or deactivate Premium on this device.

## Development premium test mode

While running `vite dev`, a **DEV test mode** toggle appears in the top bar. Switch it on to unlock premium locally; switch off to return to Free. Production builds hide this toggle entirely. Nothing is stored about a "purchase" — it never claims a payment happened.

## Privacy

All data lives in your browser's `localStorage`. Nothing is sent anywhere unless you explicitly export/download a file yourself.
