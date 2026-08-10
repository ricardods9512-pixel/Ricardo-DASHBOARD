'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addCommunication(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('communications').insert({
    student_id: (formData.get('student_id') as string) || null,
    channel: (formData.get('channel') as string) || 'whatsapp',
    direction: (formData.get('direction') as string) || 'enviado',
    subject: (formData.get('subject') as string) || null,
    message: formData.get('message') as string,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/comunicaciones')
}

export async function updateCommunicationStatus(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('communication_id') as string
  const status = formData.get('status') as string

  const { error } = await supabase.from('communications').update({ status }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/comunicaciones')
}
