import type { PortfolioData, TemplateId, PaletteId, FontChoice } from '../types'

const PALETTES: Record<PaletteId, { fg: string; bg: string; accent: string; soft: string }> = {
  slate: { fg: '#111827', bg: '#ffffff', accent: '#1f2937', soft: '#f3f4f6' },
  ocean: { fg: '#0c1930', bg: '#fbfdff', accent: '#0369a1', soft: '#e0f2fe' },
  forest: { fg: '#14220f', bg: '#fbfdfb', accent: '#166534', soft: '#e5f5ea' },
  sunset: { fg: '#2b1307', bg: '#fffdf9', accent: '#c2410c', soft: '#ffedd5' },
  violet: { fg: '#1b0f2e', bg: '#fbfafe', accent: '#7c3aed', soft: '#f0e9fe' },
  mono: { fg: '#000000', bg: '#ffffff', accent: '#000000', soft: '#efefef' },
}

const FONTS: Record<FontChoice, string> = {
  sans: `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`,
  serif: `Georgia, 'Times New Roman', serif`,
  mono: `ui-monospace, SFMono-Regular, 'Courier New', monospace`,
}

export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function attr(s: string): string {
  return esc(s)
}

function linkOrText(url: string, label: string, cls = 'link'): string {
  if (!url) return ''
  return `<a class="${cls}" href="${attr(url)}" rel="noopener" target="_blank">${esc(label)}</a>`
}

function section(id: string, title: string | null, body: string): string {
  return `<section id="${id}" class="section">${title ? `<h2>${esc(title)}</h2>` : ''}${body}</section>`
}

function render(
  data: PortfolioData,
  bodyBuilder: (data: PortfolioData, parts: string[]) => string,
  css: string,
  layoutClass: string,
): string {
  const { profile, social, theme, seo } = data
  const palette = PALETTES[theme.palette]
  const font = FONTS[theme.font]
  const p = theme.darkMode
    ? { fg: '#e5e7eb', bg: '#0b0f17', accent: palette.accent, soft: '#111827' }
    : palette

  const base = `
  :root { --fg: ${p.fg}; --bg: ${p.bg}; --accent: ${p.accent}; --soft: ${p.soft}; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body { color: var(--fg); background: var(--bg); font-family: ${font}; line-height: 1.55; }
  img { max-width: 100%; }
  a { color: var(--accent); }
  .wrap { max-width: 960px; margin: 0 auto; padding: 0 1.25rem; }
  .hero { padding: 3rem 0 2rem; }
  .hero h1 { margin: 0; font-size: 2.5rem; }
  .hero p.headline { margin: .25rem 0 0; font-size: 1.25rem; color: var(--accent); }
  .meta { color: color-mix(in srgb, var(--fg) 65%, var(--bg)); font-size: .9rem; }
  .section { padding: 1.5rem 0; }
  .section h2 { margin: 0 0 .75rem; font-size: 1.4rem; border-bottom: 2px solid var(--accent); padding-bottom: .25rem; }
  ul.skills { display: flex; flex-wrap: wrap; gap: .5rem; padding: 0; list-style: none; }
  ul.skills li { background: var(--soft); border: 1px solid color-mix(in srgb, var(--fg) 15%, var(--bg)); padding: .25rem .6rem; border-radius: 999px; font-size: .85rem; }
  .project, .exp, .edu, .cert, .custom-card { border: 1px solid color-mix(in srgb, var(--fg) 12%, var(--bg)); border-radius: .5rem; padding: 1rem; margin-bottom: 1rem; background: color-mix(in srgb, var(--bg) 88%, var(--soft)); }
  .project h3, .exp h3, .edu h3, .cert h3 { margin: 0 0 .25rem; }
  .muted { color: color-mix(in srgb, var(--fg) 60%, var(--bg)); }
  .badges { display: flex; flex-wrap: wrap; gap: .4rem; font-size: .8rem; }
  .badges span { border: 1px solid color-mix(in srgb, var(--fg) 15%, var(--bg)); border-radius: 999px; padding: .15rem .5rem; }
  footer { padding: 2rem 0; color: color-mix(in srgb, var(--fg) 60%, var(--bg)); font-size: .85rem; }
  @media (max-width: 640px) { .hero h1 { font-size: 1.9rem; } }
  ${css}`
  const title = seo.title || profile.fullName || 'Portfolio'
  const description = seo.description || profile.about.slice(0, 160)

  const doc = `<!doctype html>
<html lang="en" class="${layoutClass}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
${seo.keywords ? `<meta name="keywords" content="${esc(seo.keywords)}" />` : ''}
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:type" content="website" />
${profile.website ? `<meta property="og:url" content="${esc(profile.website)}" />` : ''}
<style>${base}</style>
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.fullName,
    url: profile.website || undefined,
    email: profile.email || undefined,
  }).replace(/</g, '\\u003c')}</script>
</head>
<body>
<div class="wrap">
${bodyBuilder(data, [])}
<footer>Generated with PortfolioForge.</footer>
</div>
</body>
</html>`
  return doc
}

function heroBlock(data: PortfolioData, gradient = false): string {
  const { profile, social, skills } = data
  const socialLinks = (Object.entries(social) as [string, string][])
    .filter(([, v]) => v)
    .map(([k, v]) => linkOrText(v, k))
    .filter(Boolean)
    .join(' · ')
  const contactBits = [profile.email, profile.phone, profile.location].filter(Boolean)
  return `<header class="hero${gradient ? ' hero-grad' : ''}">
  <div>
    <h1>${esc(profile.fullName)}</h1>
    ${profile.headline ? `<p class="headline">${esc(profile.headline)}</p>` : ''}
    ${skills.length ? `<ul class="skills">${skills.map(escapeLi).join('')}</ul>` : ''}
  </div>
  <p class="meta">${[contactBits.map(esc).join(' · '), socialLinks].filter(Boolean).join('<br/>')}</p>
</header>`
}

function escapeLi(s: string): string {
  return `<li>${esc(s)}</li>`
}

function projectCard(p: { title: string; description: string; tech: string; link: string; repo: string }): string {
  return `<article class="project">
  <h3>${esc(p.title)}</h3>
  <p>${esc(p.description)}</p>
  ${p.tech ? `<p class="muted">${esc(p.tech)}</p>` : ''}
  <p>${[linkOrText(p.link, 'Live'), linkOrText(p.repo, 'Repo')].filter(Boolean).join(' · ')}</p>
</article>`
}

function experienceItem(e: { role: string; company: string; period: string; description: string }): string {
  return `<article class="exp"><h3>${esc(e.role)} — ${esc(e.company)}</h3><p class="muted">${esc(e.period)}</p><p>${esc(e.description)}</p></article>`
}

function educationItem(e: { degree: string; institution: string; period: string; details: string }): string {
  return `<article class="edu"><h3>${esc(e.degree)}</h3><p class="muted">${esc(e.institution)} · ${esc(e.period)}</p><p>${esc(e.details)}</p></article>`
}

function certItem(c: { name: string; issuer: string; year: string }): string {
  return `<article class="cert"><h3>${esc(c.name)}</h3><p class="muted">${esc(c.issuer)} · ${esc(c.year)}</p></article>`
}

interface BodyBuilder {
  (data: PortfolioData, parts: string[]): string
}

const minimalBody: BodyBuilder = (d) => {
  const chunks: string[] = []
  chunks.push(heroBlock(d))
  chunks.push(
    section('projects', 'Projects', d.projects.map(projectCard).join('')),
    section('experience', 'Experience', d.experience.map(experienceItem).join('')),
    section('education', 'Education', d.education.map(educationItem).join('')),
    section('certifications', 'Certifications', d.certifications.map(certItem).join('')),
    ...d.customSections.map((c) => section(`c-${c.id}`, c.title, `<p>${esc(c.body)}</p>`)),
  )
  return chunks.join('\n')
}

const boldBody: BodyBuilder = (d) => {
  const chunks: string[] = []
  chunks.push(heroBlock(d, true))
  chunks.push(
    ...d.customSections.map((c) => section(`c-${c.id}`, c.title, `<p>${esc(c.body)}</p>`)),
    section('projects', 'Projects', d.projects.map(projectCard).join('')),
    section('experience', 'Experience', d.experience.map(experienceItem).join('')),
    section('education', 'Education', d.education.map(educationItem).join('')),
    section('certifications', 'Certifications', d.certifications.map(certItem).join('')),
  )
  return chunks.join('\n')
}

const elegantBody: BodyBuilder = (d) => {
  const chunks: string[] = []
  chunks.push(heroBlock(d))
  chunks.push(
    section('experience', 'Experience', d.experience.map(experienceItem).join('')),
    section('projects', 'Projects', d.projects.map(projectCard).join('')),
    section('education', 'Education', d.education.map(educationItem).join('')),
    section('certifications', 'Certifications', d.certifications.map(certItem).join('')),
    ...d.customSections.map((c) => section(`c-${c.id}`, c.title, `<p>${esc(c.body)}</p>`)),
  )
  return chunks.join('\n')
}

const midnightBody: BodyBuilder = (d) => {
  const chunks: string[] = []
  chunks.push(heroBlock(d))
  chunks.push(
    section('projects', 'Projects', d.projects.map(projectCard).join('')),
    section('experience', 'Experience', d.experience.map(experienceItem).join('')),
    section('education', 'Education', d.education.map(educationItem).join('')),
    section('certifications', 'Certifications', d.certifications.map(certItem).join('')),
    ...d.customSections.map((c) => section(`c-${c.id}`, c.title, `<p>${esc(c.body)}</p>`)),
  )
  return chunks.join('\n')
}

const creativeBody: BodyBuilder = (d) => {
  const chunks: string[] = []
  chunks.push(heroBlock(d, true))
  chunks.push(
    section('projects', 'Projects', d.projects.map(projectCard).join('')),
    ...d.customSections.map((c) => section(`c-${c.id}`, c.title, `<p>${esc(c.body)}</p>`)),
    section('experience', 'Experience', d.experience.map(experienceItem).join('')),
    section('education', 'Education', d.education.map(educationItem).join('')),
    section('certifications', 'Certifications', d.certifications.map(certItem).join('')),
  )
  return chunks.join('\n')
}

const TEMPLATE_RENDER: Record<
  TemplateId,
  { body: BodyBuilder; layout: string; css: string }
> = {
  minimal: {
    body: minimalBody,
    layout: 'tpl-minimal',
    css: '',
  },
  bold: {
    body: boldBody,
    layout: 'tpl-bold',
    css: `.hero { border-left: 8px solid var(--accent); padding-left: 1.5rem; }
    .hero h1 { letter-spacing: -0.02em; }
    .section h2 { text-transform: uppercase; letter-spacing: .05em; font-size: 1rem; }`,
  },
  elegant: {
    body: elegantBody,
    layout: 'tpl-elegant',
    css: `.section h2 { font-variant: small-caps; }
    .project, .exp, .edu, .cert { border-radius: 0; }
    .hero { padding-top: 4rem; }`,
  },
  midnight: {
    body: midnightBody,
    layout: 'tpl-midnight',
    css: `.section h2 { border-bottom: 2px solid var(--soft) !important; }`,
  },
  creative: {
    body: creativeBody,
    layout: 'tpl-creative',
    css: `.hero-grad { background: linear-gradient(135deg, var(--soft), transparent); border-radius: 12px; padding: 2rem 1.5rem; }
    .project { box-shadow: 0 2px 8px rgba(0,0,0,.06); }`,
  },
}

export function renderHtml(data: PortfolioData): string {
  const t = TEMPLATE_RENDER[data.template] ?? TEMPLATE_RENDER.minimal
  return render(data, t.body, t.css, t.layout)
}

export function downloadTextFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export { PALETTES, FONTS }
