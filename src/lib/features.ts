import type { Tier, TemplateId, FontChoice, PaletteId } from '../types'

export type FeatureId =
  | 'basic-editor'
  | 'templates-minimal-bold'
  | 'template-elegant'
  | 'template-midnight'
  | 'template-creative'
  | 'custom-sections'
  | 'unlimited-projects'
  | 'advanced-themes'
  | 'advanced-seo'
  | 'export-html'
  | 'export-json'
  | 'export-multi'
  | 'version-history'
  | 'local-save'

export interface Feature {
  id: FeatureId
  label: string
  tier: Tier
}

export const FREE_TEMPLATES: TemplateId[] = ['minimal', 'bold']
export const FREE_PALETTES: PaletteId[] = ['slate', 'ocean']
export const FREE_FONTS: FontChoice[] = ['sans', 'serif']
export const FREE_PROJECT_LIMIT = 3

export const TEMPLATES: { id: TemplateId; name: string; description: string; free: boolean }[] = [
  { id: 'minimal', name: 'Minimal', description: 'Clean, focused single-column layout.', free: true },
  { id: 'bold', name: 'Bold', description: 'Strong headings and punchy section blocks.', free: true },
  { id: 'elegant', name: 'Elegant', description: 'Refined serif layout with editorial rhythm.', free: false },
  { id: 'midnight', name: 'Midnight', description: 'Dark, high-contrast developer theme.', free: false },
  { id: 'creative', name: 'Creative', description: 'Gradient hero and playful card layout.', free: false },
]

export interface Access {
  premium: boolean
}

export function isTemplateAllowed(t: TemplateId, access: Access): boolean {
  return access.premium || FREE_TEMPLATES.includes(t)
}

export function allowedFeature(f: FeatureId, access: Access): boolean {
  if (access.premium) return true
  return (
    f === 'basic-editor' ||
    f === 'templates-minimal-bold' ||
    f === 'export-html' ||
    f === 'export-json' ||
    f === 'local-save'
  )
}

export function premiumFeatureLabel(f: FeatureId): string {
  const premium: FeatureId[] = [
    'template-elegant',
    'template-midnight',
    'template-creative',
    'custom-sections',
    'unlimited-projects',
    'advanced-themes',
    'advanced-seo',
    'export-multi',
    'version-history',
  ]
  return premium.includes(f) ? 'PREMIUM' : 'FREE'
}
