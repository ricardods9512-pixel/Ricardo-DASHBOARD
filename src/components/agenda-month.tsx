import { updateAgendaLead } from '@/app/(dashboard)/agenda-actions'

export type AgendaLead = {
  id: string
  month: string
  instagram: string
  curso: string | null
  email: string | null
  funnel: string | null
  status: string | null
  sales_call_day: string | null
  hora_sales_call: string | null
  show_up_sales_call: string | null
  venta: string | null
  reserva: number | null
  precio: number | null
  comentarios: string | null
  setter: string | null
}

const currency = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const monthTitle = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })

const STATUS_OPTIONS = ['BOOK', 'REBOOK', 'CLIENT', 'NOT CLOSED', 'CANCEL', 'NO SHOW']

function statusStyle(status: string | null) {
  const s = (status ?? '').toUpperCase()
  if (s === 'CLIENT') return { backgroundColor: 'var(--status-good)', color: 'white' }
  if (s === 'NO SHOW' || s === 'NOT CLOSED') return { backgroundColor: 'var(--status-warning)', color: 'black' }
  if (s === 'CANCEL') return { backgroundColor: 'var(--status-critical)', color: 'white' }
  if (s === 'BOOK' || s === 'REBOOK') return { backgroundColor: 'var(--series-1)', color: 'white' }
  return undefined
}

export function AgendaMonth({
  month,
  leads,
  defaultOpen,
}: {
  month: string
  leads: AgendaLead[]
  defaultOpen?: boolean
}) {
  const clients = leads.filter((l) => (l.status ?? '').toUpperCase() === 'CLIENT').length
  const totalVentas = leads.reduce((acc, l) => acc + (l.venta === 'SI' ? l.precio ?? 0 : 0), 0)

  return (
    <details
      open={defaultOpen}
      className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
    >
      <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 bg-[var(--background)] px-5 py-3">
        <span className="text-sm font-semibold capitalize">{monthTitle.format(new Date(month))}</span>
        <span className="text-xs text-[var(--foreground-muted)]">
          {leads.length} agendas · {clients} clientes · {currency.format(totalVentas)} vendido
        </span>
      </summary>

      <div className="overflow-x-auto p-3">
        <table className="w-full min-w-[1200px] text-xs">
          <thead>
            <tr className="text-left text-[var(--foreground-muted)]">
              <th className="px-2 py-2 font-medium">Instagram</th>
              <th className="px-2 py-2 font-medium">Curso hij@</th>
              <th className="px-2 py-2 font-medium">Email</th>
              <th className="px-2 py-2 font-medium">Funnel</th>
              <th className="px-2 py-2 font-medium">Llamada</th>
              <th className="px-2 py-2 font-medium">Status</th>
              <th className="px-2 py-2 font-medium">Show up</th>
              <th className="px-2 py-2 font-medium">Venta</th>
              <th className="px-2 py-2 text-right font-medium">Reserva</th>
              <th className="px-2 py-2 text-right font-medium">Precio</th>
              <th className="px-2 py-2 font-medium">Comentarios</th>
              <th className="px-2 py-2 font-medium">Setter</th>
              <th className="px-2 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-[var(--border)] align-top">
                <td className="max-w-[140px] truncate px-2 py-1.5 font-medium">{lead.instagram}</td>
                <td className="max-w-[110px] truncate px-2 py-1.5 text-[var(--foreground-secondary)]">
                  {lead.curso ?? '—'}
                </td>
                <td className="max-w-[160px] truncate px-2 py-1.5 text-[var(--foreground-secondary)]">
                  {lead.email ?? '—'}
                </td>
                <td className="px-2 py-1.5 text-[var(--foreground-secondary)]">{lead.funnel ?? '—'}</td>
                <td className="whitespace-nowrap px-2 py-1.5 text-[var(--foreground-secondary)]">
                  {lead.sales_call_day ?? '—'} {lead.hora_sales_call ?? ''}
                </td>
                <td className="px-2 py-1.5">
                  <select
                    form={`agenda-${lead.id}`}
                    name="status"
                    defaultValue={lead.status ?? ''}
                    className="rounded-lg border border-[var(--border)] px-1.5 py-1 text-xs"
                    style={statusStyle(lead.status)}
                  >
                    <option value="">—</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1.5">
                  <select
                    form={`agenda-${lead.id}`}
                    name="show_up_sales_call"
                    defaultValue={lead.show_up_sales_call ?? ''}
                    className="rounded-lg border border-[var(--border)] px-1.5 py-1 text-xs"
                  >
                    <option value="">—</option>
                    <option value="SI">SI</option>
                    <option value="NO">NO</option>
                  </select>
                </td>
                <td className="px-2 py-1.5">
                  <select
                    form={`agenda-${lead.id}`}
                    name="venta"
                    defaultValue={lead.venta ?? ''}
                    className="rounded-lg border border-[var(--border)] px-1.5 py-1 text-xs"
                  >
                    <option value="">—</option>
                    <option value="SI">SI</option>
                    <option value="NO">NO</option>
                  </select>
                </td>
                <td className="px-2 py-1.5">
                  <input
                    form={`agenda-${lead.id}`}
                    name="reserva"
                    type="number"
                    step="0.01"
                    defaultValue={lead.reserva ?? ''}
                    className="w-20 rounded-lg border border-[var(--border)] px-1.5 py-1 text-right text-xs"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    form={`agenda-${lead.id}`}
                    name="precio"
                    type="number"
                    step="0.01"
                    defaultValue={lead.precio ?? ''}
                    className="w-20 rounded-lg border border-[var(--border)] px-1.5 py-1 text-right text-xs"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    form={`agenda-${lead.id}`}
                    name="comentarios"
                    type="text"
                    defaultValue={lead.comentarios ?? ''}
                    className="w-48 rounded-lg border border-[var(--border)] px-1.5 py-1 text-xs"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    form={`agenda-${lead.id}`}
                    name="setter"
                    type="text"
                    defaultValue={lead.setter ?? ''}
                    className="w-20 rounded-lg border border-[var(--border)] px-1.5 py-1 text-xs"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <button
                    form={`agenda-${lead.id}`}
                    type="submit"
                    className="rounded-lg bg-[var(--series-1)] px-2.5 py-1 text-xs font-semibold text-white"
                  >
                    Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.map((lead) => (
          <form key={lead.id} action={updateAgendaLead} id={`agenda-${lead.id}`} className="hidden">
            <input type="hidden" name="id" value={lead.id} />
          </form>
        ))}
      </div>
    </details>
  )
}
