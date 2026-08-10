'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function intOrZero(formData: FormData, key: string) {
  const raw = formData.get(key)
  if (raw === null || raw === '') return 0
  const n = Number(raw)
  return Number.isNaN(n) ? 0 : n
}

function strOrNull(formData: FormData, key: string) {
  const raw = formData.get(key)
  return raw === null || raw === '' ? null : (raw as string)
}

export async function updateStudyQuestClient(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { error } = await supabase
    .from('studyquest_clients')
    .update({
      pilar: strOrNull(formData, 'pilar'),
      renovaciones: intOrZero(formData, 'renovaciones'),
      exito_entrevista: intOrZero(formData, 'exito_entrevista'),
      resultado: intOrZero(formData, 'resultado'),
      upsell: intOrZero(formData, 'upsell'),
      check_3m: intOrZero(formData, 'check_3m'),
      check_6m: intOrZero(formData, 'check_6m'),
      check_9m: intOrZero(formData, 'check_9m'),
      xp: intOrZero(formData, 'xp'),
      notas: strOrNull(formData, 'notas'),
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/')
}

export async function addStudyQuestClient(formData: FormData) {
  const supabase = await createClient()

  const fechaAlta = formData.get('fecha_alta') as string
  const addMonths = (dateStr: string, months: number) => {
    const d = new Date(dateStr)
    d.setMonth(d.getMonth() + months)
    return d.toISOString().slice(0, 10)
  }

  const { error } = await supabase.from('studyquest_clients').insert({
    fecha_alta: fechaAlta,
    cliente: formData.get('cliente') as string,
    pilar: strOrNull(formData, 'pilar'),
    grupo: strOrNull(formData, 'grupo'),
    xp: intOrZero(formData, 'xp'),
    notas: strOrNull(formData, 'notas'),
    toca_3m: addMonths(fechaAlta, 3),
    toca_6m: addMonths(fechaAlta, 6),
    toca_9m: addMonths(fechaAlta, 9),
    sort_order: Date.now(),
  })

  if (error) throw new Error(error.message)
  revalidatePath('/')
}
