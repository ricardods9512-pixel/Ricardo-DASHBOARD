'use client'

import { useState } from 'react'
import { awardPoints } from '@/app/(dashboard)/escuela/actions'

export type LeaderboardRow = {
  student_id: string
  name: string
  points: number
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string; defaultPoints: number }> = {
  asistencia: { label: 'Asistencia a clase', icon: '✅', defaultPoints: 10 },
  camara: { label: 'Cámara encendida', icon: '📷', defaultPoints: 5 },
  resultados: { label: 'Compartir resultados', icon: '📊', defaultPoints: 15 },
  mapas_mentales: { label: 'Compartir mapa mental', icon: '🧠', defaultPoints: 15 },
  otro: { label: 'Otro', icon: '⭐', defaultPoints: 10 },
}

function medal(i: number) {
  if (i === 0) return '🥇'
  if (i === 1) return '🥈'
  if (i === 2) return '🥉'
  return `${i + 1}.`
}

export function Leaderboard({
  weekly,
  monthly,
  allTime,
  students,
}: {
  weekly: LeaderboardRow[]
  monthly: LeaderboardRow[]
  allTime: LeaderboardRow[]
  students: { id: string; name: string }[]
}) {
  const [range, setRange] = useState<'weekly' | 'monthly' | 'allTime'>('weekly')
  const data = range === 'weekly' ? weekly : range === 'monthly' ? monthly : allTime

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">🏆 Clasificación</h3>
          <div className="flex gap-1 rounded-lg border border-[var(--border)] p-1 text-xs">
            {(['weekly', 'monthly', 'allTime'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`rounded-md px-3 py-1 font-medium ${
                  range === r ? 'bg-[var(--series-1)] text-white' : 'text-[var(--foreground-secondary)]'
                }`}
              >
                {r === 'weekly' ? 'Semanal (7 días)' : r === 'monthly' ? 'Mensual (30 días)' : 'Todos los tiempos'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {data.map((row, i) => (
            <div
              key={row.student_id}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-2.5"
              style={i < 3 ? { backgroundColor: 'color-mix(in srgb, var(--series-1) 8%, transparent)' } : undefined}
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <span className="w-6 text-center">{medal(i)}</span>
                {row.name}
              </span>
              <span className="text-sm font-bold tabular-nums text-[var(--series-1)]">{row.points} pts</span>
            </div>
          ))}
          {data.length === 0 && (
            <p className="text-sm text-[var(--foreground-muted)]">Todavía no hay puntos registrados en este período.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h3 className="text-sm font-semibold">+ Sumar puntos</h3>
        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          Asistencia, cámara encendida, compartir resultados o mapas mentales — cada acción suma puntos y alimenta el ranking
          semanal, mensual e histórico.
        </p>
        <form action={awardPoints} className="mt-3 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
            Alumno
            <select
              name="student_id"
              required
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
            Categoría
            <select
              name="category"
              defaultValue="asistencia"
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
            >
              {Object.entries(CATEGORY_LABELS).map(([key, c]) => (
                <option key={key} value={key}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
            Puntos
            <input
              name="points"
              type="number"
              defaultValue={10}
              className="w-20 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
            />
          </label>
          <button type="submit" className="rounded-lg bg-[var(--series-1)] px-4 py-2 text-sm font-semibold text-white">
            Sumar
          </button>
        </form>
      </div>
    </div>
  )
}
