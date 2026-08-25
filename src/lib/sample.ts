import type { PortfolioData } from '../types'

function id(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function createSamplePortfolio(): PortfolioData {
  return {
    profile: {
      fullName: 'Alex Rivera',
      headline: 'Full-Stack Developer & Designer',
      about:
        'I build thoughtful web products with a focus on performance, accessibility, and developer experience. I love shipping robust interfaces and reliable back ends.',
      location: 'Lisbon, Portugal',
      email: 'alex@rivera.dev',
      phone: '+351 900 000 000',
      website: 'https://alexrivera.dev',
    },
    social: {
      github: 'https://github.com/alexrivera',
      linkedin: 'https://linkedin.com/in/alexrivera',
      twitter: 'https://twitter.com/alexrivera',
      instagram: '',
      dribbble: 'https://dribbble.com/alexrivera',
      website: 'https://alexrivera.dev',
    },
    skills: ['TypeScript', 'React', 'Node.js', 'GraphQL', 'CSS Architecture', 'Testing'],
    projects: [
      {
        id: id(),
        title: 'ForgeCMS',
        description: 'A headless content editor with real-time collaboration and revision history.',
        tech: 'React, Node.js, PostgreSQL',
        link: '',
        repo: 'https://github.com/alexrivera/forgecms',
        highlight: true,
      },
      {
        id: id(),
        title: 'Pulseboard',
        description: 'Open-source analytics dashboard for lightweight product telemetry.',
        tech: 'Vue, Vite, Timescale',
        link: '',
        repo: 'https://github.com/alexrivera/pulseboard',
        highlight: false,
      },
      {
        id: id(),
        title: 'TinkerKit',
        description: 'A component library starter with tokens, docs, and CI-ready tooling.',
        tech: 'TypeScript, Storybook',
        link: '',
        repo: '',
        highlight: false,
      },
    ],
    experience: [
      {
        id: id(),
        role: 'Senior Frontend Engineer',
        company: 'Northwind Labs',
        period: '2021 — Present',
        description:
          'Lead the design system effort, mentor engineers, and ship performance-sensitive product surfaces.',
      },
      {
        id: id(),
        role: 'Full-Stack Developer',
        company: 'Algarve Robotics',
        period: '2018 — 2021',
        description: 'Built telemetry dashboards and an internal DSL for robot behavior definition.',
      },
    ],
    education: [
      {
        id: id(),
        degree: 'BSc Computer Science',
        institution: 'University of Porto',
        period: '2013 — 2017',
        details: 'Focus on distributed systems and compiler design.',
      },
    ],
    certifications: [
      { id: id(), name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2022' },
      { id: id(), name: 'Google UX Design Professional Certificate', issuer: 'Google', year: '2021' },
    ],
    customSections: [],
    template: 'minimal',
    theme: { palette: 'slate', font: 'sans', darkMode: false },
    seo: {
      title: 'Alex Rivera — Full-Stack Developer & Designer',
      description:
        'Portfolio of Alex Rivera, a full-stack developer and designer focused on performance, accessibility, and developer experience.',
      keywords: 'full-stack developer, designer, react, typescript, portfolio',
    },
  }
}

export function createEmptyPortfolio(): PortfolioData {
  return {
    profile: {
      fullName: '',
      headline: '',
      about: '',
      location: '',
      email: '',
      phone: '',
      website: '',
    },
    social: { github: '', linkedin: '', twitter: '', instagram: '', dribbble: '', website: '' },
    skills: [],
    projects: [],
    experience: [],
    education: [],
    certifications: [],
    customSections: [],
    template: 'minimal',
    theme: { palette: 'slate', font: 'sans', darkMode: false },
    seo: { title: '', description: '', keywords: '' },
  }
}

export { id }
