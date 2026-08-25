import { appConfig } from '../config'
import { TEMPLATES } from '../lib/features'

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
  onSimulate,
}: {
  open: boolean
  onClose: () => void
  onSimulate: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Upgrade to Premium"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Premium — {appConfig.premiumPrice}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            ✕
          </button>
        </div>
        <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-gray-700">
          {PREMIUM_POINTS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <a
          href={appConfig.upgradeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 block rounded-lg bg-indigo-600 px-4 py-2 text-center font-semibold text-white hover:bg-indigo-700"
        >
          Upgrade for {appConfig.premiumPrice}
        </a>
        <button
          onClick={onSimulate}
          className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Simulate premium (demo)
        </button>
        <p className="mt-3 text-xs text-gray-500">
          Demo mode unlocks premium locally — no payment processed. Templates available free:{' '}
          {TEMPLATES.filter((t) => t.free)
            .map((t) => t.name)
            .join(', ')}
          .
        </p>
      </div>
    </div>
  )
}
