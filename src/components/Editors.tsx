import { PortfolioData, Profile, SocialLinks, Project, ExperienceItem, EducationItem, Certification, CustomSection } from '../types'
import { id } from '../lib/sample'
import { TEMPLATES, Access, isTemplateAllowed, isPaletteAllowed, isFontAllowed } from '../lib/entitlements'
import { PALETTES, FONTS } from '../lib/export'
import { LockBadge, Field, inputCls, textareaCls, AddButton } from './ui'

export type PatchFn = (mutator: (d: PortfolioData) => void) => void

// ---------- Generic list editor ----------

interface FieldDef<K> {
  key: keyof K
  label: string
  kind: 'text' | 'textarea' | 'checkbox'
  placeholder?: string
}

function ListEditor<T extends { id: string }>({
  items,
  fields,
  onChange,
  newItem,
  addLocked,
  onLocked,
}: {
  items: T[]
  fields: FieldDef<T>[]
  onChange: (items: T[]) => void
  newItem: () => T
  addLocked?: boolean
  onLocked?: () => void
}) {
  const updateItem = (itemId: string, key: keyof T, value: unknown) => {
    onChange(items.map((it) => (it.id === (itemId as string) ? { ...it, [key]: value } : it)))
  }
  const remove = (itemId: string) => onChange(items.filter((it) => it.id !== itemId))
  const move = (idx: number, dir: -1 | 1) => {
    const copy = [...items]
    const [it] = copy.splice(idx, 1)
    copy.splice(idx + dir, 0, it)
    onChange(copy)
  }
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.id} className="relative rounded-lg border border-gray-200 bg-white p-3">
          <div className="absolute right-2 top-2 flex gap-1 text-xs">
            <button onClick={() => move(idx, -1)} disabled={idx === 0} className="px-1 disabled:opacity-30" aria-label="Move item up">↑</button>
            <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="px-1 disabled:opacity-30" aria-label="Move item down">↓</button>
            <button onClick={() => remove(item.id)} className="px-1 text-red-500" aria-label="Remove item">✕</button>
          </div>
          <div className="grid gap-2">
            {fields.map((f) => (
              <Field key={String(f.key)} label={f.label}>
                {f.kind === 'checkbox' ? (
                  <input
                    type="checkbox"
                    checked={Boolean(item[f.key])}
                    onChange={(e) => updateItem(item.id, f.key, e.target.checked)}
                    className="h-4 w-4"
                  />
                ) : f.kind === 'textarea' ? (
                  <textarea
                    value={String(item[f.key] ?? '')}
                    onChange={(e) => updateItem(item.id, f.key, e.target.value)}
                    className={textareaCls}
                    placeholder={f.placeholder}
                  />
                ) : (
                  <input
                    value={String(item[f.key] ?? '')}
                    onChange={(e) => updateItem(item.id, f.key, e.target.value)}
                    className={inputCls}
                    placeholder={f.placeholder}
                  />
                )}
              </Field>
            ))}
          </div>
        </div>
      ))}
      {addLocked ? (
        <span className="flex items-center gap-2 text-sm text-gray-500">
          <AddButton disabled /> <LockBadge onUnlock={onLocked} />
        </span>
      ) : (
        <AddButton onClick={() => onChange([...items, newItem()])} />
      )}
    </div>
  )
}

// ---------- Editors ----------

export function ProfileEditor({ data, patch }: { data: Profile; patch: PatchFn }) {
  const set = <K extends keyof Profile>(key: K, v: string) => patch((d) => void (d.profile[key] = v as never))
  return (
    <div className="grid gap-3">
      <Field label="Full name">
        <input className={inputCls} value={data.fullName} onChange={(e) => set('fullName', e.target.value)} />
      </Field>
      <Field label="Headline">
        <input className={inputCls} value={data.headline} onChange={(e) => set('headline', e.target.value)} />
      </Field>
      <Field label="About">
        <textarea className={textareaCls} value={data.about} onChange={(e) => set('about', e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Location">
          <input className={inputCls} value={data.location} onChange={(e) => set('location', e.target.value)} />
        </Field>
        <Field label="Email">
          <input className={inputCls} value={data.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Phone">
          <input className={inputCls} value={data.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
        <Field label="Website">
          <input className={inputCls} value={data.website} onChange={(e) => set('website', e.target.value)} />
        </Field>
      </div>
    </div>
  )
}

export function SkillsEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const text = value.join(', ')
  return (
    <div>
      <Field label="Skills (comma separated)">
        <input
          className={inputCls}
          value={text}
          placeholder="TypeScript, React, Node.js"
          onChange={(e) =>
            onChange(
              e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
        />
      </Field>
    </div>
  )
}

const PROJECT_FIELDS: FieldDef<Project>[] = [
  { key: 'title', label: 'Title', kind: 'text' },
  { key: 'description', label: 'Description', kind: 'textarea' },
  { key: 'tech', label: 'Tech stack', kind: 'text' },
  { key: 'link', label: 'Live URL', kind: 'text' },
  { key: 'repo', label: 'Repo URL', kind: 'text' },
  { key: 'highlight', label: 'Highlight', kind: 'checkbox' },
]

export function ProjectsEditor({
  data,
  patch,
  limit,
  locked,
  onLocked,
}: {
  data: Project[]
  patch: PatchFn
  limit: number | null
  locked: boolean
  onLocked: () => void
}) {
  const maxedOut = locked && limit !== null && data.length >= limit
  return (
    <div className="space-y-1">
      {maxedOut && (
        <div className="mb-2 rounded-md bg-amber-50 p-2 text-xs text-amber-800">
          Free tier includes {limit} projects. Upgrade for unlimited projects.
        </div>
      )}
      <ListEditor
        items={data}
        fields={PROJECT_FIELDS}
        newItem={() => ({ id: id(), title: '', description: '', tech: '', link: '', repo: '', highlight: false })}
        onChange={(items) => patch((d) => void (d.projects = items))}
        addLocked={maxedOut}
        onLocked={onLocked}
      />
    </div>
  )
}

const EXP_FIELDS: FieldDef<ExperienceItem>[] = [
  { key: 'role', label: 'Role', kind: 'text' },
  { key: 'company', label: 'Company', kind: 'text' },
  { key: 'period', label: 'Period', kind: 'text' },
  { key: 'description', label: 'Description', kind: 'textarea' },
]

export function ExperienceEditor({ data, patch }: { data: ExperienceItem[]; patch: PatchFn }) {
  return (
    <ListEditor
      items={data}
      fields={EXP_FIELDS}
      newItem={() => ({ id: id(), role: '', company: '', period: '', description: '' })}
      onChange={(items) => patch((d) => void (d.experience = items))}
    />
  )
}

const EDU_FIELDS: FieldDef<EducationItem>[] = [
  { key: 'degree', label: 'Degree', kind: 'text' },
  { key: 'institution', label: 'Institution', kind: 'text' },
  { key: 'period', label: 'Period', kind: 'text' },
  { key: 'details', label: 'Details', kind: 'textarea' },
]

export function EducationEditor({ data, patch }: { data: EducationItem[]; patch: PatchFn }) {
  return (
    <ListEditor
      items={data}
      fields={EDU_FIELDS}
      newItem={() => ({ id: id(), degree: '', institution: '', period: '', details: '' })}
      onChange={(items) => patch((d) => void (d.education = items))}
    />
  )
}

const CERT_FIELDS: FieldDef<Certification>[] = [
  { key: 'name', label: 'Name', kind: 'text' },
  { key: 'issuer', label: 'Issuer', kind: 'text' },
  { key: 'year', label: 'Year', kind: 'text' },
]

export function CertificationsEditor({ data, patch }: { data: Certification[]; patch: PatchFn }) {
  return (
    <ListEditor
      items={data}
      fields={CERT_FIELDS}
      newItem={() => ({ id: id(), name: '', issuer: '', year: '' })}
      onChange={(items) => patch((d) => void (d.certifications = items))}
    />
  )
}

export function SocialEditor({ data, patch }: { data: SocialLinks; patch: PatchFn }) {
  const set = <K extends keyof SocialLinks>(key: K, v: string) => patch((d) => void (d.social[key] = v as never))
  const keys: (keyof SocialLinks)[] = ['github', 'linkedin', 'twitter', 'instagram', 'dribbble', 'website']
  return (
    <div className="grid grid-cols-2 gap-3">
      {keys.map((k) => (
        <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
          <input className={inputCls} value={data[k]} onChange={(e) => set(k, e.target.value)} />
        </Field>
      ))}
    </div>
  )
}

export function SeoEditor({
  data,
  patch,
  advanced,
  onLocked,
}: {
  data: PortfolioData['seo']
  patch: PatchFn
  advanced: boolean
  onLocked: () => void
}) {
  const disabled = !advanced
  return (
    <div className="space-y-3">
      {!advanced && (
        <div className="rounded-md bg-amber-50 p-2 text-xs text-amber-800">
          Advanced SEO controls are premium. Free uses auto-generated title/description.
          <LockBadge onUnlock={onLocked} />
        </div>
      )}
      <Field label="Meta title">
        <input
          className={inputCls}
          value={data.title}
          disabled={disabled}
          onChange={(e) => patch((d) => void (d.seo.title = e.target.value))}
        />
      </Field>
      <Field label="Meta description">
        <textarea
          className={textareaCls}
          value={data.description}
          disabled={disabled}
          onChange={(e) => patch((d) => void (d.seo.description = e.target.value))}
        />
      </Field>
      <Field label="Keywords (comma separated)">
        <input
          className={inputCls}
          value={data.keywords}
          disabled={disabled}
          onChange={(e) => patch((d) => void (d.seo.keywords = e.target.value))}
        />
      </Field>
    </div>
  )
}

export function CustomSectionsEditor({
  data,
  patch,
  premium,
  onLocked,
}: {
  data: CustomSection[]
  patch: PatchFn
  premium: boolean
  onLocked: () => void
}) {
  if (!premium) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600">
        Create custom content blocks anywhere on your portfolio.
        <LockBadge onUnlock={onLocked} />
      </div>
    )
  }
  return (
    <ListEditor
      items={data}
      fields={[
        { key: 'title', label: 'Section title', kind: 'text' },
        { key: 'body', label: 'Content', kind: 'textarea' },
      ] as FieldDef<CustomSection>[]}
      newItem={() => ({ id: id(), title: '', body: '' })}
      onChange={(items) => patch((d) => void (d.customSections = items))}
    />
  )
}

export function TemplatePicker({
  value,
  access,
  onChange,
  onLocked,
}: {
  value: PortfolioData['template']
  access: Access
  onChange: (t: PortfolioData['template']) => void
  onLocked: () => void
}) {
  return (
    <div className="grid gap-2">
      {TEMPLATES.map((t) => {
        const allowed = isTemplateAllowed(t.id, access)
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => (allowed ? onChange(t.id) : onLocked())}
            className={`flex items-start justify-between rounded-lg border p-3 text-left ${
              value === t.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'
            }`}
          >
            <span>
              <span className="block text-sm font-semibold">{t.name}</span>
              <span className="block text-xs text-gray-500">{t.description}</span>
            </span>
            {t.free ? (
              <span className="text-[10px] font-semibold text-green-600">FREE</span>
            ) : (
              !access.premium && <LockBadge onUnlock={onLocked} />
            )}
          </button>
        )
      })}
    </div>
  )
}

export function ThemePicker({
  data,
  patch,
  premium,
  onLocked,
}: {
  data: PortfolioData['theme']
  patch: PatchFn
  premium: boolean
  onLocked: () => void
}) {
  const palettes = Object.keys(PALETTES) as (keyof typeof PALETTES)[]
  const fonts = Object.keys(FONTS) as (keyof typeof FONTS)[]
  const access: Access = { premium }
  const choosePalette = (p: keyof typeof PALETTES) => {
    if (!isPaletteAllowed(p, access)) return onLocked()
    patch((d) => void (d.theme.palette = p))
  }
  const chooseFont = (f: keyof typeof FONTS) => {
    if (!isFontAllowed(f, access)) return onLocked()
    patch((d) => void (d.theme.font = f))
  }
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-medium text-gray-600">Palette</p>
        <div className="grid grid-cols-3 gap-2">
          {palettes.map((p) => {
            const info = PALETTES[p]
            const allowedPalette = isPaletteAllowed(p, { premium })
            return (
              <button
                key={p}
                type="button"
                onClick={() => choosePalette(p)}
                className={`relative rounded-md border p-2 text-left text-xs font-medium ${
                  data.palette === p ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'
                }`}
              >
                <span className="mb-1 block h-6 w-6 rounded-full" style={{ background: info.accent }} />
                <span className="capitalize">{p}</span>
                {!allowedPalette && <LockBadge onUnlock={onLocked} />}
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-gray-600">Font</p>
        <div className="flex gap-2">
          {fonts.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => chooseFont(f)}
              className={`rounded-md border px-3 py-1 text-xs font-medium ${
                data.font === f ? 'border-indigo-500' : 'border-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <label className="relative inline-flex items-center">
          <input
            type="checkbox"
            className="peer h-4 w-4"
            checked={data.darkMode}
            disabled={!premium}
            onChange={(e) => patch((d) => void (d.theme.darkMode = e.target.checked))}
          />
          <span className="ml-2 text-sm">Dark mode</span>
        </label>
        {!premium && <LockBadge onUnlock={onLocked} />}
      </div>
    </div>
  )
}
