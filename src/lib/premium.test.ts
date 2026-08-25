import { describe, it, expect, beforeEach } from 'vitest'
import { storeLicense, loadLicense, clearLicense, touchLicense, withinOfflineGrace, OFFLINE_GRACE_MS } from './premium'

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

describe('premium license storage', () => {
  it('round-trips a license record', () => {
    storeLicense('ABCD-1234-EFGH-5678', { customerEmail: 'buyer@example.com', productName: 'Premium' })
    const loaded = loadLicense()
    expect(loaded).not.toBeNull()
    expect(loaded!.key).toBe('ABCD-1234-EFGH-5678')
    expect(loaded!.info.customerEmail).toBe('buyer@example.com')
    expect(new Date(loaded!.lastVerifiedAt).getTime()).toBeGreaterThan(0)
  })

  it('does not persist the raw key in plaintext and stores no premium boolean flag', () => {
    storeLicense('SECRET-KEY-VALUE', { productName: 'Premium' })
    const raw = localStorage.getItem('portfolioforge:license') ?? ''
    expect(raw).not.toContain('SECRET-KEY-VALUE')
    expect(raw).not.toMatch(/"premium"\s*:\s*true/)
  })

  it('returns null when nothing is stored', () => {
    expect(loadLicense()).toBeNull()
  })

  it('returns null for corrupted records', () => {
    localStorage.setItem('portfolioforge:license', '{not json')
    expect(loadLicense()).toBeNull()
    localStorage.setItem('portfolioforge:license', JSON.stringify({ k: '!!!not-base64!!!' }))
    expect(loadLicense()).toBeNull()
  })

  it('clearLicense logs the user out of Premium', () => {
    storeLicense('KEY', {})
    clearLicense()
    expect(loadLicense()).toBeNull()
  })

  it('touchLicense refreshes the verification timestamp', async () => {
    storeLicense('KEY', {})
    const before = new Date(loadLicense()!.lastVerifiedAt).getTime()
    await new Promise((r) => setTimeout(r, 5))
    touchLicense()
    const after = new Date(loadLicense()!.lastVerifiedAt).getTime()
    expect(after).toBeGreaterThanOrEqual(before)
  })
})

describe('withinOfflineGrace', () => {
  it('accepts a recent verification', () => {
    expect(withinOfflineGrace(new Date().toISOString())).toBe(true)
  })

  it('rejects verification older than the grace window', () => {
    const old = new Date(Date.now() - OFFLINE_GRACE_MS - 1000).toISOString()
    expect(withinOfflineGrace(old)).toBe(false)
  })

  it('rejects unparseable timestamps', () => {
    expect(withinOfflineGrace('not-a-date')).toBe(false)
  })
})
