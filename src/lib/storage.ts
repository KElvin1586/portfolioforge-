import type { PortfolioData, PortfolioSnapshot } from '../types'

const STORAGE_KEY = 'portfolioforge:data'
const SNAPSHOT_KEY = 'portfolioforge:snapshots'

export interface StoredEnvelope {
  version: number
  savedAt: string
  data: PortfolioData
}

export function saveLocal(data: PortfolioData): void {
  const envelope: StoredEnvelope = { version: 1, savedAt: new Date().toISOString(), data }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope))
}

export function loadLocal(): StoredEnvelope | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredEnvelope
    if (parsed && typeof parsed === 'object' && parsed.data) return parsed
    return null
  } catch {
    return null
  }
}

export function clearLocal(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function validatePortfolio(input: unknown): input is PortfolioData {
  if (typeof input !== 'object' || input === null) return false
  const d = input as PortfolioData
  const ok =
    typeof d.template === 'string' &&
    typeof d.theme === 'object' &&
    Array.isArray(d.skills) &&
    Array.isArray(d.projects) &&
    Array.isArray(d.experience) &&
    Array.isArray(d.education) &&
    Array.isArray(d.certifications)
  if (!ok) return false
  return d.profile !== undefined && d.social !== undefined && d.seo !== undefined
}

export function exportJsonFile(data: PortfolioData, filename = 'portfolio.json'): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function getSnapshots(): PortfolioSnapshot[] {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY)
    return raw ? (JSON.parse(raw) as PortfolioSnapshot[]) : []
  } catch {
    return []
  }
}

export function addSnapshot(snapshot: PortfolioSnapshot): void {
  const list = [snapshot, ...getSnapshots()].slice(0, 20)
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(list))
}

export function deleteSnapshot(id: string): void {
  const list = getSnapshots().filter((s) => s.id !== id)
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(list))
}
