export function StatTile({
  label,
  value,
  delta,
  deltaTone = 'neutral',
}: {
  label: string
  value: string
  delta?: string
  deltaTone?: 'good' | 'bad' | 'neutral'
}) {
  const deltaColor =
    deltaTone === 'good'
      ? 'text-[var(--status-good)]'
      : deltaTone === 'bad'
        ? 'text-[var(--status-critical)]'
        : 'text-[var(--foreground-muted)]'

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-sm font-medium text-[var(--foreground-secondary)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      {delta && <p className={`mt-1 text-xs font-medium ${deltaColor}`}>{delta}</p>}
    </div>
  )
}
