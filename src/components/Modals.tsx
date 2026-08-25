import { useEffect, useRef, useState } from 'react'
import { appConfig } from '../config'
import { TEMPLATES } from '../lib/entitlements'
import { LicenseInfo, validateLicenseKey } from '../lib/license'

const PREMIUM_POINTS = [
  'All templates (Elegant, Midnight, Creative)',
  'Unlimited projects',
  'Advanced themes (all palettes, fonts, dark mode)',
  'Custom sections',
  'Advanced SEO controls',
  'More export options (all templates at once)',
  'Version history & snapshots',
]

export function UpgradeModal({
  open,
  onClose,
  premiumInfo,
  onActivated,
  onDeactivate,
}: {
  open: boolean
  onClose: () => void
  /** Present when Premium is already active — the modal then manages the license. */
  premiumInfo: LicenseInfo | null
  onActivated: (key: string, info: LicenseInfo) => void
  onDeactivate: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [key, setKey] = useState('')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  // Reset the activation form whenever the dialog is (re)opened.
  const [prevOpen, setPrevOpen] = useState(open)
  if (prevOpen !== open) {
    setPrevOpen(open)
    if (open) {
      setKey('')
      setError('')
    }
  }

  useEffect(() => {
    if (!open) return undefined
    dialogRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const activate = async () => {
    setChecking(true)
    setError('')
    try {
      const result = await validateLicenseKey(key)
      if (result.ok) {
        setKey('')
        onActivated(key, result.info)
      } else {
        setError(result.message)
      }
    } finally {
      setChecking(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={premiumInfo ? 'Premium license' : 'Upgrade to Premium'}
        tabIndex={-1}
        ref={dialogRef}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {premiumInfo
              ? 'Premium active ✓'
              : `Premium — ${appConfig.premiumPrice} ${appConfig.premiumCurrency} (one-time)`}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            ✕
          </button>
        </div>

        {premiumInfo ? (
          <div className="space-y-3 text-sm text-gray-700">
            <p>All Premium features are unlocked on this device.</p>
            <dl className="rounded-lg bg-gray-50 p-3 text-xs">
              {premiumInfo.productName && (
                <div className="flex justify-between gap-2 py-0.5">
                  <dt className="text-gray-500">Product</dt>
                  <dd className="font-medium">{premiumInfo.productName}</dd>
                </div>
              )}
              {premiumInfo.customerEmail && (
                <div className="flex justify-between gap-2 py-0.5">
                  <dt className="text-gray-500">Licensed to</dt>
                  <dd className="font-medium">{premiumInfo.customerEmail}</dd>
                </div>
              )}
            </dl>
            <button
              onClick={onDeactivate}
              className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Deactivate Premium on this device
            </button>
          </div>
        ) : (
          <>
            <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-gray-700">
              {PREMIUM_POINTS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <a
              href={appConfig.upgradeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 block rounded-lg bg-indigo-600 px-4 py-2 text-center font-semibold text-white hover:bg-indigo-700"
            >
              Buy Premium — {appConfig.premiumPrice} {appConfig.premiumCurrency}
            </a>
            <p className="mb-4 text-center text-xs text-gray-500">
              Secure checkout by Lemon Squeezy. You’ll receive a license key by email after purchase.
            </p>

            <div className="rounded-lg border border-gray-200 p-3">
              <label htmlFor="license-key" className="mb-1 block text-sm font-medium text-gray-700">
                Already purchased? Enter your license key
              </label>
              <input
                id="license-key"
                type="text"
                value={key}
                onChange={(e) => {
                  setKey(e.target.value)
                  setError('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !checking) void activate()
                }}
                placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                autoComplete="off"
                spellCheck={false}
                className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none"
              />
              {error && (
                <p role="alert" className="mb-2 text-sm text-red-600">
                  {error}
                </p>
              )}
              <button
                onClick={() => void activate()}
                disabled={checking || !key.trim()}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checking ? 'Verifying with Lemon Squeezy…' : 'Activate Premium'}
              </button>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Activation verifies your key directly with Lemon Squeezy — Premium never unlocks
              without a valid purchase. Templates available free:{' '}
              {TEMPLATES.filter((t) => t.free)
                .map((t) => t.name)
                .join(', ')}
              .
            </p>
          </>
        )}
      </div>
    </div>
  )
}
