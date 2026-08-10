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
    source: (formData.get('source') as string) || 'organico',
  })

  if (error) throw new Error(error.message)
  revalidatePath('/escuela')
}

export async function addCourse(formData: FormData) {
  const supabase = await createClient()

  const priceRaw = formData.get('price')
  const { error } = await supabase.from('courses').insert({
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    price: priceRaw ? Number(priceRaw) : 0,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/escuela')
}

export async function enrollStudent(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('enrollments').insert({
    student_id: formData.get('student_id') as string,
    course_id: formData.get('course_id') as string,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/escuela')
}

export async function updateEnrollmentProgress(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('enrollment_id') as string
  const progress = Number(formData.get('progress_pct'))
  const status = progress >= 100 ? 'completado' : 'en_progreso'

  const { error } = await supabase
    .from('enrollments')
    .update({
      progress_pct: progress,
      status,
      completed_at: progress >= 100 ? new Date().toISOString().slice(0, 10) : null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/escuela')
}

export async function addGoal(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('student_goals').insert({
    student_id: formData.get('student_id') as string,
    title: formData.get('title') as string,
    category: (formData.get('category') as string) || null,
    target_date: (formData.get('target_date') as string) || null,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/escuela')
}

export async function updateGoalStatus(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('goal_id') as string
  const status = formData.get('status') as string

  const { error } = await supabase
    .from('student_goals')
    .update({
      status,
      progress_pct: status === 'completado' ? 100 : undefined,
      completed_date: status === 'completado' ? new Date().toISOString().slice(0, 10) : null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/escuela')
}

export async function awardPoints(formData: FormData) {
  const supabase = await createClient()

  const studentId = formData.get('student_id') as string
  const points = Number(formData.get('points'))

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

export async function awardBadge(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('student_badges').insert({
    student_id: formData.get('student_id') as string,
    badge_id: formData.get('badge_id') as string,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/escuela')
}
