# PortfolioForge ⚒️

A portfolio website builder for developers, designers, and freelancers. Build, customize, and export a polished, SEO-ready portfolio site — entirely in your browser. No backend, no accounts, no data leaves your machine.

Built with **React + TypeScript + Vite + Tailwind CSS**. Zero databases, zero paid APIs.

## Try it

```bash
npm install
npm run dev
```

Open http://localhost:5173 and start editing. Everything auto-saves locally.

Docs: [User guide](./USER-GUIDE.md) · [Installation](./INSTALLATION.md) · [Deployment](./DEPLOYMENT.md) · [Pricing](./PRICING.md)

## Features

- **Full profile editor** — name, headline, about, location, email, phone, website.
- **Sections** — skills, projects, experience, education, certifications, contact/social links.
- **Live preview** — rendered in an isolated frame with desktop/mobile toggle.
- **Multiple templates** — Minimal, Bold (free); Elegant, Midnight, Creative (premium).
- **Theme customization** — palettes, font stacks, dark mode toggle.
- **Export** — one-click `index.html` static site, JSON data export/import, or all templates at once.
- **Local save/load** — everything persists in `localStorage`.
- **Version history** — snapshots you can restore.
- **SEO** — proper `<title>`, description, keywords, Open Graph tags, JSON-LD, semantic HTML.
- **Privacy first** — all editing happens client-side.

## Freemium model

| | Free | Premium |
| --- | --- | --- |
| Builder | ✅ full editor | ✅ plus custom sections |
| Templates | Minimal, Bold | All five |
| Projects | up to 3 | Unlimited |
| Themes | 2 palettes, 2 fonts | all palettes + fonts + dark mode |
| Export | HTML + JSON | + batch export of all templates |
| SEO | auto-generated | fully editable |
| History | — | snapshots |

Premium is a one-time purchase (default **$9.99 USD**, configurable via `VITE_PREMIUM_PRICE` / `VITE_PREMIUM_CURRENCY`) sold through a Lemon Squeezy hosted checkout (`VITE_UPGRADE_URL`). After purchase, customers activate Premium with the license key Lemon Squeezy emails them; the app verifies keys directly against Lemon Squeezy's public license API. No payment is processed inside the app and no payment credentials ship in the bundle — see [PRICING.md](PRICING.md) for the full flow and security model.

A "DEV test mode" toggle appears in the header **only when running `vite dev`** and unlocks premium locally for development. Production builds hide it.

## Development

```bash
npm run dev       # start dev server
npm run test      # vitest unit tests
npm run typecheck # strict TypeScript
npm run build     # tsc + vite production build → dist/
```

## Project structure

```
src/
  config.ts           # premium price / upgrade URL
  types.ts            # portfolio data model
  lib/
    entitlements.ts   # centralized Free/Premium registry
    license.ts        # Lemon Squeezy license-key verification + storage
    premium.ts        # premium state: license revalidation, grace window
    sample.ts         # sample/empty portfolio factory
    storage.ts        # local save/load, import validation, snapshots
    export.ts         # static HTML generation for each template
  components/
    ui.tsx            # shared primitives
    Editors.tsx       # section editors, template/theme pickers
    Preview.tsx       # live preview frame
    Modals.tsx        # upgrade / manage-premium modal
  App.tsx             # shell, tabs, toolbar
```

## How export works

`renderHtml(data)` produces a complete `<!doctype html>` document with inline CSS, semantic structure, OG metadata, and JSON-LD. Downloaded via Blob; no server needed.

## License

[MIT](./LICENSE.md) · [Commercial terms for Premium](./COMMERCIAL-LICENSE.md)
