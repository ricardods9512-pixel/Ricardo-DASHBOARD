import type { KpiTableData, KpiTableRow } from '@/lib/data/kpi-table'

const currency = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

function formatValue(value: number, format: KpiTableRow['format']) {
  switch (format) {
    case 'currency':
      return currency.format(value)
    case 'percent':
      return `${value.toFixed(1)}%`
    case 'ratio':
      return `${value.toFixed(1)}x`
    default:
      return value.toLocaleString('es-ES')
  }
}

type Tone = 'good' | 'warn' | 'bad' | 'neutral'

const toneBackground: Record<Tone, string> = {
  good: 'color-mix(in srgb, var(--status-good) 16%, transparent)',
  warn: 'color-mix(in srgb, var(--status-warning) 20%, transparent)',
  bad: 'color-mix(in srgb, var(--status-critical) 14%, transparent)',
  neutral: 'transparent',
}

/** Semáforo: filas con umbral (%, ROAS) se colorean por valor absoluto; el resto por tendencia mes a mes. */
function cellTone(row: KpiTableRow, value: number, previousValue: number | undefined): Tone {
  if (row.thresholds) {
    if (value >= row.thresholds.good) return 'good'
    if (value >= row.thresholds.warn) return 'warn'
    return value > 0 ? 'bad' : 'neutral'
  }
  if (value === 0 || previousValue === undefined || previousValue === 0 || value === previousValue) {
    return 'neutral'
  }
  return value > previousValue ? 'good' : 'bad'
}

export function KpiYearTable({ data }: { data: KpiTableData }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-xs">
        <thead>
          <tr className="text-left text-[var(--foreground-muted)]">
            <th className="sticky left-0 bg-[var(--surface)] py-2 pr-3 font-medium">Indicador</th>
            {data.monthLabels.map((m) => (
              <th key={m} className="px-2 py-2 text-right font-medium">
                {m.slice(0, 3)}
              </th>
            ))}
            <th className="px-2 py-2 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr
              key={row.label}
              className={`border-t border-[var(--border)] ${i >= 11 ? 'bg-[var(--background)]/40' : ''}`}
            >
              <td className="sticky left-0 whitespace-nowrap bg-[var(--surface)] py-1.5 pr-3 font-medium text-[var(--foreground-secondary)]">
                {row.label}
              </td>
              {row.values.map((v, idx) => (
                <td
                  key={idx}
                  className="px-2 py-1.5 text-right tabular-nums"
                  style={{ backgroundColor: toneBackground[cellTone(row, v, row.values[idx - 1])] }}
                >
                  {formatValue(v, row.format)}
                </td>
              ))}
              <td
                className="px-2 py-1.5 text-right font-semibold tabular-nums"
                style={{ backgroundColor: toneBackground[cellTone(row, row.total, undefined)] }}
              >
                {formatValue(row.total, row.format)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--foreground-muted)]">
        <LegendDot tone="good" label="Buen rendimiento / en alza" />
        <LegendDot tone="warn" label="Rendimiento medio" />
        <LegendDot tone="bad" label="Bajo rendimiento / en baja" />
      </div>
    </div>
  )
}

function LegendDot({ tone, label }: { tone: Tone; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: `var(--status-${tone === 'good' ? 'good' : tone === 'warn' ? 'warning' : 'critical'})` }}
      />
      {label}
    </span>
  )
}
