import type { BusinessMetric } from './types'

export type KpiTableRow = {
  label: string
  values: number[]
  total: number
  format: 'number' | 'currency' | 'percent' | 'ratio'
}

export type KpiTableData = {
  monthLabels: string[]
  rows: KpiTableRow[]
}

const MONTH_LABELS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function pct(numerator: number, denominator: number) {
  return denominator > 0 ? (numerator / denominator) * 100 : 0
}

export function buildKpiYearTable(business: BusinessMetric[], year: number): KpiTableData {
  const byMonth: (BusinessMetric | undefined)[] = Array.from({ length: 12 }, (_, i) => {
    const monthDate = `${year}-${String(i + 1).padStart(2, '0')}-01`
    return business.find((m) => m.month.slice(0, 10) === monthDate)
  })

  const field = (key: keyof BusinessMetric) => byMonth.map((m) => Number(m?.[key] ?? 0))
  const sumOf = (values: number[]) => values.reduce((acc, v) => acc + v, 0)

  const adsInvestment = field('ads_investment')
  const newFollowers = field('new_followers')
  const conversations = field('conversations')
  const triageScheduled = field('triage_scheduled')
  const triageCompleted = field('triage_completed')
  const callsScheduled = field('sales_calls_scheduled')
  const callsCompleted = field('sales_calls_completed')
  const offersGiven = field('offers_given')
  const offersAccepted = field('offers_accepted')
  const salesAmount = field('sales_amount')
  const cashCollected = field('cash_collected')

  const callsScheduledPct = callsScheduled.map((v, i) => pct(v, conversations[i]))
  const attendancePct = callsCompleted.map((v, i) => pct(v, callsScheduled[i]))
  const closePct = offersAccepted.map((v, i) => pct(v, offersGiven[i]))
  const cashPct = cashCollected.map((v, i) => pct(v, salesAmount[i]))
  const roas = salesAmount.map((v, i) => (adsInvestment[i] > 0 ? v / adsInvestment[i] : 0))

  const rows: KpiTableRow[] = [
    { label: 'Inversión Ads mensual', values: adsInvestment, total: sumOf(adsInvestment), format: 'currency' },
    { label: 'Seguidores nuevos totales', values: newFollowers, total: sumOf(newFollowers), format: 'number' },
    { label: 'Conversaciones totales (aprox)', values: conversations, total: sumOf(conversations), format: 'number' },
    { label: 'Triajes agendados', values: triageScheduled, total: sumOf(triageScheduled), format: 'number' },
    { label: 'Triajes realizados', values: triageCompleted, total: sumOf(triageCompleted), format: 'number' },
    { label: 'Videollamadas venta agendadas', values: callsScheduled, total: sumOf(callsScheduled), format: 'number' },
    { label: 'Videollamadas venta realizadas', values: callsCompleted, total: sumOf(callsCompleted), format: 'number' },
    { label: 'Ofertas dadas', values: offersGiven, total: sumOf(offersGiven), format: 'number' },
    { label: 'Ofertas aceptadas', values: offersAccepted, total: sumOf(offersAccepted), format: 'number' },
    { label: 'Importe ventas total', values: salesAmount, total: sumOf(salesAmount), format: 'currency' },
    { label: 'Dinero recibido', values: cashCollected, total: sumOf(cashCollected), format: 'currency' },
    { label: '% Llamadas agendadas (vs conversaciones)', values: callsScheduledPct, total: pct(sumOf(callsScheduled), sumOf(conversations)), format: 'percent' },
    { label: 'Asistencia a llamada de ventas %', values: attendancePct, total: pct(sumOf(callsCompleted), sumOf(callsScheduled)), format: 'percent' },
    { label: '% Ventas (aceptadas/dadas)', values: closePct, total: pct(sumOf(offersAccepted), sumOf(offersGiven)), format: 'percent' },
    { label: '% Dinero recibido (vs vendido)', values: cashPct, total: pct(sumOf(cashCollected), sumOf(salesAmount)), format: 'percent' },
    { label: 'ROAS', values: roas, total: sumOf(adsInvestment) > 0 ? sumOf(salesAmount) / sumOf(adsInvestment) : 0, format: 'ratio' },
  ]

  return { monthLabels: MONTH_LABELS, rows }
}
