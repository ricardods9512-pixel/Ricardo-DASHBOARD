import type { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { StatTile } from '@/components/stat-tile'
import { TrendChart } from '@/components/charts/trend-chart'
import { FunnelChart } from '@/components/charts/funnel-chart'
import { MonthlyBarChart } from '@/components/charts/monthly-bar-chart'
import { ProgressBar } from '@/components/progress-bar'
import { MetricTile } from '@/components/metric-tile'
import { KpiYearTable } from '@/components/kpi-year-table'
import { ChannelMetricForm } from '@/components/channel-metric-form'
import { AdAnalysisMonth, type AdEntry } from '@/components/ad-analysis-month'
import { AdEntryForm } from '@/components/ad-entry-form'
import { AgendaMonth, type AgendaLead } from '@/components/agenda-month'
import { AgendaEntryForm } from '@/components/agenda-entry-form'
import { StudyQuestTable, type StudyQuestClient } from '@/components/studyquest-table'
import { StudyQuestEntryForm } from '@/components/studyquest-entry-form'
import { addBusinessMetric, addDiscordMetric } from './metrics-actions'
import { MetricsTabs } from './metrics-tabs'
import type { BusinessMetric, DiscordMetric } from '@/lib/data/types'
import { levelForXp, studentLevelBand, STUDENT_LEVEL_BANDS } from '@/lib/data/gamification'
import { buildKpiYearTable } from '@/lib/data/kpi-table'
import { CHANNELS } from '@/lib/data/channel-config'
import {
  buildChannelYearTable,
  buildTotalYearTable,
  buildMrrYearTable,
  MRR_FIELDS,
  type ChannelMetricRow,
} from '@/lib/data/channel-table'

const currency = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const monthLabel = new Intl.DateTimeFormat('es-AR', { month: 'short', year: '2-digit' })

const MONTH_LABELS_ES = [
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SEPTIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE',
]

function monthlyValue(business: BusinessMetric[], year: number, monthIndex: number, key: keyof BusinessMetric) {
  const row = business.find((m) => {
    const d = new Date(m.month)
    return d.getFullYear() === year && d.getMonth() === monthIndex
  })
  return row ? Number(row[key]) || 0 : 0
}

function sumForYear(business: BusinessMetric[], year: number, key: keyof BusinessMetric) {
  return business
    .filter((m) => new Date(m.month).getFullYear() === year)
    .reduce((acc, m) => acc + (Number(m[key]) || 0), 0)
}

const CHANNEL_HEADER_CLASS: Record<string, string> = {
  follower_ads: 'bg-[#E1306C] text-white',
  funnel_vsl: 'bg-[#f5c518] text-black',
  lead_magnets: 'bg-[#14b8a6] text-white',
  youtube: 'bg-[#FF0000] text-white',
}

function ChannelSection({
  title,
  subtitle,
  headerClass,
  children,
}: {
  title: string
  subtitle?: string
  headerClass: string
  children: ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className={`px-5 py-3 ${headerClass}`}>
        <h2 className="text-base font-semibold">{title}</h2>
        {subtitle && <p className="text-xs opacity-90">{subtitle}</p>}
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

export default async function MetricasPage() {
  const supabase = await createClient()

  const [
    { data: businessRows },
    { data: discordRows },
    { data: studentRows },
    { data: channelRows },
    { data: adRows },
    { data: agendaRows },
    { data: sqRows },
  ] = await Promise.all([
    supabase
      .from('business_metrics')
      .select('*')
      .order('month', { ascending: true })
      .limit(240),
    supabase
      .from('discord_metrics')
      .select('*')
      .order('month', { ascending: true })
      .limit(12),
    supabase.from('school_students').select('level'),
    supabase.from('channel_metrics').select('channel, month, data').order('month', { ascending: true }),
    supabase
      .from('ad_analysis')
      .select('*')
      .order('month', { ascending: false })
      .order('sort_order', { ascending: true })
      .limit(2000),
    supabase
      .from('agenda_leads')
      .select('*')
      .order('month', { ascending: false })
      .order('sort_order', { ascending: true })
      .limit(2000),
    supabase
      .from('studyquest_clients')
      .select('*')
      .order('sort_order', { ascending: true })
      .limit(2000),
  ])

  const business = (businessRows ?? []) as BusinessMetric[]
  const discord = (discordRows ?? []) as DiscordMetric[]
  const channelMetrics = (channelRows ?? []) as { channel: string; month: string; data: Record<string, number> }[]
  const rowsByChannel: Record<string, ChannelMetricRow[]> = {}
  for (const row of channelMetrics) {
    rowsByChannel[row.channel] ??= []
    rowsByChannel[row.channel].push({ month: row.month, data: row.data })
  }
  const students = (studentRows ?? []) as { level: number | null }[]
  const adEntries = (adRows ?? []) as AdEntry[]

  const adsByMonth = new Map<string, AdEntry[]>()
  for (const entry of adEntries) {
    const list = adsByMonth.get(entry.month) ?? []
    list.push(entry)
    adsByMonth.set(entry.month, list)
  }
  const adMonths = Array.from(adsByMonth.keys()).sort((a, b) => (a < b ? 1 : -1))

  const agendaLeads = (agendaRows ?? []) as AgendaLead[]
  const agendasByMonth = new Map<string, AgendaLead[]>()
  for (const lead of agendaLeads) {
    const list = agendasByMonth.get(lead.month) ?? []
    list.push(lead)
    agendasByMonth.set(lead.month, list)
  }
  const agendaMonths = Array.from(agendasByMonth.keys()).sort((a, b) => (a < b ? 1 : -1))

  const studyQuestClients = (sqRows ?? []) as StudyQuestClient[]
  const sqGroups = new Map<string, StudyQuestClient[]>()
  for (const c of studyQuestClients) {
    const key = c.grupo ?? '__main__'
    const list = sqGroups.get(key) ?? []
    list.push(c)
    sqGroups.set(key, list)
  }
  const sqMainClients = sqGroups.get('__main__') ?? []
  const sqOtherGroups = Array.from(sqGroups.entries()).filter(([key]) => key !== '__main__')

  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)
  const in30DaysStr = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const currentMonthStr = todayStr.slice(0, 7)
  const sqCasosExito = studyQuestClients.filter((c) => c.exito_entrevista === 1).length
  const sqVencidasSinRenovar = studyQuestClients.filter(
    (c) => c.toca_6m !== null && c.toca_6m < todayStr && c.renovaciones === 0,
  ).length
  const sqProximos30 = studyQuestClients.filter((c) =>
    [c.toca_3m, c.toca_6m, c.toca_9m].some((d) => d !== null && d >= todayStr && d <= in30DaysStr),
  ).length
  const sqEsteMes = studyQuestClients.filter((c) => c.fecha_alta?.slice(0, 7) === currentMonthStr).length

  const recentBusiness = business.slice(-12)

  const funnelChartData = recentBusiness.map((m) => ({
    label: monthLabel.format(new Date(m.month)),
    sales_calls_scheduled: m.sales_calls_scheduled ?? 0,
    sales_calls_completed: m.sales_calls_completed ?? 0,
    offers_given: m.offers_given ?? 0,
    offers_accepted: m.offers_accepted ?? 0,
  }))

  // --- Gamificación: nivel, XP, insignias, funnel acumulado ---
  const sum = (key: keyof BusinessMetric) =>
    business.reduce((acc, m) => acc + (Number(m[key]) || 0), 0)

  const totalXp = sum('sales_amount')
  const totalCash = sum('cash_collected')
  const totalConversations = sum('conversations')
  const totalCallsScheduled = sum('sales_calls_scheduled')
  const totalCallsCompleted = sum('sales_calls_completed')
  const totalOffersGiven = sum('offers_given')
  const totalOffersAccepted = sum('offers_accepted')

  const level = levelForXp(totalXp)
  const cobradoPct = totalXp > 0 ? (totalCash / totalXp) * 100 : 0
  const cierrePct = totalOffersGiven > 0 ? (totalOffersAccepted / totalOffersGiven) * 100 : 0

  const currentYear = new Date().getFullYear()
  const previousYear = currentYear - 1
  const currentYearSales = business
    .filter((m) => new Date(m.month).getFullYear() === currentYear)
    .reduce((acc, m) => acc + (m.sales_amount ?? 0), 0)
  const previousYearSales = business
    .filter((m) => new Date(m.month).getFullYear() === currentYear - 1)
    .reduce((acc, m) => acc + (m.sales_amount ?? 0), 0)

  // --- Panel de control: mes en curso, acumulado anual, gráficas mensuales ---
  const currentMonthIndex = now.getMonth()
  const currentMonthRow = business.find((m) => {
    const d = new Date(m.month)
    return d.getFullYear() === currentYear && d.getMonth() === currentMonthIndex
  })
  const previousMonthDate = new Date(currentYear, currentMonthIndex - 1, 1)
  const previousMonthRow = business.find((m) => {
    const d = new Date(m.month)
    return d.getFullYear() === previousMonthDate.getFullYear() && d.getMonth() === previousMonthDate.getMonth()
  })

  const mesFacturacion = currentMonthRow?.sales_amount ?? 0
  const mesCash = currentMonthRow?.cash_collected ?? 0
  const mesAds = currentMonthRow?.ads_investment ?? 0
  const mesSeguidores = currentMonthRow?.new_followers ?? 0
  const mesConversaciones = currentMonthRow?.conversations ?? 0
  const mesOfertasDadas = currentMonthRow?.offers_given ?? 0
  const mesOfertasAceptadas = currentMonthRow?.offers_accepted ?? 0
  const mesFacturacionAnterior = previousMonthRow?.sales_amount ?? 0
  const mesFacturacionDelta = mesFacturacion - mesFacturacionAnterior
  const mesCobradoPct = mesFacturacion > 0 ? (mesCash / mesFacturacion) * 100 : 0
  const mesRoas = mesAds > 0 ? mesFacturacion / mesAds : 0

  const facturacionAnioActual = sumForYear(business, currentYear, 'sales_amount')
  const cashAnioActual = sumForYear(business, currentYear, 'cash_collected')
  const facturacionAnioAnterior = sumForYear(business, previousYear, 'sales_amount')
  const cashAnioAnterior = sumForYear(business, previousYear, 'cash_collected')
  const adsAnioActual = sumForYear(business, currentYear, 'ads_investment')
  const mejorMesAnioActual = Math.max(
    0,
    ...MONTH_LABELS_ES.map((_, i) => monthlyValue(business, currentYear, i, 'sales_amount')),
  )
  const pendienteCobroAnio = facturacionAnioActual - cashAnioActual
  const vsAnioAnteriorPct =
    facturacionAnioAnterior > 0
      ? ((facturacionAnioActual - facturacionAnioAnterior) / facturacionAnioAnterior) * 100
      : null
  const multiploAdsAnio = adsAnioActual > 0 ? facturacionAnioActual / adsAnioActual : 0
  const cobradoAnioPct = facturacionAnioActual > 0 ? (cashAnioActual / facturacionAnioActual) * 100 : 0

  const facturacionCashChartData = MONTH_LABELS_ES.map((label, i) => ({
    label,
    sales_amount: monthlyValue(business, currentYear, i, 'sales_amount'),
    cash_collected: monthlyValue(business, currentYear, i, 'cash_collected'),
  }))

  const facturacionYoyChartData = MONTH_LABELS_ES.map((label, i) => ({
    label,
    prev_year: monthlyValue(business, previousYear, i, 'sales_amount'),
    curr_year: monthlyValue(business, currentYear, i, 'sales_amount'),
  }))

  const sqVencidas = studyQuestClients.reduce((acc, c) => {
    let n = 0
    if (c.toca_3m && c.toca_3m < todayStr && c.check_3m === 0) n++
    if (c.toca_6m && c.toca_6m < todayStr && c.check_6m === 0) n++
    if (c.toca_9m && c.toca_9m < todayStr && c.check_9m === 0) n++
    return acc + n
  }, 0)
  const sqExitoPct = studyQuestClients.length > 0 ? (sqCasosExito / studyQuestClients.length) * 100 : 0

  const leadsClients = agendaLeads.filter((l) => l.status === 'CLIENT').length
  const leadsVentasSi = agendaLeads.filter((l) => l.venta === 'SI').length
  const leadsNotClosed = agendaLeads.filter((l) => l.status === 'NOT CLOSED').length
  const leadsNoShow = agendaLeads.filter((l) => l.status === 'NO SHOW').length

  let streakMonths = 0
  for (let i = business.length - 1; i >= 0; i--) {
    if ((business[i].sales_amount ?? 0) > 0) streakMonths++
    else break
  }

  const badges = [
    business.some((m) => (m.sales_amount ?? 0) >= 10000) && '🥇 Mes 5 cifras',
    cobradoPct >= 60 && '💎 Cobrador Élite',
    totalXp >= 50000 && '🚀 Club 50K',
    streakMonths >= 3 && `📆 Racha ${streakMonths} meses`,
    previousYearSales > 0 && currentYearSales > previousYearSales && '⚡ Superando el año anterior',
  ].filter((b): b is string => Boolean(b))

  const funnelStages = [
    { label: 'Conversaciones', value: totalConversations, color: 'var(--series-1)' },
    { label: 'Llamadas agendadas', value: totalCallsScheduled, color: 'var(--series-3)' },
    { label: 'Llamadas realizadas', value: totalCallsCompleted, color: 'var(--series-2)' },
    { label: 'Ofertas dadas', value: totalOffersGiven, color: 'var(--status-good)' },
    { label: 'Ofertas aceptadas', value: totalOffersAccepted, color: 'var(--series-1)' },
  ]

  const studentLevelCounts = STUDENT_LEVEL_BANDS.map((band) => ({
    label: band,
    value: students.filter((s) => studentLevelBand(s.level) === band).length,
    color: 'var(--series-1)',
  }))
  const hasStudentLevels = studentLevelCounts.some((s) => s.value > 0)

  const discordChartData = discord.map((d) => ({
    label: monthLabel.format(new Date(d.month)),
    active_members: d.active_members ?? 0,
    total_members: d.total_members ?? 0,
  }))

  const kpi2026 = buildKpiYearTable(business, 2026)
  const kpi2025 = buildKpiYearTable(business, 2025)

  const businessMetricForm = (
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
  )

  const dashboardTab = (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-medium text-[var(--foreground-muted)]">
          🟢 Actualizado en vivo · Hoy es {new Intl.DateTimeFormat('es-ES').format(now)} · Mes en curso: mes{' '}
          {currentMonthIndex + 1}
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="bg-black px-5 py-2.5">
          <h2 className="text-sm font-semibold text-[#f5c518]">
            🔥 Mes en curso — se actualiza solo cada mes
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-6">
          <MetricTile
            icon="💰"
            label="Facturación"
            value={currency.format(mesFacturacion)}
            accent="var(--series-1)"
            sublabel={`${mesFacturacionDelta >= 0 ? '▲' : '▼'} ${currency.format(Math.abs(mesFacturacionDelta))} vs mes ant.`}
            subTone={mesFacturacionDelta >= 0 ? 'good' : 'bad'}
          />
          <MetricTile
            icon="💵"
            label="Cash"
            value={currency.format(mesCash)}
            accent="var(--status-good)"
            sublabel={`Cobrado ${mesCobradoPct.toFixed(0)}% del mes`}
          />
          <MetricTile
            icon="🎯"
            label="Ads"
            value={currency.format(mesAds)}
            accent="#a855f7"
            sublabel={`ROAS mes: ${mesRoas.toFixed(1)}x`}
          />
          <MetricTile icon="👥" label="Seguidores" value={String(mesSeguidores)} accent="#8b5cf6" />
          <MetricTile icon="💬" label="Conversaciones" value={String(mesConversaciones)} accent="#ec4899" />
          <MetricTile
            icon="🎁"
            label="Ofertas"
            value={String(mesOfertasDadas)}
            accent="#f97316"
            sublabel={`Aceptadas: ${mesOfertasAceptadas}`}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="bg-[#7a1f1f] px-5 py-2.5">
          <h2 className="text-sm font-semibold text-white">💰 Acumulado anual</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-6">
          <MetricTile
            icon="💰"
            label={`Facturación ${currentYear}`}
            value={currency.format(facturacionAnioActual)}
            accent="var(--series-1)"
            sublabel={
              vsAnioAnteriorPct !== null
                ? `${vsAnioAnteriorPct >= 0 ? '▲' : '▼'} ${vsAnioAnteriorPct >= 0 ? '+' : ''}${vsAnioAnteriorPct.toFixed(0)}% vs ${previousYear} completo`
                : undefined
            }
            subTone={vsAnioAnteriorPct !== null && vsAnioAnteriorPct >= 0 ? 'good' : 'bad'}
          />
          <MetricTile
            icon="💵"
            label={`Cash ${currentYear}`}
            value={currency.format(cashAnioActual)}
            accent="var(--status-good)"
            sublabel={`Pendiente cobro: ${currency.format(pendienteCobroAnio)}`}
          />
          <MetricTile
            icon="📦"
            label={`Facturación ${previousYear}`}
            value={currency.format(facturacionAnioAnterior)}
            accent="#f97316"
          />
          <MetricTile
            icon="📦"
            label={`Cash ${previousYear}`}
            value={currency.format(cashAnioAnterior)}
            accent="#b45309"
          />
          <MetricTile
            icon="🏆"
            label={`Mejor mes ${String(currentYear).slice(2)}`}
            value={currency.format(mejorMesAnioActual)}
            accent="var(--status-critical)"
          />
          <MetricTile
            icon="🎯"
            label={`Inversión Ads ${String(currentYear).slice(2)}`}
            value={currency.format(adsAnioActual)}
            accent="#a855f7"
            sublabel={`Múltiplo: ${multiploAdsAnio.toFixed(1)}x facturación/ads`}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold">🎮 Nivel y progreso</h2>
          <span className="text-sm font-semibold text-[var(--series-1)]">
            Nv. {level.number} · {level.name}
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          XP: {currency.format(totalXp)}
          {level.next && ` · próximo nivel: ${level.next} (${currency.format(level.nextThreshold!)} XP)`}
        </p>

        {badges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--foreground-secondary)]"
              >
                {b}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ProgressBar
            label={level.next ? `Hacia ${level.next}` : 'Nivel máximo alcanzado'}
            pct={level.progressPct}
            color="var(--series-1)"
          />
          <ProgressBar label={`% Cobrado ${currentYear}`} pct={cobradoAnioPct} color="var(--series-3)" />
          <ProgressBar label="% Casos de éxito" pct={sqExitoPct} color="#8b5cf6" />
          <ProgressBar label="% Cierre de leads" pct={cierrePct} color="var(--series-2)" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">Funnel de ventas (histórico)</h3>
            <FunnelChart stages={funnelStages} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Alumnos por nivel</h3>
            {hasStudentLevels ? (
              <FunnelChart stages={studentLevelCounts} />
            ) : (
              <EmptyChartState />
            )}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="bg-[#1f2937] px-5 py-2.5">
          <h2 className="text-sm font-semibold text-white">🎓 Alumnos · 📅 Leads</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
              🎓 Alumnos (StudyQuest)
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <MetricTile icon="🎓" label="Clientes" value={String(studyQuestClients.length)} accent="var(--series-1)" />
              <MetricTile icon="⏰" label="Vencidas" value={String(sqVencidas)} accent="var(--status-critical)" />
            </div>
            <p className="mt-3 text-xs text-[var(--foreground-secondary)]">
              🏆 Éxito: {sqCasosExito} ({sqExitoPct.toFixed(0)}%) · 📆 Próximos 30 días: {sqProximos30}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
              📅 Leads (Agendas)
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <MetricTile icon="✅" label="Clients" value={String(leadsClients)} accent="var(--status-good)" />
              <MetricTile icon="💰" label="Ventas SI" value={String(leadsVentasSi)} accent="var(--series-1)" />
            </div>
            <p className="mt-3 text-xs text-[var(--foreground-secondary)]">
              ⛔ Not closed: {leadsNotClosed} · 👻 No show: {leadsNoShow}
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="bg-black px-5 py-2.5">
          <h2 className="text-sm font-semibold text-white">📈 Gráficas</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">💰 Facturación vs Cash — {currentYear}</h3>
            <MonthlyBarChart
              data={facturacionCashChartData}
              series={[
                { key: 'sales_amount', label: 'Facturación', color: 'var(--series-1)' },
                { key: 'cash_collected', label: 'Cash', color: 'var(--status-good)' },
              ]}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold">
              📈 Facturación: {previousYear} vs {currentYear}
            </h3>
            <MonthlyBarChart
              data={facturacionYoyChartData}
              series={[
                { key: 'prev_year', label: String(previousYear), color: '#f97316' },
                { key: 'curr_year', label: String(currentYear), color: 'var(--series-1)' },
              ]}
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-base font-semibold">Funnel de ventas (por mes)</h2>
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
        {businessMetricForm}

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

  const kpis2026Tab = (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-base font-semibold">KPIs Año 2026</h2>
        <div className="mt-4">
          <KpiYearTable data={kpi2026} />
        </div>
      </section>
      {businessMetricForm}
    </div>
  )

  const kpis2025Tab = (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-base font-semibold">KPIs Año 2025</h2>
        <div className="mt-4">
          <KpiYearTable data={kpi2025} />
        </div>
      </section>
      {businessMetricForm}
    </div>
  )

  const funnelYear = new Date().getFullYear()
  const totalYearTable = buildTotalYearTable(rowsByChannel, funnelYear)
  const mrrYearTable = buildMrrYearTable(rowsByChannel.mrr_recurrencia ?? [], funnelYear)

  const kpiProFunnelTab = (
    <div className="flex flex-col gap-6">
      <ChannelSection title="TOTAL" subtitle="Suma automática de los 4 canales" headerClass="bg-[#d03b3b] text-white">
        <KpiYearTable data={totalYearTable} />
        <p className="mt-3 text-xs text-[var(--foreground-muted)]">
          Esta tabla se calcula sola a partir de las 5 tablas de abajo, no hace falta cargarla a mano.
        </p>
      </ChannelSection>

      {CHANNELS.map((config) => (
        <ChannelSection
          key={config.id}
          title={`${config.icon} ${config.label}`}
          headerClass={CHANNEL_HEADER_CLASS[config.id]}
        >
          <KpiYearTable data={buildChannelYearTable(rowsByChannel[config.id] ?? [], config, funnelYear)} />
          <div className="mt-4">
            <ChannelMetricForm channel={config.id} fields={config.fields} />
          </div>
        </ChannelSection>
      ))}

      <ChannelSection title="🔁 MRR Recurrencia" headerClass="bg-[var(--status-warning)] text-black">
        <KpiYearTable data={mrrYearTable} />
        <div className="mt-4">
          <ChannelMetricForm channel="mrr_recurrencia" fields={MRR_FIELDS} />
        </div>
      </ChannelSection>
    </div>
  )

  const analisisAdsTab = (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold">🎯 Análisis Ads</h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Histórico semanal de cada anuncio, mes a mes
        </p>
      </div>
      {adMonths.length > 0 ? (
        adMonths.map((month, i) => (
          <AdAnalysisMonth
            key={month}
            month={month}
            entries={adsByMonth.get(month)!}
            defaultOpen={i === 0}
          />
        ))
      ) : (
        <EmptyChartState />
      )}
      <AdEntryForm />
    </div>
  )

  const agendasTab = (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold">📅 Agendas</h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Leads y llamadas de ventas, mes a mes. Editá cualquier campo y tocá &quot;Guardar&quot; en la fila.
        </p>
      </div>
      {agendaMonths.length > 0 ? (
        agendaMonths.map((month, i) => (
          <AgendaMonth
            key={month}
            month={month}
            leads={agendasByMonth.get(month)!}
            defaultOpen={i === 0}
          />
        ))
      ) : (
        <EmptyChartState />
      )}
      <AgendaEntryForm />
    </div>
  )

  const studyQuestTab = (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold">⚔️ Study Quest</h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Seguimiento de alumnos, renovaciones y niveles de XP. Editá cualquier campo y tocá &quot;Guardar&quot; en la fila.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatTile label="Clientes" value={String(studyQuestClients.length)} deltaTone="neutral" />
        <StatTile label="Casos Éxito" value={String(sqCasosExito)} deltaTone="good" />
        <StatTile label="Vencidas sin renovar" value={String(sqVencidasSinRenovar)} deltaTone="bad" />
        <StatTile label="Próximos 30 días" value={String(sqProximos30)} deltaTone="neutral" />
        <StatTile label="Alta este mes" value={String(sqEsteMes)} deltaTone="good" />
      </div>

      {studyQuestClients.length > 0 ? (
        <>
          <StudyQuestTable title="🎓 Alumnos" clients={sqMainClients} />
          {sqOtherGroups.map(([grupo, clients]) => (
            <StudyQuestTable key={grupo} title={`📦 ${grupo}`} clients={clients} />
          ))}
        </>
      ) : (
        <EmptyChartState />
      )}
      <StudyQuestEntryForm />
    </div>
  )

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Métricas del negocio</h1>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Resumen mensual de facturación, clientes y comunidad
        </p>
      </div>

      <MetricsTabs
        tabs={{
          dashboard: dashboardTab,
          'kpi-pro-funnel': kpiProFunnelTab,
          'kpis-2026': kpis2026Tab,
          'analisis-ads': analisisAdsTab,
          agendas: agendasTab,
          'study-quest': studyQuestTab,
          'kpis-2025': kpis2025Tab,
        }}
      />
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
