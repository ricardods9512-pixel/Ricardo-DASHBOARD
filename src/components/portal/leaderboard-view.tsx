export type LeaderboardEntry = {
  id: string
  name: string
  points: number | null
  level: number | null
}

function medal(i: number) {
  if (i === 0) return '🥇'
  if (i === 1) return '🥈'
  if (i === 2) return '🥉'
  return `${i + 1}.`
}

export function LeaderboardView({ entries, ownId }: { entries: LeaderboardEntry[]; ownId: string }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="text-sm font-semibold">🏆 Clasificación general</h2>
      <div className="mt-4 flex flex-col gap-2">
        {entries.map((e, i) => (
          <div
            key={e.id}
            className="flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm"
            style={{
              borderColor: e.id === ownId ? 'var(--series-1)' : 'var(--border)',
              backgroundColor: e.id === ownId ? 'color-mix(in srgb, var(--series-1) 10%, transparent)' : undefined,
            }}
          >
            <span className="flex items-center gap-3 font-medium">
              <span className="w-6 text-center">{medal(i)}</span>
              {e.name} {e.id === ownId && '(vos)'}
            </span>
            <span className="text-xs text-[var(--foreground-muted)]">
              Nv.{e.level ?? 1} · {e.points ?? 0} pts
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
