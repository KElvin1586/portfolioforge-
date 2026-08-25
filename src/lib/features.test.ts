import { describe, it, expect } from 'vitest'
import { isTemplateAllowed, allowedFeature, FREE_TEMPLATES, TEMPLATES, premiumFeatureLabel } from './features'

describe('feature gating', () => {
  it('free tier includes exactly the two advertised templates', () => {
    expect(FREE_TEMPLATES).toEqual(['minimal', 'bold'])
    for (const t of TEMPLATES) {
      expect(isTemplateAllowed(t.id, { premium: false })).toBe(FREE_TEMPLATES.includes(t.id))
    }
  })

  it('premium unlocks all templates', () => {
    for (const t of TEMPLATES) {
      expect(isTemplateAllowed(t.id, { premium: true })).toBe(true)
    }
  })

  it('distinguishes PREMIUM vs FREE labels', () => {
    expect(premiumFeatureLabel('template-elegant')).toBe('PREMIUM')
    expect(premiumFeatureLabel('templates-minimal-bold')).toBe('FREE')
  })

  it('free tier allows basic export & local save', () => {
    expect(allowedFeature('export-html', { premium: false })).toBe(true)
    expect(allowedFeature('export-json', { premium: false })).toBe(true)
    expect(allowedFeature('local-save', { premium: false })).toBe(true)
  })
})
