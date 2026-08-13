'use client'

import { useState, type ReactNode } from 'react'

const TABS = [
  { id: 'comunidad', label: 'Comunidad', icon: '💬' },
  { id: 'aula', label: 'Aula', icon: '🎓' },
  { id: 'calendario', label: 'Calendario', icon: '📅' },
  { id: 'miembros', label: 'Miembros', icon: '👥' },
  { id: 'mapa', label: 'Mapa', icon: '🌍' },
  { id: 'clasificacion', label: 'Tablas de clasificación', icon: '🏆' },
  { id: 'juegos', label: 'Juegos', icon: '🎮' },
] as const

export type EscuelaTabId = (typeof TABS)[number]['id']

export function EscuelaTabs({ tabs }: { tabs: Record<EscuelaTabId, ReactNode> }) {
  const [active, setActive] = useState<EscuelaTabId>('comunidad')

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
