import { useMemo } from 'react'
import { PortfolioData } from '../types'
import { renderHtml } from '../lib/export'

export function Preview({
  data,
  viewport,
  onViewport,
}: {
  data: PortfolioData
  viewport: 'desktop' | 'mobile'
  onViewport: (v: 'desktop' | 'mobile') => void
}) {
  const html = useMemo(() => renderHtml(data), [data])
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
        <button
          onClick={() => onViewport('desktop')}
          className={`rounded px-2 py-1 text-xs font-medium ${viewport === 'desktop' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}
        >
          Desktop
        </button>
        <button
          onClick={() => onViewport('mobile')}
          className={`rounded px-2 py-1 text-xs font-medium ${viewport === 'mobile' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}
        >
          Mobile
        </button>
      </div>
      <div className="flex-1 overflow-hidden bg-gray-200">
        <iframe
          key={viewport}
          title="Portfolio preview"
          srcDoc={html}
          sandbox=""
          className="mx-auto h-full bg-white"
          style={{ width: viewport === 'mobile' ? 'min(400px, 100%)' : '100%', border: 0 }}
        />
      </div>
    </div>
  )
}
