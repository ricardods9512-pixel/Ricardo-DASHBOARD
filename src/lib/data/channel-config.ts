export type ChannelId = 'follower_ads' | 'funnel_vsl' | 'lead_magnets' | 'youtube'

export type ChannelField = {
  key: string
  label: string
  format: 'number' | 'currency'
}

export type ChannelConfig = {
  id: ChannelId
  label: string
  icon: string
  /** Campo usado como "arriba del funnel" para calcular las tasas de conversión. */
  topOfFunnelKey: string
  fields: ChannelField[]
}

export const CHANNELS: ChannelConfig[] = [
  {
    id: 'follower_ads',
    label: 'Follower Ads',
    icon: '📸',
    topOfFunnelKey: 'messages',
    fields: [
      { key: 'ads_investment', label: 'Inversión Ads (mensual)', format: 'currency' },
      { key: 'followers', label: 'Followers', format: 'number' },
      { key: 'followers_bm', label: 'Followers BM', format: 'number' },
      { key: 'messages', label: 'Mensajes (mensual estimado)', format: 'number' },
      { key: 'triage_scheduled', label: 'Triajes agendados', format: 'number' },
      { key: 'triage_completed', label: 'Triajes atendidos', format: 'number' },
      { key: 'strategy_sessions_scheduled', label: 'Sesión estratégica agendados', format: 'number' },
      { key: 'strategy_sessions_completed', label: 'Sesión estratégica atendidos', format: 'number' },
      { key: 'no_shows', label: 'No shows', format: 'number' },
      { key: 'reschedules', label: 'Redeschule', format: 'number' },
      { key: 'offers_given', label: 'Ofertas dadas', format: 'number' },
      { key: 'offers_accepted', label: 'Ofertas aceptadas', format: 'number' },
      { key: 'accepted_follower', label: 'Aceptados Follower', format: 'number' },
      { key: 'recommendation', label: 'Recomendation', format: 'number' },
      { key: 'reservations', label: 'Reservas', format: 'number' },
      { key: 'sales_amount', label: 'Importe ventas total', format: 'currency' },
      { key: 'cash_collected', label: 'Cash collected total', format: 'currency' },
    ],
  },
  {
    id: 'funnel_vsl',
    label: 'Funnel VSL',
    icon: '🎬',
    topOfFunnelKey: 'leads',
    fields: [
      { key: 'ads_investment', label: 'Inversión Ads', format: 'currency' },
      { key: 'leads', label: 'Clientes potenciales (LEADS)', format: 'number' },
      { key: 'phone_filter', label: 'Filtro teléfono / mensaje', format: 'number' },
      { key: 'triage_scheduled', label: 'Triajes agendados', format: 'number' },
      { key: 'triage_completed', label: 'Triajes hechos', format: 'number' },
      { key: 'strategy_sessions_scheduled', label: 'Sesión estratégica agendados', format: 'number' },
      { key: 'strategy_sessions_completed', label: 'Sesión estratégica hechas', format: 'number' },
      { key: 'no_shows', label: 'No shows', format: 'number' },
      { key: 'bad_leads', label: 'Bad leads', format: 'number' },
      { key: 'offers_given', label: 'Ofertas dadas', format: 'number' },
      { key: 'offers_accepted', label: 'Ofertas aceptadas', format: 'number' },
      { key: 'reservations', label: 'Reservas', format: 'number' },
      { key: 'sales_amount', label: 'Importe ventas total', format: 'currency' },
      { key: 'cash_collected', label: 'Cash collected total', format: 'currency' },
    ],
  },
  {
    id: 'lead_magnets',
    label: 'Lead Magnets',
    icon: '🧲',
    topOfFunnelKey: 'masterclass_requests',
    fields: [
      { key: 'ads_investment', label: 'Inversión Ads', format: 'currency' },
      { key: 'page_visitors', label: 'Visitantes a la página', format: 'number' },
      { key: 'registrations', label: 'Número de registros', format: 'number' },
      { key: 'masterclass_requests', label: 'Piden Masterclass por WhatsApp', format: 'number' },
      { key: 'followers', label: 'Seguidores', format: 'number' },
      { key: 'triage_scheduled', label: 'Triajes agendados', format: 'number' },
      { key: 'triage_completed', label: 'Triajes hechos', format: 'number' },
      { key: 'strategy_sessions_scheduled', label: 'Sesión estratégica agendados', format: 'number' },
      { key: 'strategy_sessions_completed', label: 'Sesión estratégica hechas', format: 'number' },
      { key: 'no_shows', label: 'No shows', format: 'number' },
      { key: 'bad_leads', label: 'Bad leads', format: 'number' },
      { key: 'offers_given', label: 'Ofertas dadas', format: 'number' },
      { key: 'offers_accepted', label: 'Ofertas aceptadas', format: 'number' },
      { key: 'reservations', label: 'Reservas', format: 'number' },
      { key: 'sales_amount', label: 'Importe ventas total', format: 'currency' },
      { key: 'cash_collected', label: 'Cash collected total', format: 'currency' },
    ],
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: '▶️',
    topOfFunnelKey: 'leads',
    fields: [
      { key: 'ads_investment', label: 'Inversión Ads', format: 'currency' },
      { key: 'leads', label: 'Clientes potenciales (LEADS)', format: 'number' },
      { key: 'phone_filter', label: 'Filtro teléfono / mensaje', format: 'number' },
      { key: 'triage_scheduled', label: 'Triajes agendados', format: 'number' },
      { key: 'triage_completed', label: 'Triajes hechos', format: 'number' },
      { key: 'strategy_sessions_scheduled', label: 'Sesión estratégica agendados', format: 'number' },
      { key: 'strategy_sessions_completed', label: 'Sesión estratégica hechas', format: 'number' },
      { key: 'no_shows', label: 'No shows', format: 'number' },
      { key: 'bad_leads', label: 'Bad leads', format: 'number' },
      { key: 'offers_given', label: 'Ofertas dadas', format: 'number' },
      { key: 'offers_accepted', label: 'Ofertas aceptadas', format: 'number' },
      { key: 'reservations', label: 'Reservas', format: 'number' },
      { key: 'sales_amount', label: 'Importe ventas total', format: 'currency' },
      { key: 'cash_collected', label: 'Cash collected total', format: 'currency' },
    ],
  },
]

export function getChannel(id: ChannelId) {
  return CHANNELS.find((c) => c.id === id)!
}
