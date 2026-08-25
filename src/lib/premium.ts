/**
 * Persistent premium license state.
 *
 * There is intentionally NO boolean "premium" flag anywhere in storage.
 * Premium is only ever granted in memory, and only as the result of a
 * successful Lemon Squeezy validation (`validateLicenseKey`). The stored
 * record is just the customer's license key (base64-obfuscated against casual
 * inspection) plus bookkeeping, so:
 *
 *  - editing localStorage to invent a key fails validation on next load,
 *  - deleting the record logs the user out of Premium,
 *  - a revoked/refunded key is downgraded the next time the app is online.
 *
 * The raw key is stored so it can be re-verified against Lemon Squeezy after
 * reload (validateLicenseKey needs the key itself). The key is a low-sensitivity
 * purchase credential owned by the customer; no other secrets are involved.
 */

import type { LicenseInfo } from './license'

const STORAGE_KEY = 'portfolioforge:license'

/** How long a previously verified license is trusted while offline. */
export const OFFLINE_GRACE_MS = 7 * 24 * 60 * 60 * 1000

export interface StoredLicense {
  /** base64 of the normalized license key */
  k: string
  /** ISO timestamp of the last successful server validation */
  v: string
  info: LicenseInfo
}

function encodeKey(key: string): string {
  return btoa(unescape(encodeURIComponent(key.trim())))
}

function decodeKey(encoded: string): string | null {
  try {
    return decodeURIComponent(escape(atob(encoded)))
  } catch {
    return null
  }
}

export function storeLicense(key: string, info: LicenseInfo): void {
  const record: StoredLicense = { k: encodeKey(key), v: new Date().toISOString(), info }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
}

export interface LoadedLicense {
  key: string
  lastVerifiedAt: string
  info: LicenseInfo
}

export function loadLicense(): LoadedLicense | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredLicense
    if (!parsed || typeof parsed.k !== 'string' || typeof parsed.v !== 'string') return null
    const key = decodeKey(parsed.k)
    if (!key) return null
    return { key, lastVerifiedAt: parsed.v, info: parsed.info ?? {} }
  } catch {
    return null
  }
}

/** Refresh the verification timestamp without changing anything else. */
export function touchLicense(): void {
  const loaded = loadLicense()
  if (loaded) storeLicense(loaded.key, loaded.info)
}

export function clearLicense(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function withinOfflineGrace(lastVerifiedAt: string, now = Date.now()): boolean {
  const t = new Date(lastVerifiedAt).getTime()
  return Number.isFinite(t) && now - t <= OFFLINE_GRACE_MS
}
