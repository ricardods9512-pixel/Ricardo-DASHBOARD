'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function upsertChannelMetric(formData: FormData) {
  const supabase = await createClient()

  const channel = formData.get('channel') as string
  const month = formData.get('month') as string

  const data: Record<string, number> = {}
  for (const [key, value] of formData.entries()) {
    if (key === 'channel' || key === 'month') continue
    const n = Number(value)
    data[key] = Number.isNaN(n) ? 0 : n
  }

  const { error } = await supabase
    .from('channel_metrics')
    .upsert({ channel, month, data }, { onConflict: 'channel,month' })

  if (error) throw new Error(error.message)
  revalidatePath('/')
}
