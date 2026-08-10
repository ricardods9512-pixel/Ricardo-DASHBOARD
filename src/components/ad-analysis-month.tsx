export type AdEntry = {
  id: string
  month: string
  week_label: string | null
  ad_name: string
  followers: number | null
  investment: number | null
  cpf: number | null
  cpf_7d: number | null
  keyword: string | null
  status: string | null
  url: string | null
  sort_order: number | null
}

const currency = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
})

const monthTitle = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })

function statusTone(status: string | null) {
  const s = (status ?? '').toLowerCase()
  if (s.includes('mantengo')) return { bg: 'var(--status-good)', text: 'white' }
  if (s.includes('vigilar')) return { bg: 'var(--status-warning)', text: 'black' }
  if (s.includes('nuevo')) return { bg: 'var(--series-1)', text: 'white' }
  if (s.includes('parar') || s.includes('parado')) return { bg: 'var(--status-critical)', text: 'white' }
  return null
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-[var(--foreground-muted)]">—</span>
  const tone = statusTone(status)
  if (!tone) return <span>{status}</span>
  return (
    <span
      className="rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: tone.bg, color: tone.text }}
    >
      {status}
    </span>
  )
}

export function AdAnalysisMonth({
  month,
  entries,
  defaultOpen,
}: {
  month: string
  entries: AdEntry[]
  defaultOpen?: boolean
}) {
  const totalInvestment = entries.reduce((acc, e) => acc + (e.investment ?? 0), 0)
  const totalFollowers = entries.reduce((acc, e) => acc + (e.followers ?? 0), 0)

  const byAd = new Map<string, AdEntry[]>()
  for (const e of entries) {
    const key = e.ad_name || '(sin nombre)'
    const list = byAd.get(key) ?? []
    list.push(e)
    byAd.set(key, list)
  }

  return (
    <details
      open={defaultOpen}
      className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
    >
      <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 bg-[var(--background)] px-5 py-3">
        <span className="text-sm font-semibold capitalize">{monthTitle.format(new Date(month))}</span>
        <span className="text-xs text-[var(--foreground-muted)]">
          {currency.format(totalInvestment)} invertidos · {totalFollowers.toLocaleString('es-ES')} seguidores ·{' '}
          {byAd.size} anuncio{byAd.size === 1 ? '' : 's'}
        </span>
      </summary>

      <div className="flex flex-col gap-4 p-5">
        {Array.from(byAd.entries()).map(([adName, rows]) => (
          <div key={adName} className="overflow-hidden rounded-xl border border-[var(--border)]">
            <div className="bg-[var(--series-1)] px-4 py-2 text-sm font-semibold text-white">{adName}</div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-xs">
                <thead>
                  <tr className="text-left text-[var(--foreground-muted)]">
                    <th className="px-3 py-2 font-medium">Semana</th>
                    <th className="px-3 py-2 text-right font-medium">Seguidores</th>
                    <th className="px-3 py-2 text-right font-medium">Inversión</th>
                    <th className="px-3 py-2 text-right font-medium">CPF</th>
                    <th className="px-3 py-2 text-right font-medium">CPF 7 días</th>
                    <th className="px-3 py-2 font-medium">Keyword</th>
                    <th className="px-3 py-2 font-medium">Estado</th>
                    <th className="px-3 py-2 font-medium">URL</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t border-[var(--border)]">
                      <td className="px-3 py-1.5 whitespace-nowrap">{r.week_label ?? '—'}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {(r.followers ?? 0).toLocaleString('es-ES')}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {currency.format(r.investment ?? 0)}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {r.cpf != null ? currency.format(r.cpf) : '—'}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {r.cpf_7d != null ? currency.format(r.cpf_7d) : '—'}
                      </td>
                      <td className="px-3 py-1.5">{r.keyword ?? '—'}</td>
                      <td className="px-3 py-1.5">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="max-w-[160px] truncate px-3 py-1.5">
                        {r.url ? (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[var(--series-1)] underline"
                          >
                            Ver anuncio
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </details>
  )
}
