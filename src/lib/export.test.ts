import { describe, it, expect } from 'vitest'
import { renderHtml, esc } from './export'
import { createSamplePortfolio } from './sample'

describe('esc', () => {
  it('escapes HTML special chars', () => {
    expect(esc('<b>"x&y"</b>')).toBe('&lt;b&gt;&quot;x&amp;y&quot;&lt;/b&gt;')
  })
})

describe('renderHtml', () => {
  for (const tpl of ['minimal', 'bold', 'elegant', 'midnight', 'creative'] as const) {
    it(`renders full document for template ${tpl}`, () => {
      const data = { ...createSamplePortfolio(), template: tpl }
      const html = renderHtml(data)
      expect(html.startsWith('<!doctype html>')).toBe(true)
      expect(html).toContain('<title>')
      expect(html).toContain('og:title')
      expect(html).toContain('og:description')
      expect(html).toContain('viewport')
      expect(html).toContain('application/ld+json')
      expect(html).toContain('PortfolioForge')
      expect(html).toContain('<style>')
      expect(html).toContain('<section')
      expect(html).toContain('<header')
      expect(html).toContain('<footer')
      expect(html).toContain('Projects')
      expect(html).toContain('Experience')
      expect(html).toContain('Education')
      expect(html).toContain('Certifications')
    })
  }

  it('respects custom SEO title/description', () => {
    const d = { ...createSamplePortfolio(), seo: { title: 'T', description: 'D', keywords: 'k' } }
    const html = renderHtml(d)
    expect(html).toContain('<title>T</title>')
    expect(html).toContain('content="D"')
    expect(html).toContain('content="k"')
  })

  it('escapes user input', () => {
    const base = createSamplePortfolio()
    const d = { ...base, profile: { ...base.profile, fullName: '<script>alert(1)</script>' } }
    const html = renderHtml(d)
    expect(html).not.toContain('<script>alert')
    expect(html).toContain('&lt;script&gt;')
  })

  it('renders custom sections when present', () => {
    const base = createSamplePortfolio()
    const d = {
      ...base,
      customSections: [{ id: 'ab', title: 'Blog Notes', body: 'hello' }],
    }
    const html = renderHtml(d)
    expect(html).toContain('Blog Notes')
    expect(html).toContain('hello')
  })

  it('uses dark tokens when darkMode is on', () => {
    const base = createSamplePortfolio()
    const d = { ...base, theme: { ...base.theme, darkMode: true } }
    const html = renderHtml(d)
    expect(html).toContain('#0b0f17')
  })
})
