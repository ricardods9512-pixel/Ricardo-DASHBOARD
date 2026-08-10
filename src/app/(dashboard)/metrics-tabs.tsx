'use client'

import { useState, type ReactNode } from 'react'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'kpi-pro-funnel', label: 'KPI Pro Funnel', icon: '📈' },
  { id: 'kpis-2026', label: 'KPIs Año 2026', icon: '🗓️' },
  { id: 'analisis-ads', label: 'Análisis Ads', icon: '🎯' },
  { id: 'agendas', label: 'Agendas', icon: '📅' },
  { id: 'study-quest', label: 'StudyQuest', icon: '⚔️' },
  { id: 'kpis-2025', label: 'KPIs Año 2025', icon: '🗓️' },
] as const

export type MetricsTabId = (typeof TABS)[number]['id']

export function MetricsTabs({ tabs }: { tabs: Record<MetricsTabId, ReactNode> }) {
  const [active, setActive] = useState<MetricsTabId>('dashboard')

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b border-[var(--border)]">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`shrink-0 rounded-t-lg px-3 py-2 text-sm font-medium transition-colors ${
              active === t.id
                ? 'border-b-2 border-[var(--series-1)] text-[var(--series-1)]'
                : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)]'
            }`}
          >
            <span aria-hidden>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>
      <div className="mt-6">{tabs[active]}</div>
    </div>
  )
}
