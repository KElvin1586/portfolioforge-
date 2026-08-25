import { describe, it, expect } from 'vitest'
import {
  ENTITLEMENTS,
  EntitlementId,
  isEntitled,
  isTemplateAllowed,
  isPaletteAllowed,
  isFontAllowed,
  FREE_TEMPLATES,
  FREE_PALETTES,
  FREE_FONTS,
  TEMPLATES,
} from './entitlements'

describe('entitlement registry', () => {
  it('declares free and premium tiers', () => {
    const tiers = Object.values(ENTITLEMENTS).map((e) => e.tier)
    expect(tiers).toContain('free')
    expect(tiers).toContain('premium')
  })

  it('gates premium features correctly', () => {
    const premiumIds = (Object.keys(ENTITLEMENTS) as EntitlementId[]).filter(
      (id) => ENTITLEMENTS[id].tier === 'premium',
    )
    for (const id of premiumIds) {
      expect(isEntitled(id, { premium: false })).toBe(false)
      expect(isEntitled(id, { premium: true })).toBe(true)
    }
  })

  it('free tier includes exactly the two advertised templates', () => {
    expect(FREE_TEMPLATES).toEqual(['minimal', 'bold'])
    for (const t of TEMPLATES) {
      expect(isTemplateAllowed(t.id, { premium: false })).toBe(FREE_TEMPLATES.includes(t.id))
    }
  })

  it('premium unlocks all templates/palettes/fonts', () => {
    for (const t of TEMPLATES) {
      expect(isTemplateAllowed(t.id, { premium: true })).toBe(true)
    }
    for (const p of FREE_PALETTES) {
      expect(isPaletteAllowed(p, { premium: true })).toBe(true)
    }
    for (const f of FREE_FONTS) {
      expect(isFontAllowed(f, { premium: true })).toBe(true)
    }
  })
})
