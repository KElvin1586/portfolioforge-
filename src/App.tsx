import { useEffect, useMemo, useRef, useState } from 'react'
import { PortfolioData, PortfolioSnapshot } from './types'
import { createSamplePortfolio } from './lib/sample'
import { appConfig } from './config'
import { saveLocal, loadLocal, exportJsonFile, validatePortfolio, getSnapshots, addSnapshot, deleteSnapshot } from './lib/storage'
import { renderHtml, downloadTextFile } from './lib/export'
import { FREE_PROJECT_LIMIT, TEMPLATES } from './lib/features'
import { Preview } from './components/Preview'
import { UpgradeModal } from './components/Modals'
import { LockBadge, Button } from './components/ui'
import {
  ProfileEditor,
  SkillsEditor,
  ProjectsEditor,
  ExperienceEditor,
  EducationEditor,
  CertificationsEditor,
  SocialEditor,
  SeoEditor,
  CustomSectionsEditor,
  TemplatePicker,
  ThemePicker,
  PatchFn,
} from './components/Editors'

type TabId =
  | 'profile'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'certifications'
  | 'social'
  | 'template'
  | 'theme'
  | 'seo'
  | 'custom'
  | 'history'

const TABS: { id: TabId; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'social', label: 'Contact & Social' },
  { id: 'template', label: 'Template' },
  { id: 'theme', label: 'Theme' },
  { id: 'seo', label: 'SEO' },
  { id: 'custom', label: 'Custom Sections' },
  { id: 'history', label: 'History' },
]

export default function App() {
  const stored = loadLocal()
  const [data, setData] = useState<PortfolioData>(() => stored?.data ?? createSamplePortfolio())
  const [tab, setTab] = useState<TabId>('profile')
  const [premium, setPremium] = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [savedNote, setSavedNote] = useState('')
  const [snapshots, setSnapshots] = useState<PortfolioSnapshot[]>(() => getSnapshots())
  const importRef = useRef<HTMLInputElement>(null)

  const patch: PatchFn = (mutator) => {
    setData((prev) => {
      const next = structuredClone(prev)
      mutator(next as PortfolioData)
      return next
    })
  }

  useEffect(() => {
    saveLocal(data)
    setSavedNote(new Date().toLocaleTimeString())
  }, [data])

  const openUpgrade = () => setUpgradeOpen(true)

  const exportCurrent = () => downloadTextFile(renderHtml(data), 'index.html', 'text/html')
  const exportAll = () => {
    if (!premium) return openUpgrade()
    const current = data.template
    TEMPLATES.forEach((t) => downloadTextFile(renderHtml({ ...data, template: t.id }), `index-${t.id}.html`, 'text/html'))
    setData((d) => ({ ...d, template: current }))
  }

  const onImport = (file: File) => {
    file.text().then((text) => {
      try {
        const parsed = JSON.parse(text)
        if (validatePortfolio(parsed)) {
          setData(parsed)
        } else {
          alert('That file doesn’t look like a PortfolioForge export.')
        }
      } catch {
        alert('Invalid JSON file.')
      }
    })
  }

  const saveSnapshot = () => {
    if (!premium) return openUpgrade()
    const snap: PortfolioSnapshot = {
      id: Math.random().toString(36).slice(2, 10),
      label: data.profile.fullName || 'Untitled',
      takenAt: new Date().toISOString(),
      data: structuredClone(data) as PortfolioData,
    }
    addSnapshot(snap)
    setSnapshots(getSnapshots())
  }

  const restoreSnapshot = (id: string) => {
    if (!premium) return openUpgrade()
    const snap = snapshots.find((s) => s.id === id)
    if (snap) setData(structuredClone(snap.data))
  }

  const removeSnapshot = (id: string) => {
    deleteSnapshot(id)
    setSnapshots(getSnapshots())
  }

  const editorContent = useMemo(() => {
    switch (tab) {
      case 'profile':
        return <ProfileEditor data={data.profile} patch={patch} />
      case 'skills':
        return <SkillsEditor value={data.skills} onChange={(v) => patch((d) => void (d.skills = v))} />
      case 'projects':
        return (
          <ProjectsEditor
            data={data.projects}
            patch={patch}
            limit={FREE_PROJECT_LIMIT}
            locked={!premium}
            onLocked={openUpgrade}
          />
        )
      case 'experience':
        return <ExperienceEditor data={data.experience} patch={patch} />
      case 'education':
        return <EducationEditor data={data.education} patch={patch} />
      case 'certifications':
        return <CertificationsEditor data={data.certifications} patch={patch} />
      case 'social':
        return <SocialEditor data={data.social} patch={patch} />
      case 'template':
        return <TemplatePicker value={data.template} access={{ premium }} onChange={(t) => patch((d) => void (d.template = t))} onLocked={openUpgrade} />
      case 'theme':
        return <ThemePicker data={data.theme} patch={patch} premium={premium} onLocked={openUpgrade} />
      case 'seo':
        return <SeoEditor data={data.seo} patch={patch} advanced={premium} onLocked={openUpgrade} />
      case 'custom':
        return <CustomSectionsEditor data={data.customSections} patch={patch} premium={premium} onLocked={openUpgrade} />
      case 'history':
        return (
          <div>
            {!premium ? (
              <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600">
                Version history keeps reversible snapshots of your portfolio.
                <LockBadge onUnlock={openUpgrade} />
              </div>
            ) : (
              <div className="space-y-2">
                <Button onClick={saveSnapshot}>Take snapshot</Button>
                {snapshots.length === 0 && <p className="text-sm text-gray-500">No snapshots yet.</p>}
                {snapshots.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded border border-gray-200 p-2">
                    <div>
                      <p className="text-sm font-medium">{s.label}</p>
                      <p className="text-xs text-gray-500">{new Date(s.takenAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => restoreSnapshot(s.id)}>Restore</Button>
                      <Button variant="danger" onClick={() => removeSnapshot(s.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }, [tab, data, premium, snapshots])

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-4 py-2">
          <h1 className="mr-2 text-lg font-bold text-indigo-700">⚒️ PortfolioForge</h1>
          <div className="mr-auto flex flex-wrap gap-1">
            <span className="rounded-md px-2 py-1 text-xs text-green-600">✓ auto-saved {savedNote}</span>
            <Button variant="ghost" onClick={() => importRef.current?.click()}>Import</Button>
            <Button variant="ghost" onClick={() => exportJsonFile(data)}>Export JSON</Button>
            <Button variant="primary" onClick={exportCurrent}>Export HTML</Button>
            <Button variant="ghost" onClick={exportAll}>
              Export All
              {!premium && <LockBadge onUnlock={openUpgrade} />}
            </Button>
          </div>
          <label className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={premium}
              onChange={(e) => {
                setPremium(e.target.checked)
                if (!e.target.checked) setTab(tab)
              }}
            />
            Premium demo
          </label>
          <Button variant="primary" onClick={openUpgrade}>
            Upgrade — {appConfig.premiumPrice}
          </Button>
          <input
            ref={importRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImport(f)
              e.target.value = ''
            }}
          />
        </div>
      </header>
      <main className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[280px_minmax(0,420px)_1fr]">
        <nav className="rounded-lg border border-gray-200 bg-white p-2">
          <ul className="space-y-0.5">
            {TABS.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setTab(t.id)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium ${
                    tab === t.id ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <section className="overflow-y-auto rounded-lg border border-gray-200 bg-white p-4" aria-label="Editor">
          {editorContent}
        </section>
        <section className="rounded-lg border border-gray-200 bg-white" aria-label="Preview">
          <Preview data={data} viewport={viewport} onViewport={setViewport} />
        </section>
      </main>
      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        onSimulate={() => {
          setPremium(true)
          setUpgradeOpen(false)
        }}
      />
    </div>
  )
}
