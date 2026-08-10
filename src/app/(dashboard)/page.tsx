import { createClient } from '@/lib/supabase/server'
import { StatTile } from '@/components/stat-tile'
import { TrendChart } from '@/components/charts/trend-chart'
import { addBusinessMetric, addDiscordMetric } from './metrics-actions'
import type { BusinessMetric, DiscordMetric } from '@/lib/data/types'

const currency = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const monthLabel = new Intl.DateTimeFormat('es-AR', { month: 'short', year: '2-digit' })

function pctDelta(current: number | null, previous: number | null) {
  if (current === null || previous === null || previous === 0) return null
  return ((current - previous) / Math.abs(previous)) * 100
}

export default async function MetricasPage() {
  const supabase = await createClient()

  const [{ data: businessRows }, { data: discordRows }] = await Promise.all([
    supabase
      .from('business_metrics')
      .select('*')
      .order('month', { ascending: true })
      .limit(12),
    supabase
      .from('discord_metrics')
      .select('*')
      .order('month', { ascending: true })
      .limit(12),
  ])

  const business = (businessRows ?? []) as BusinessMetric[]
  const discord = (discordRows ?? []) as DiscordMetric[]

  const latest = business[business.length - 1]
  const previous = business[business.length - 2]

  const roas = (m?: BusinessMetric) =>
    m?.ads_investment ? (m.sales_amount ?? 0) / m.ads_investment : null
  const closePct = (m?: BusinessMetric) =>
    m?.offers_given ? ((m.offers_accepted ?? 0) / m.offers_given) * 100 : null

  const salesDelta = pctDelta(latest?.sales_amount ?? null, previous?.sales_amount ?? null)
  const cashDelta = pctDelta(latest?.cash_collected ?? null, previous?.cash_collected ?? null)
  const roasDelta = pctDelta(roas(latest), roas(previous))

  const businessChartData = business.map((m) => ({
    label: monthLabel.format(new Date(m.month)),
    sales_amount: m.sales_amount ?? 0,
    cash_collected: m.cash_collected ?? 0,
  }))

  const funnelChartData = business.map((m) => ({
    label: monthLabel.format(new Date(m.month)),
    sales_calls_scheduled: m.sales_calls_scheduled ?? 0,
    sales_calls_completed: m.sales_calls_completed ?? 0,
    offers_given: m.offers_given ?? 0,
    offers_accepted: m.offers_accepted ?? 0,
  }))

  const discordChartData = discord.map((d) => ({
    label: monthLabel.format(new Date(d.month)),
    active_members: d.active_members ?? 0,
    total_members: d.total_members ?? 0,
  }))

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Métricas del negocio</h1>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Resumen mensual de facturación, clientes y comunidad
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Facturación (último mes)"
          value={latest?.sales_amount != null ? currency.format(latest.sales_amount) : '—'}
          delta={salesDelta !== null ? `${salesDelta >= 0 ? '+' : ''}${salesDelta.toFixed(1)}% vs mes anterior` : undefined}
          deltaTone={salesDelta !== null ? (salesDelta >= 0 ? 'good' : 'bad') : 'neutral'}
        />
        <StatTile
          label="Cash cobrado (último mes)"
          value={latest?.cash_collected != null ? currency.format(latest.cash_collected) : '—'}
          delta={cashDelta !== null ? `${cashDelta >= 0 ? '+' : ''}${cashDelta.toFixed(1)}% vs mes anterior` : undefined}
          deltaTone={cashDelta !== null ? (cashDelta >= 0 ? 'good' : 'bad') : 'neutral'}
        />
        <StatTile
          label="ROAS"
          value={roas(latest) != null ? `${roas(latest)!.toFixed(1)}x` : '—'}
          delta={roasDelta !== null ? `${roasDelta >= 0 ? '+' : ''}${roasDelta.toFixed(1)}% vs mes anterior` : undefined}
          deltaTone={roasDelta !== null ? (roasDelta >= 0 ? 'good' : 'bad') : 'neutral'}
        />
        <StatTile
          label="% Cierre (ofertas)"
          value={closePct(latest) != null ? `${closePct(latest)!.toFixed(1)}%` : '—'}
          deltaTone="neutral"
        />
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Facturación vs Cash cobrado</h2>
        </div>
        {businessChartData.length > 0 ? (
          <TrendChart
            data={businessChartData}
            series={[
              { key: 'sales_amount', label: 'Facturación', color: 'var(--series-1)' },
              { key: 'cash_collected', label: 'Cash cobrado', color: 'var(--series-2)' },
            ]}
            valueFormat="currency"
          />
        ) : (
          <EmptyChartState />
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-base font-semibold">Funnel de ventas</h2>
          {funnelChartData.length > 0 ? (
            <TrendChart
              data={funnelChartData}
              series={[
                { key: 'sales_calls_scheduled', label: 'Llamadas agendadas', color: 'var(--series-1)' },
                { key: 'sales_calls_completed', label: 'Llamadas realizadas', color: 'var(--series-3)' },
                { key: 'offers_given', label: 'Ofertas dadas', color: 'var(--series-2)' },
                { key: 'offers_accepted', label: 'Ofertas aceptadas', color: 'var(--status-good)' },
              ]}
            />
          ) : (
            <EmptyChartState />
          )}
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-base font-semibold">Comunidad de Discord</h2>
          {discordChartData.length > 0 ? (
            <TrendChart
              data={discordChartData}
              series={[
                { key: 'total_members', label: 'Miembros totales', color: 'var(--series-1)' },
                { key: 'active_members', label: 'Miembros activos', color: 'var(--series-3)' },
              ]}
            />
          ) : (
            <EmptyChartState />
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <details className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer text-sm font-semibold">
            + Agregar / actualizar métricas del negocio del mes
          </summary>
          <form action={addBusinessMetric} className="mt-4 grid grid-cols-2 gap-3">
            <Field label="Mes" name="month" type="month" required />
            <Field label="Inversión Ads" name="ads_investment" type="number" step="0.01" />
            <Field label="Seguidores nuevos" name="new_followers" type="number" />
            <Field label="Conversaciones" name="conversations" type="number" />
            <Field label="Triajes agendados" name="triage_scheduled" type="number" />
            <Field label="Triajes realizados" name="triage_completed" type="number" />
            <Field label="Videollamadas agendadas" name="sales_calls_scheduled" type="number" />
            <Field label="Videollamadas realizadas" name="sales_calls_completed" type="number" />
            <Field label="Ofertas dadas" name="offers_given" type="number" />
            <Field label="Ofertas aceptadas" name="offers_accepted" type="number" />
            <Field label="Importe ventas" name="sales_amount" type="number" step="0.01" />
            <Field label="Dinero recibido" name="cash_collected" type="number" step="0.01" />
            <SubmitButton />
          </form>
        </details>

        <details className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer text-sm font-semibold">
            + Agregar métricas de Discord del mes
          </summary>
          <form action={addDiscordMetric} className="mt-4 grid grid-cols-2 gap-3">
            <Field label="Mes" name="month" type="month" required />
            <Field label="Miembros totales" name="total_members" type="number" />
            <Field label="Miembros nuevos" name="new_members" type="number" />
            <Field label="Miembros activos" name="active_members" type="number" />
            <Field label="Mensajes" name="messages_count" type="number" />
            <Field label="Minutos de voz" name="voice_minutes" type="number" />
            <Field label="Engagement %" name="engagement_rate" type="number" step="0.01" />
            <SubmitButton />
          </form>
        </details>
      </div>
    </div>
  )
}

function EmptyChartState() {
  return (
    <p className="mt-6 text-sm text-[var(--foreground-muted)]">
      Todavía no hay datos cargados para este gráfico.
    </p>
  )
}

function Field({
  label,
  name,
  type,
  step,
  required,
}: {
  label: string
  name: string
  type: string
  step?: string
  required?: boolean
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
      {label}
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
      />
    </label>
  )
}

function SubmitButton() {
  return (
    <div className="col-span-2 mt-2">
      <button
        type="submit"
        className="rounded-lg bg-[var(--series-1)] px-4 py-2 text-sm font-semibold text-white"
      >
        Guardar
      </button>
    </div>
  )
}
