'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function levelForPoints(points: number) {
  return Math.floor(points / 200) + 1
}

export async function addStudent(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('school_students').insert({
    name: formData.get('name') as string,
    email: (formData.get('email') as string) || null,
    phone: (formData.get('phone') as string) || null,
    username: (formData.get('username') as string) || null,
    country: (formData.get('country') as string) || null,
    source: (formData.get('source') as string) || 'organico',
  })

  if (error) throw new Error(error.message)
  revalidatePath('/escuela')
}

export async function updateMemberProfile(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('student_id') as string

  const { error } = await supabase
    .from('school_students')
    .update({
      username: (formData.get('username') as string) || null,
      country: (formData.get('country') as string) || null,
      bio: (formData.get('bio') as string) || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/escuela')
}

export async function addPost(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('community_posts').insert({
    title: formData.get('title') as string,
    body: (formData.get('body') as string) || null,
    category: (formData.get('category') as string) || 'General discussion',
  })

  if (error) throw new Error(error.message)
  revalidatePath('/escuela')
}

export async function updateModuleProgress(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('module_id') as string
  const progress = Number(formData.get('progress_pct'))

  const { error } = await supabase
    .from('community_modules')
    .update({ progress_pct: Math.max(0, Math.min(100, progress)) })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/escuela')
}

export async function addSession(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('community_sessions').insert({
    session_date: formData.get('session_date') as string,
    session_time: (formData.get('session_time') as string) || '18:00',
    title: (formData.get('title') as string) || 'Sesión en vivo',
    meet_link: (formData.get('meet_link') as string) || null,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/escuela')
}

export async function deleteSession(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('session_id') as string

  const { error } = await supabase.from('community_sessions').delete().eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/escuela')
}

export async function awardPoints(formData: FormData) {
  const supabase = await createClient()

  const studentId = formData.get('student_id') as string
  const points = Number(formData.get('points'))
  const category = (formData.get('category') as string) || 'otro'

  const { error: logError } = await supabase.from('points_log').insert({
    student_id: studentId,
    points,
    category,
  })
  if (logError) throw new Error(logError.message)

  const { data: student, error: fetchError } = await supabase
    .from('school_students')
    .select('points')
    .eq('id', studentId)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const newPoints = (student?.points ?? 0) + points

  const { error } = await supabase
    .from('school_students')
    .update({ points: newPoints, level: levelForPoints(newPoints) })
    .eq('id', studentId)

  if (error) throw new Error(error.message)
  revalidatePath('/escuela')
}
