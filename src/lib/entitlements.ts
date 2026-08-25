import type { Tier, TemplateId, FontChoice, PaletteId } from '../types'

/**
 * Centralized entitlement registry. Every gated feature is declared here;
 * UI should gate on this registry instead of ad-hoc checks.
 */

export interface Entitlement {
  tier: Tier
  label: string
}

export const ENTITLEMENTS = {
  editor: { tier: 'free', label: 'Portfolio editor' },
  'basic-templates': { tier: 'free', label: 'Minimal & Bold templates' },
  'basic-themes': { tier: 'free', label: 'Two palettes & two fonts' },
  'html-export': { tier: 'free', label: 'Static HTML export' },
  'json-export': { tier: 'free', label: 'JSON export & import' },
  'local-save': { tier: 'free', label: 'Local auto-save' },
  'remove-project-cap': { tier: 'premium', label: 'Unlimited projects' },
  'advanced-seo': { tier: 'premium', label: 'Advanced SEO controls' },
  'custom-sections': { tier: 'premium', label: 'Custom sections' },
  'version-history': { tier: 'premium', label: 'Version history & snapshots' },
  'export-all-templates': { tier: 'premium', label: 'Batch template export' },
} as const satisfies Record<string, Entitlement>

export type EntitlementId = keyof typeof ENTITLEMENTS

export const FREE_TEMPLATES: TemplateId[] = ['minimal', 'bold']
export const FREE_PALETTES: PaletteId[] = ['slate', 'ocean']
export const FREE_FONTS: FontChoice[] = ['sans', 'serif']
export const FREE_PROJECT_LIMIT = 3

export const TEMPLATES: {
  id: TemplateId
  name: string
  description: string
  free: boolean
}[] = [
  { id: 'minimal', name: 'Minimal', description: 'Clean, focused single-column layout.', free: true },
  { id: 'bold', name: 'Bold', description: 'Strong headings and punchy section blocks.', free: true },
  { id: 'elegant', name: 'Elegant', description: 'Refined serif layout with editorial rhythm.', free: false },
  { id: 'midnight', name: 'Midnight', description: 'Dark, high-contrast developer theme.', free: false },
  { id: 'creative', name: 'Creative', description: 'Gradient hero and playful card layout.', free: false },
]

export interface Access {
  premium: boolean
}

export function isEntitled(id: EntitlementId, access: Access): boolean {
  return access.premium || ENTITLEMENTS[id].tier === 'free'
}

export function isTemplateAllowed(t: TemplateId, access: Access): boolean {
  return access.premium || FREE_TEMPLATES.includes(t)
}

export function isPaletteAllowed(p: PaletteId, access: Access): boolean {
  return access.premium || FREE_PALETTES.includes(p)
}

export function isFontAllowed(f: FontChoice, access: Access): boolean {
  return access.premium || FREE_FONTS.includes(f)
}
