export const appConfig = {
  name: 'PortfolioForge',
  premiumPrice: (import.meta.env.VITE_PREMIUM_PRICE as string | undefined) ?? '$9.99',
  upgradeUrl:
    (import.meta.env.VITE_UPGRADE_URL as string | undefined) ?? 'https://example.com/portfolioforge-upgrade',
} as const
