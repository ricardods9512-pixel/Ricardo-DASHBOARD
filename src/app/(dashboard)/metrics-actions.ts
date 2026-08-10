'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function numOrNull(formData: FormData, key: string) {
  const raw = formData.get(key)
  if (raw === null || raw === '') return null
  const n = Number(raw)
  return Number.isNaN(n) ? null : n
}

export async function addBusinessMetric(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('business_metrics').upsert(
    {
      month: formData.get('month') as string,
      ads_investment: numOrNull(formData, 'ads_investment'),
      new_followers: numOrNull(formData, 'new_followers'),
      conversations: numOrNull(formData, 'conversations'),
      triage_scheduled: numOrNull(formData, 'triage_scheduled'),
      triage_completed: numOrNull(formData, 'triage_completed'),
      sales_calls_scheduled: numOrNull(formData, 'sales_calls_scheduled'),
      sales_calls_completed: numOrNull(formData, 'sales_calls_completed'),
      offers_given: numOrNull(formData, 'offers_given'),
      offers_accepted: numOrNull(formData, 'offers_accepted'),
      sales_amount: numOrNull(formData, 'sales_amount'),
      cash_collected: numOrNull(formData, 'cash_collected'),
    },
    { onConflict: 'month' }
  )

  if (error) throw new Error(error.message)
  revalidatePath('/')
}

export async function addDiscordMetric(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('discord_metrics').insert({
    month: formData.get('month') as string,
    total_members: numOrNull(formData, 'total_members'),
    new_members: numOrNull(formData, 'new_members'),
    active_members: numOrNull(formData, 'active_members'),
    messages_count: numOrNull(formData, 'messages_count'),
    voice_minutes: numOrNull(formData, 'voice_minutes'),
    engagement_rate: numOrNull(formData, 'engagement_rate'),
  })

  if (error) throw new Error(error.message)
  revalidatePath('/')
}
