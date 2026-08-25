import { describe, it, expect, afterEach, vi } from 'vitest'
import { validateLicenseKey } from './license'

// fetch is stubbed here because this is a unit test of the HTTP client
// boundary; the real Lemon Squeezy endpoint behavior was verified separately
// against https://api.lemonsqueezy.com/v1/licenses/validate.

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('validateLicenseKey', () => {
  it('rejects an empty key without calling the API', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const result = await validateLicenseKey('   ')
    expect(result.ok).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns ok with customer info for a valid active key', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse(200, {
          valid: true,
          license_key: { status: 'active', expires_at: null, disabled: false },
          meta: { customer_email: 'buyer@example.com', product_name: 'PortfolioForge Premium' },
        }),
      ),
    )
    const result = await validateLicenseKey('REAL-KEY')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.info.customerEmail).toBe('buyer@example.com')
      expect(result.info.productName).toBe('PortfolioForge Premium')
    }
  })

  it('accepts a valid key with status inactive (never activated)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse(200, {
          valid: true,
          license_key: { status: 'inactive', expires_at: null, disabled: false },
          meta: {},
        }),
      ),
    )
    const result = await validateLicenseKey('VALID-BUT-INACTIVE')
    expect(result.ok).toBe(true)
  })

  it('rejects an unknown key (404)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(404, { valid: false, error: 'license_key not found.' })))
    const result = await validateLicenseKey('NOPE')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe('invalid')
  })

  it('rejects a disabled/revoked key', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse(200, { valid: true, license_key: { status: 'disabled', disabled: true }, meta: {} }),
      ),
    )
    const result = await validateLicenseKey('REVOKED')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe('disabled')
  })

  it('rejects an expired key', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse(200, {
          valid: true,
          license_key: { status: 'expired', expires_at: '2020-01-01T00:00:00.000Z', disabled: false },
          meta: {},
        }),
      ),
    )
    const result = await validateLicenseKey('OLD')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe('expired')
  })

  it('rejects a key whose expires_at is in the past even if status looks active', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse(200, {
          valid: true,
          license_key: { status: 'active', expires_at: '2020-01-01T00:00:00.000Z', disabled: false },
          meta: {},
        }),
      ),
    )
    const result = await validateLicenseKey('SNEAKY')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe('expired')
  })

  it('reports a network error when fetch throws', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )
    const result = await validateLicenseKey('ANY')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe('network')
  })

  it('reports a server error for 5xx', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(500, { valid: false, error: 'boom' })))
    const result = await validateLicenseKey('ANY')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe('server')
  })

  it('sends the key as form data to the Lemon Squeezy validate endpoint', async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(200, { valid: true, license_key: { status: 'inactive' }, meta: {} }),
    )
    vi.stubGlobal('fetch', fetchMock)
    await validateLicenseKey('  MY-KEY  ')
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://api.lemonsqueezy.com/v1/licenses/validate')
    expect(init.method).toBe('POST')
    expect(String(init.body)).toContain('license_key=MY-KEY')
  })
})
