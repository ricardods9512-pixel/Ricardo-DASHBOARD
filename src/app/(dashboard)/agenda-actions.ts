'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function numOrNull(formData: FormData, key: string) {
  const raw = formData.get(key)
  if (raw === null || raw === '') return null
  const n = Number(raw)
  return Number.isNaN(n) ? null : n
}

function strOrNull(formData: FormData, key: string) {
  const raw = formData.get(key)
  return raw === null || raw === '' ? null : (raw as string)
}

export async function updateAgendaLead(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { error } = await supabase
    .from('agenda_leads')
    .update({
      status: strOrNull(formData, 'status'),
      show_up_sales_call: strOrNull(formData, 'show_up_sales_call'),
      venta: strOrNull(formData, 'venta'),
      reserva: numOrNull(formData, 'reserva'),
      precio: numOrNull(formData, 'precio'),
      comentarios: strOrNull(formData, 'comentarios'),
      setter: strOrNull(formData, 'setter'),
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/')
}

export async function addAgendaLead(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('agenda_leads').insert({
    month: formData.get('month') as string,
    instagram: formData.get('instagram') as string,
    curso: strOrNull(formData, 'curso'),
    email: strOrNull(formData, 'email'),
    funnel: strOrNull(formData, 'funnel'),
    status: strOrNull(formData, 'status'),
    sales_call_day: strOrNull(formData, 'sales_call_day'),
    hora_sales_call: strOrNull(formData, 'hora_sales_call'),
    venta: strOrNull(formData, 'venta'),
    reserva: numOrNull(formData, 'reserva'),
    precio: numOrNull(formData, 'precio'),
    comentarios: strOrNull(formData, 'comentarios'),
    setter: strOrNull(formData, 'setter'),
    sort_order: Date.now(),
  })

  if (error) throw new Error(error.message)
  revalidatePath('/')
}
