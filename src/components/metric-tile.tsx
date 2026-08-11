export function MetricTile({
  icon,
  label,
  value,
  accent,
  sublabel,
  subTone = 'neutral',
}: {
  icon: string
  label: string
  value: string
  accent: string
  sublabel?: string
  subTone?: 'good' | 'bad' | 'neutral'
}) {
  const subColor =
    subTone === 'good'
      ? 'var(--status-good)'
      : subTone === 'bad'
        ? 'var(--status-critical)'
        : 'var(--foreground-muted)'

  return (
    <div
      className="rounded-xl border border-[var(--border)] p-4"
      style={{ backgroundColor: `color-mix(in srgb, ${accent} 12%, var(--surface))` }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: accent }}>
        {icon} {label}
      </p>
      <p className="mt-1 text-xl font-bold tabular-nums" style={{ color: accent }}>
        {value}
      </p>
      {sublabel && (
        <p className="mt-1 text-xs font-medium" style={{ color: subColor }}>
          {sublabel}
        </p>
      )}
    </div>
  )
}
