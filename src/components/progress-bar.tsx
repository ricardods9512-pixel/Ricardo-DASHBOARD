export function ProgressBar({
  label,
  pct,
  detail,
  color = 'var(--series-1)',
}: {
  label: string
  pct: number
  detail?: string
  color?: string
}) {
  const clamped = Math.max(0, Math.min(100, pct))

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-[var(--foreground-secondary)]">
        <span>{label}</span>
        <span className="tabular-nums">{clamped.toFixed(0)}%</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full transition-[width]"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
      {detail && <p className="mt-1 text-xs text-[var(--foreground-muted)]">{detail}</p>}
    </div>
  )
}
