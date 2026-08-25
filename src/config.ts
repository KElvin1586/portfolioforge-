export const appConfig = {
  name: 'PortfolioForge',
  premiumPrice: (import.meta.env.VITE_PREMIUM_PRICE as string | undefined) ?? '$9.99',
  premiumCurrency: (import.meta.env.VITE_PREMIUM_CURRENCY as string | undefined) ?? 'USD',
  // Lemon Squeezy checkout (public buy link). Can be overridden at build time
  // via VITE_UPGRADE_URL. Public URL only — never put credentials in VITE_*.
  upgradeUrl:
    (import.meta.env.VITE_UPGRADE_URL as string | undefined) ??
    'https://kelvindigitaltools.lemonsqueezy.com/checkout/buy/5a9a0680-dbb4-4c1b-b38c-02c8bbd20fe1',
  // Dev-only premium toggle for local development; compiled out of production builds.
  premiumTestEnabled: import.meta.env.DEV,
} as const
