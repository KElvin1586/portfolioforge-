import { ReactNode } from 'react'

export function LockBadge({ onUnlock }: { onUnlock?: () => void }) {
  return (
    <button
      type="button"
      onClick={onUnlock}
      className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 hover:bg-amber-200"
      title="Premium feature"
    >
      🔒 PREMIUM
    </button>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-600">{label}</span>
      {children}
    </label>
  )
}

export const inputCls =
  'w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400'

export const textareaCls = inputCls + ' min-h-[4.5rem]'

export function Button({
  variant = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const cls =
    variant === 'primary'
      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
      : variant === 'danger'
        ? 'bg-red-50 text-red-600 hover:bg-red-100'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  return (
    <button
      {...props}
      className={`${cls} rounded-md px-3 py-1.5 text-sm font-medium transition disabled:opacity-40`}
    />
  )
}

export function AddButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-md border border-dashed border-gray-300 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:border-indigo-400"
    >
      + Add
    </button>
  )
}
