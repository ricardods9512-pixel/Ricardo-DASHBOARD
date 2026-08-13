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

export async function ensureStudentCommsSetup() {
  const supabase = await createClient()

  const { data: activeStudents, error: studentsError } = await supabase
    .from('school_students')
    .select('id, name, welcomed_at')
    .eq('status', 'activo')

  if (studentsError) throw new Error(studentsError.message)
  if (!activeStudents || activeStudents.length === 0) return

  const { data: existingIndividual, error: individualError } = await supabase
    .from('comm_channels')
    .select('student_id')
    .eq('kind', 'individual')

  if (individualError) throw new Error(individualError.message)

  const existingIndividualIds = new Set((existingIndividual ?? []).map((c) => c.student_id))
  const missingChannels = activeStudents.filter((s) => !existingIndividualIds.has(s.id))

  if (missingChannels.length > 0) {
    const rows = missingChannels.map((s) => ({
      slug: `individual-${s.id}`,
      name: s.name,
      icon: '🗂️',
      kind: 'individual',
      color: '#57F287',
      sort_order: 100,
      student_id: s.id,
    }))

    const { error: insertChannelError } = await supabase.from('comm_channels').insert(rows)
    if (insertChannelError) throw new Error(insertChannelError.message)
  }

  const pendingWelcome = activeStudents.filter((s) => !s.welcomed_at)
  if (pendingWelcome.length === 0) return

  const { data: generalChannel } = await supabase
    .from('comm_channels')
    .select('id')
    .eq('slug', 'general-avisos')
    .maybeSingle()

  const { data: victoriasChannel } = await supabase
    .from('comm_channels')
    .select('id')
    .eq('slug', 'logros-victorias-ricardodiazcoaching')
    .maybeSingle()

  for (const student of pendingWelcome) {
    const welcomeRows = []
    if (generalChannel) {
      welcomeRows.push({
        channel_id: generalChannel.id,
        author_name: 'Sistema',
        is_owner: false,
        body: `🎉 ¡${student.name} se unió a la escuela! Dale la bienvenida 👋`,
      })
    }
    if (victoriasChannel) {
      welcomeRows.push({
        channel_id: victoriasChannel.id,
        author_name: 'Sistema',
        is_owner: false,
        body: `🏆 ${student.name} ya es parte de la comunidad. ¡A por las primeras victorias! 💪`,
      })
    }

    if (welcomeRows.length > 0) {
      const { error: msgError } = await supabase.from('comm_messages').insert(welcomeRows)
      if (msgError) throw new Error(msgError.message)
    }

    const { error: updateError } = await supabase
      .from('school_students')
      .update({ welcomed_at: new Date().toISOString() })
      .eq('id', student.id)
    if (updateError) throw new Error(updateError.message)
  }
}
