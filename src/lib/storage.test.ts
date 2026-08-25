import { describe, it, expect, beforeEach } from 'vitest'
import { saveLocal, loadLocal, validatePortfolio, getSnapshots, addSnapshot, deleteSnapshot } from './storage'
import { createSamplePortfolio } from './sample'

// Minimal localStorage stub for node environment
class MemoryStorage {
  private store = new Map<string, string>()
  getItem(k: string) {
    return this.store.has(k) ? (this.store.get(k) as string) : null
  }
  setItem(k: string, v: string) {
    this.store.set(k, v)
  }
  removeItem(k: string) {
    this.store.delete(k)
  }
  clear() {
    this.store.clear()
  }
}

Object.assign(globalThis, { localStorage: new MemoryStorage() })

beforeEach(() => {
  ;(globalThis.localStorage as unknown as MemoryStorage).clear()
})

describe('storage', () => {
  it('round-trips portfolio data through localStorage', () => {
    const data = createSamplePortfolio()
    saveLocal(data)
    const loaded = loadLocal()
    expect(loaded).not.toBeNull()
    expect(loaded?.data.profile.fullName).toBe(data.profile.fullName)
  })

  it('validatePortfolio accepts sample, rejects garbage', () => {
    expect(validatePortfolio(createSamplePortfolio())).toBe(true)
    expect(validatePortfolio(null)).toBe(false)
    expect(validatePortfolio({})).toBe(false)
    expect(validatePortfolio('x')).toBe(false)
  })

  it('manages snapshots', () => {
    const data = createSamplePortfolio()
    addSnapshot({ id: 's1', label: 'x', takenAt: 'now', data })
    expect(getSnapshots().length).toBe(1)
    deleteSnapshot('s1')
    expect(getSnapshots().length).toBe(0)
  })
})
