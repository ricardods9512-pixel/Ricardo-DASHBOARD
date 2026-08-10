'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function numOrNull(formData: FormData, key: string) {
  const raw = formData.get(key)
  if (raw === null || raw === '') return null
  const n = Number(raw)
  return Number.isNaN(n) ? null : n
}

export async function addAdEntry(formData: FormData) {
  const supabase = await createClient()

  const followers = numOrNull(formData, 'followers') ?? 0
  const investment = numOrNull(formData, 'investment') ?? 0
  const cpf = followers > 0 ? investment / followers : null

  const { error } = await supabase.from('ad_analysis').insert({
    month: formData.get('month') as string,
    week_label: (formData.get('week_label') as string) || null,
    ad_name: formData.get('ad_name') as string,
    followers,
    investment,
    cpf,
    cpf_7d: numOrNull(formData, 'cpf_7d'),
    keyword: (formData.get('keyword') as string) || null,
    status: (formData.get('status') as string) || null,
    url: (formData.get('url') as string) || null,
    sort_order: Date.now(),
  })

  if (error) throw new Error(error.message)
  revalidatePath('/')
}
