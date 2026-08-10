import type { ChannelConfig, ChannelField } from './channel-config'
import { CHANNELS } from './channel-config'
import type { KpiTableData, KpiTableRow } from './kpi-table'

const MONTH_LABELS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export type ChannelMetricRow = {
  month: string
  data: Record<string, number>
}

function pct(numerator: number, denominator: number) {
  return denominator > 0 ? (numerator / denominator) * 100 : 0
}

export function buildChannelYearTable(
  rows: ChannelMetricRow[],
  config: ChannelConfig,
  year: number
): KpiTableData {
  const byMonth: Record<string, number>[] = Array.from({ length: 12 }, (_, i) => {
    const monthDate = `${year}-${String(i + 1).padStart(2, '0')}-01`
    return rows.find((r) => r.month.slice(0, 10) === monthDate)?.data ?? {}
  })

  const field = (key: string) => byMonth.map((m) => Number(m[key] ?? 0))
  const sumOf = (values: number[]) => values.reduce((acc, v) => acc + v, 0)

  const fieldRows: KpiTableRow[] = config.fields.map((f) => {
    const values = field(f.key)
    return { label: f.label, values, total: sumOf(values), format: f.format }
  })

  const topOfFunnel = field(config.topOfFunnelKey)
  const triageScheduled = field('triage_scheduled')
  const triageCompleted = field('triage_completed')
  const sessionsScheduled = field('strategy_sessions_scheduled')
  const sessionsCompleted = field('strategy_sessions_completed')
  const offersGiven = field('offers_given')
  const offersAccepted = field('offers_accepted')
  const salesAmount = field('sales_amount')
  const cashCollected = field('cash_collected')
  const adsInvestment = field('ads_investment')

  const triageScheduledPct = triageScheduled.map((v, i) => pct(v, topOfFunnel[i]))
  const triageCompletedPct = triageCompleted.map((v, i) => pct(v, triageScheduled[i]))
  const leadsToCallPct = sessionsScheduled.map((v, i) => pct(v, topOfFunnel[i]))
  const attendancePct = sessionsCompleted.map((v, i) => pct(v, sessionsScheduled[i]))
  const closeRateGeneral = offersAccepted.map((v, i) => pct(v, topOfFunnel[i]))
  const salesPct = offersAccepted.map((v, i) => pct(v, offersGiven[i]))
  const cashPct = cashCollected.map((v, i) => pct(v, salesAmount[i]))
  const roas = salesAmount.map((v, i) => (adsInvestment[i] > 0 ? v / adsInvestment[i] : 0))
  const roasCash = cashCollected.map((v, i) => (adsInvestment[i] > 0 ? v / adsInvestment[i] : 0))

  const computedRows: KpiTableRow[] = [
    { label: '% Triajes agendados', values: triageScheduledPct, total: pct(sumOf(triageScheduled), sumOf(topOfFunnel)), format: 'percent', thresholds: { good: 3, warn: 1 } },
    { label: '% Triajes realizados', values: triageCompletedPct, total: pct(sumOf(triageCompleted), sumOf(triageScheduled)), format: 'percent', thresholds: { good: 80, warn: 60 } },
    { label: '% Leads to sales call', values: leadsToCallPct, total: pct(sumOf(sessionsScheduled), sumOf(topOfFunnel)), format: 'percent', thresholds: { good: 3, warn: 1 } },
    { label: '% Asistencia sales call', values: attendancePct, total: pct(sumOf(sessionsCompleted), sumOf(sessionsScheduled)), format: 'percent', thresholds: { good: 80, warn: 60 } },
    { label: 'Close rate general', values: closeRateGeneral, total: pct(sumOf(offersAccepted), sumOf(topOfFunnel)), format: 'percent', thresholds: { good: 2, warn: 0.5 } },
    { label: '% Ventas (aceptadas/dadas)', values: salesPct, total: pct(sumOf(offersAccepted), sumOf(offersGiven)), format: 'percent', thresholds: { good: 30, warn: 15 } },
    { label: '% Cash collective', values: cashPct, total: pct(sumOf(cashCollected), sumOf(salesAmount)), format: 'percent', thresholds: { good: 40, warn: 20 } },
    { label: 'ROAS', values: roas, total: sumOf(adsInvestment) > 0 ? sumOf(salesAmount) / sumOf(adsInvestment) : 0, format: 'ratio', thresholds: { good: 3, warn: 1 } },
    { label: 'ROAS (cash collected)', values: roasCash, total: sumOf(adsInvestment) > 0 ? sumOf(cashCollected) / sumOf(adsInvestment) : 0, format: 'ratio', thresholds: { good: 3, warn: 1 } },
  ]

  return { monthLabels: MONTH_LABELS, rows: [...fieldRows, ...computedRows] }
}

const SHARED_KEYS = [
  'ads_investment',
  'triage_scheduled',
  'triage_completed',
  'strategy_sessions_scheduled',
  'strategy_sessions_completed',
  'offers_given',
  'offers_accepted',
  'sales_amount',
  'cash_collected',
] as const

const SHARED_LABELS: Record<(typeof SHARED_KEYS)[number], KpiTableRow['format']> = {
  ads_investment: 'currency',
  triage_scheduled: 'number',
  triage_completed: 'number',
  strategy_sessions_scheduled: 'number',
  strategy_sessions_completed: 'number',
  offers_given: 'number',
  offers_accepted: 'number',
  sales_amount: 'currency',
  cash_collected: 'currency',
}

const SHARED_LABEL_TEXT: Record<(typeof SHARED_KEYS)[number], string> = {
  ads_investment: 'Inversión Ads (total canales)',
  triage_scheduled: 'Triajes agendados (total)',
  triage_completed: 'Triajes realizados (total)',
  strategy_sessions_scheduled: 'Sesiones estratégicas agendadas (total)',
  strategy_sessions_completed: 'Sesiones estratégicas realizadas (total)',
  offers_given: 'Ofertas dadas (total)',
  offers_accepted: 'Ofertas aceptadas (total)',
  sales_amount: 'Importe ventas total (todos los canales)',
  cash_collected: 'Cash collected (todos los canales)',
}

/** Suma automática de los 4 canales (Follower Ads, Funnel VSL, Lead Magnets, YouTube) mes a mes. */
export function buildTotalYearTable(
  rowsByChannel: Record<string, ChannelMetricRow[]>,
  year: number
): KpiTableData {
  const byMonth: Record<string, number>[] = Array.from({ length: 12 }, (_, i) => {
    const monthDate = `${year}-${String(i + 1).padStart(2, '0')}-01`
    const merged: Record<string, number> = {}
    for (const channel of CHANNELS) {
      const data = rowsByChannel[channel.id]?.find((r) => r.month.slice(0, 10) === monthDate)?.data ?? {}
      const topOfFunnel = Number(data[channel.topOfFunnelKey] ?? 0)
      merged.top_of_funnel = (merged.top_of_funnel ?? 0) + topOfFunnel
      for (const key of SHARED_KEYS) {
        merged[key] = (merged[key] ?? 0) + Number(data[key] ?? 0)
      }
    }
    return merged
  })

  const field = (key: string) => byMonth.map((m) => Number(m[key] ?? 0))
  const sumOf = (values: number[]) => values.reduce((acc, v) => acc + v, 0)

  const fieldRows: KpiTableRow[] = SHARED_KEYS.map((key) => {
    const values = field(key)
    return { label: SHARED_LABEL_TEXT[key], values, total: sumOf(values), format: SHARED_LABELS[key] }
  })

  const topOfFunnel = field('top_of_funnel')
  const sessionsScheduled = field('strategy_sessions_scheduled')
  const sessionsCompleted = field('strategy_sessions_completed')
  const offersGiven = field('offers_given')
  const offersAccepted = field('offers_accepted')
  const salesAmount = field('sales_amount')
  const cashCollected = field('cash_collected')
  const adsInvestment = field('ads_investment')

  const closeRateGeneral = offersAccepted.map((v, i) => pct(v, topOfFunnel[i]))
  const attendancePct = sessionsCompleted.map((v, i) => pct(v, sessionsScheduled[i]))
  const salesPct = offersAccepted.map((v, i) => pct(v, offersGiven[i]))
  const cashPct = cashCollected.map((v, i) => pct(v, salesAmount[i]))
  const roas = salesAmount.map((v, i) => (adsInvestment[i] > 0 ? v / adsInvestment[i] : 0))

  const computedRows: KpiTableRow[] = [
    { label: 'Leads / top de funnel (total)', values: topOfFunnel, total: sumOf(topOfFunnel), format: 'number' },
    { label: '% Asistencia sales call', values: attendancePct, total: pct(sumOf(sessionsCompleted), sumOf(sessionsScheduled)), format: 'percent', thresholds: { good: 80, warn: 60 } },
    { label: 'Close rate general', values: closeRateGeneral, total: pct(sumOf(offersAccepted), sumOf(topOfFunnel)), format: 'percent', thresholds: { good: 2, warn: 0.5 } },
    { label: '% Ventas (aceptadas/dadas)', values: salesPct, total: pct(sumOf(offersAccepted), sumOf(offersGiven)), format: 'percent', thresholds: { good: 30, warn: 15 } },
    { label: '% Cash collective', values: cashPct, total: pct(sumOf(cashCollected), sumOf(salesAmount)), format: 'percent', thresholds: { good: 40, warn: 20 } },
    { label: 'ROAS', values: roas, total: sumOf(adsInvestment) > 0 ? sumOf(salesAmount) / sumOf(adsInvestment) : 0, format: 'ratio', thresholds: { good: 3, warn: 1 } },
  ]

  return { monthLabels: MONTH_LABELS, rows: [...fieldRows, ...computedRows] }
}

export const MRR_FIELDS: ChannelField[] = [
  { key: 'renewals_count', label: 'Renovaciones', format: 'number' },
  { key: 'renewals_amount', label: 'Importe renovaciones', format: 'currency' },
  { key: 'renewals_cash', label: 'Cash collected (renovaciones)', format: 'currency' },
  { key: 'upsells_count', label: 'Upsells', format: 'number' },
  { key: 'upsells_amount', label: 'Importe upsells', format: 'currency' },
  { key: 'upsells_cash', label: 'Cash collected (upsells)', format: 'currency' },
  { key: 'mrr_amount', label: 'MRR (mensual)', format: 'currency' },
]

export function buildMrrYearTable(rows: ChannelMetricRow[], year: number): KpiTableData {
  const byMonth: Record<string, number>[] = Array.from({ length: 12 }, (_, i) => {
    const monthDate = `${year}-${String(i + 1).padStart(2, '0')}-01`
    return rows.find((r) => r.month.slice(0, 10) === monthDate)?.data ?? {}
  })

  const field = (key: string) => byMonth.map((m) => Number(m[key] ?? 0))
  const sumOf = (values: number[]) => values.reduce((acc, v) => acc + v, 0)

  const fieldRows: KpiTableRow[] = MRR_FIELDS.map((f) => {
    const values = field(f.key)
    return { label: f.label, values, total: sumOf(values), format: f.format }
  })

  const renewalsAmount = field('renewals_amount')
  const renewalsCash = field('renewals_cash')
  const upsellsAmount = field('upsells_amount')
  const upsellsCash = field('upsells_cash')
  const mrrAmount = field('mrr_amount')

  let running = 0
  const mrrRunningTotal = mrrAmount.map((v) => {
    running += v
    return running
  })

  const totalFacturado = renewalsAmount.map((v, i) => v + upsellsAmount[i] + mrrAmount[i])
  const totalCobrado = renewalsCash.map((v, i) => v + upsellsCash[i] + mrrAmount[i])

  const computedRows: KpiTableRow[] = [
    { label: 'MRR acumulado', values: mrrRunningTotal, total: sumOf(mrrAmount), format: 'currency' },
    { label: 'Total facturado (renov. + upsell + MRR)', values: totalFacturado, total: sumOf(totalFacturado), format: 'currency' },
    { label: 'Total cash collected', values: totalCobrado, total: sumOf(totalCobrado), format: 'currency' },
  ]

  return { monthLabels: MONTH_LABELS, rows: [...fieldRows, ...computedRows] }
}
