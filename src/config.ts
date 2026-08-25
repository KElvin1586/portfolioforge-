export const appConfig = {
  name: 'PortfolioForge',
  premiumPrice: (import.meta.env.VITE_PREMIUM_PRICE as string | undefined) ?? '$9.99',
  premiumCurrency: (import.meta.env.VITE_PREMIUM_CURRENCY as string | undefined) ?? 'USD',
  upgradeUrl: (import.meta.env.VITE_UPGRADE_URL as string | undefined) ?? `${import.meta.env.BASE_URL}checkout.html`,
  premiumTestEnabled: import.meta.env.DEV,
} as const
