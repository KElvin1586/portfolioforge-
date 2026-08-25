/**
 * Lemon Squeezy license verification client.
 *
 * Uses the public POST /v1/licenses/validate endpoint, which requires no API
 * key by design and is CORS-enabled (Access-Control-Allow-Origin: *), so it
 * can be called directly from the browser without exposing any secret.
 * No Lemon Squeezy API key or credential is ever shipped in this bundle.
 *
 * We use `validate` (not `activate`) deliberately: validating does not consume
 * activation slots, so the same legitimate key can be re-verified on every
 * load and on multiple devices.
 */

const LS_VALIDATE_URL = 'https://api.lemonsqueezy.com/v1/licenses/validate'

export type LicenseErrorReason = 'invalid' | 'disabled' | 'expired' | 'network' | 'server'

export interface LicenseInfo {
  customerEmail?: string
  customerName?: string
  productName?: string
  variantName?: string
}

export type LicenseValidation =
  | { ok: true; info: LicenseInfo }
  | { ok: false; reason: LicenseErrorReason; message: string }

interface LSValidateResponse {
  valid?: boolean
  error?: string
  license_key?: {
    status?: string
    expires_at?: string | null
    disabled?: boolean
  }
  meta?: {
    customer_email?: string
    customer_name?: string
    product_name?: string
    variant_name?: string
  }
}

const MESSAGES: Record<LicenseErrorReason, string> = {
  invalid: 'This license key was not found. Check for typos and try again.',
  disabled: 'This license key has been disabled or refunded. Contact support if you believe this is a mistake.',
  expired: 'This license key has expired.',
  network: 'Could not reach the license server. Check your internet connection and try again.',
  server: 'The license server returned an unexpected response. Please try again later.',
}

export async function validateLicenseKey(rawKey: string): Promise<LicenseValidation> {
  const key = rawKey.trim()
  if (!key) return { ok: false, reason: 'invalid', message: 'Enter a license key.' }

  let res: Response
  try {
    res = await fetch(LS_VALIDATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams({ license_key: key }).toString(),
    })
  } catch {
    return { ok: false, reason: 'network', message: MESSAGES.network }
  }

  // Lemon Squeezy answers 404 {"valid":false,"error":"license_key not found."}
  if (res.status === 404) return { ok: false, reason: 'invalid', message: MESSAGES.invalid }

  let body: LSValidateResponse
  try {
    body = (await res.json()) as LSValidateResponse
  } catch {
    return { ok: false, reason: 'server', message: MESSAGES.server }
  }

  if (!res.ok) {
    return { ok: false, reason: res.status >= 500 ? 'server' : 'invalid', message: body.error || MESSAGES.server }
  }
  if (body.valid !== true) {
    return { ok: false, reason: 'invalid', message: body.error || MESSAGES.invalid }
  }

  const license = body.license_key
  if (license?.disabled === true || license?.status === 'disabled') {
    return { ok: false, reason: 'disabled', message: MESSAGES.disabled }
  }

  const expiresAt = license?.expires_at ?? null
  if (license?.status === 'expired' || (expiresAt !== null && new Date(expiresAt).getTime() <= Date.now())) {
    return { ok: false, reason: 'expired', message: MESSAGES.expired }
  }

  const status = license?.status
  // 'active' = activated somewhere; 'inactive' = never activated (we never call
  // /activate, so legitimate keys commonly stay 'inactive'). Both are usable.
  if (status !== undefined && status !== 'active' && status !== 'inactive') {
    return { ok: false, reason: 'invalid', message: `This license key is not usable (status: ${status}).` }
  }

  return {
    ok: true,
    info: {
      customerEmail: body.meta?.customer_email,
      customerName: body.meta?.customer_name,
      productName: body.meta?.product_name,
      variantName: body.meta?.variant_name,
    },
  }
}
