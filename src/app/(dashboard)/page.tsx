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

  const revenueDelta = pctDelta(latest?.revenue ?? null, previous?.revenue ?? null)
  const activeDelta = pctDelta(latest?.active_clients ?? null, previous?.active_clients ?? null)
  const mrrDelta = pctDelta(latest?.mrr ?? null, previous?.mrr ?? null)

  const businessChartData = business.map((m) => ({
    label: monthLabel.format(new Date(m.month)),
    revenue: m.revenue ?? 0,
    expenses: m.expenses ?? 0,
  }))

  const clientsChartData = business.map((m) => ({
    label: monthLabel.format(new Date(m.month)),
    active_clients: m.active_clients ?? 0,
    new_clients: m.new_clients ?? 0,
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
          label="Ingresos (último mes)"
          value={latest?.revenue != null ? currency.format(latest.revenue) : '—'}
          delta={revenueDelta !== null ? `${revenueDelta >= 0 ? '+' : ''}${revenueDelta.toFixed(1)}% vs mes anterior` : undefined}
          deltaTone={revenueDelta !== null ? (revenueDelta >= 0 ? 'good' : 'bad') : 'neutral'}
        />
        <StatTile
          label="MRR"
          value={latest?.mrr != null ? currency.format(latest.mrr) : '—'}
          delta={mrrDelta !== null ? `${mrrDelta >= 0 ? '+' : ''}${mrrDelta.toFixed(1)}% vs mes anterior` : undefined}
          deltaTone={mrrDelta !== null ? (mrrDelta >= 0 ? 'good' : 'bad') : 'neutral'}
        />
        <StatTile
          label="Clientes activos"
          value={latest?.active_clients != null ? String(latest.active_clients) : '—'}
          delta={activeDelta !== null ? `${activeDelta >= 0 ? '+' : ''}${activeDelta.toFixed(1)}% vs mes anterior` : undefined}
          deltaTone={activeDelta !== null ? (activeDelta >= 0 ? 'good' : 'bad') : 'neutral'}
        />
        <StatTile
          label="Churn"
          value={latest?.churn_rate != null ? `${latest.churn_rate}%` : '—'}
          deltaTone="neutral"
        />
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Ingresos y gastos</h2>
        </div>
        {businessChartData.length > 0 ? (
          <TrendChart
            data={businessChartData}
            series={[
              { key: 'revenue', label: 'Ingresos', color: 'var(--series-1)' },
              { key: 'expenses', label: 'Gastos', color: 'var(--series-2)' },
            ]}
            valueFormatter={(v) => currency.format(v)}
          />
        ) : (
          <EmptyChartState />
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-base font-semibold">Clientes</h2>
          {clientsChartData.length > 0 ? (
            <TrendChart
              data={clientsChartData}
              series={[
                { key: 'active_clients', label: 'Activos', color: 'var(--series-1)' },
                { key: 'new_clients', label: 'Nuevos', color: 'var(--series-3)' },
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
            + Agregar métricas del negocio del mes
          </summary>
          <form action={addBusinessMetric} className="mt-4 grid grid-cols-2 gap-3">
            <Field label="Mes" name="month" type="month" required />
            <Field label="Ingresos" name="revenue" type="number" step="0.01" />
            <Field label="Gastos" name="expenses" type="number" step="0.01" />
            <Field label="MRR" name="mrr" type="number" step="0.01" />
            <Field label="Clientes nuevos" name="new_clients" type="number" />
            <Field label="Clientes activos" name="active_clients" type="number" />
            <Field label="Churn %" name="churn_rate" type="number" step="0.01" />
            <Field label="Conversión %" name="conversion_rate" type="number" step="0.01" />
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
