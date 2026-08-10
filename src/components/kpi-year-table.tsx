import type { KpiTableData, KpiTableRow } from '@/lib/data/kpi-table'

const currency = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'USD',
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
      return value.toLocaleString('es-AR')
  }
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
                <td key={idx} className="px-2 py-1.5 text-right tabular-nums">
                  {formatValue(v, row.format)}
                </td>
              ))}
              <td className="px-2 py-1.5 text-right font-semibold tabular-nums">
                {formatValue(row.total, row.format)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
