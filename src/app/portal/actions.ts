'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function logoutStudent() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/portal/login')
}

async function getOwnStudentId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { data, error } = await supabase
    .from('school_students')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (error || !data) throw new Error('Tu cuenta todavía no está vinculada a ningún alumno.')
  return data.id as string
}

export async function uploadSubmission(formData: FormData) {
  const supabase = await createClient()
  const studentId = await getOwnStudentId(supabase)

  const category = formData.get('category') as string
  const note = (formData.get('note') as string) || null
  const file = formData.get('image') as File

  if (!file || file.size === 0) throw new Error('Elegí una foto para subir.')

  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${studentId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error: uploadError } = await supabase.storage.from('game-submissions').upload(path, file, {
    contentType: file.type,
  })
  if (uploadError) throw new Error(uploadError.message)

  const { error } = await supabase.from('game_submissions').insert({
    student_id: studentId,
    category,
    image_path: path,
    note,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/portal')
}

export async function equipSkin(formData: FormData) {
  const supabase = await createClient()
  const studentId = await getOwnStudentId(supabase)
  const skinId = formData.get('skin_id') as string

  const { error } = await supabase
    .from('student_profile_prefs')
    .upsert({ student_id: studentId, equipped_skin_id: skinId, updated_at: new Date().toISOString() })

  if (error) throw new Error(error.message)
  revalidatePath('/portal')
}
