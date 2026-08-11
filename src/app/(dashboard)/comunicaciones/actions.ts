'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function postMessage(formData: FormData) {
  const supabase = await createClient()

  const channelId = formData.get('channel_id') as string
  const body = formData.get('body') as string
  if (!body?.trim()) return

  const { error } = await supabase.from('comm_messages').insert({
    channel_id: channelId,
    body,
    author_name: 'Ricardo Coaching Educativo',
    is_owner: true,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/comunicaciones')
}

export async function ensureStudentDmChannels() {
  const supabase = await createClient()

  const { data: activeStudents, error: studentsError } = await supabase
    .from('school_students')
    .select('id, name')
    .eq('status', 'activo')

  if (studentsError) throw new Error(studentsError.message)
  if (!activeStudents || activeStudents.length === 0) return

  const { data: existingDms, error: dmError } = await supabase
    .from('comm_channels')
    .select('student_id')
    .eq('kind', 'dm')

  if (dmError) throw new Error(dmError.message)

  const existingIds = new Set((existingDms ?? []).map((d) => d.student_id))
  const missing = activeStudents.filter((s) => !existingIds.has(s.id))
  if (missing.length === 0) return

  const rows = missing.map((s) => ({
    slug: `dm-${s.id}`,
    name: s.name,
    icon: '💬',
    kind: 'dm',
    color: '#5865F2',
    sort_order: 100,
    student_id: s.id,
  }))

  const { error: insertError } = await supabase.from('comm_channels').insert(rows)
  if (insertError) throw new Error(insertError.message)
}
