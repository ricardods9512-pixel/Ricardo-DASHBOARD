export type Skin = {
  id: string
  level_required: number
  name: string
  icon: string
  color: string
}

export function ProfileCard({
  name,
  points,
  level,
  pointsInLevel,
  pointsToNext,
  progressPct,
  equippedSkin,
}: {
  name: string
  points: number
  level: number
  pointsInLevel: number
  pointsToNext: number
  progressPct: number
  equippedSkin: Skin | null
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl"
          style={{ backgroundColor: `color-mix(in srgb, ${equippedSkin?.color ?? 'var(--series-1)'} 20%, transparent)` }}
        >
          {equippedSkin?.icon ?? '🎮'}
        </div>
        <div>
          <p className="text-lg font-semibold">{name}</p>
          <p className="text-sm text-[var(--foreground-muted)]">
            Nivel {level} {equippedSkin && `· ${equippedSkin.name}`}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
          <span>{pointsInLevel} / 200 pts</span>
          <span>Faltan {pointsToNext} pts para el nivel {level + 1}</span>
        </div>
        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[var(--border)]">
          <div
            className="h-full rounded-full bg-[var(--series-1)] transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold text-[var(--series-1)]">🏆 {points} puntos totales</p>
    </section>
  )
}
