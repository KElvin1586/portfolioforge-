export type Tier = 'free' | 'premium'
export type TemplateId = 'minimal' | 'bold' | 'elegant' | 'midnight' | 'creative'
export type FontChoice = 'sans' | 'serif' | 'mono'
export type PaletteId = 'slate' | 'ocean' | 'forest' | 'sunset' | 'violet' | 'mono'

export interface Profile {
  fullName: string
  headline: string
  about: string
  location: string
  email: string
  phone: string
  website: string
}

export interface SocialLinks {
  github: string
  linkedin: string
  twitter: string
  instagram: string
  dribbble: string
  website: string
}

export interface Project {
  id: string
  title: string
  description: string
  tech: string
  link: string
  repo: string
  highlight: boolean
}

export interface ExperienceItem {
  id: string
  role: string
  company: string
  period: string
  description: string
}

export interface EducationItem {
  id: string
  degree: string
  institution: string
  period: string
  details: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  year: string
}

export interface CustomSection {
  id: string
  title: string
  body: string
}

export interface ThemeConfig {
  palette: PaletteId
  font: FontChoice
  darkMode: boolean
}

export interface SeoConfig {
  title: string
  description: string
  keywords: string
}

export interface PortfolioData {
  profile: Profile
  social: SocialLinks
  skills: string[]
  projects: Project[]
  experience: ExperienceItem[]
  education: EducationItem[]
  certifications: Certification[]
  customSections: CustomSection[]
  template: TemplateId
  theme: ThemeConfig
  seo: SeoConfig
}

export interface PortfolioSnapshot {
  id: string
  label: string
  takenAt: string
  data: PortfolioData
}
