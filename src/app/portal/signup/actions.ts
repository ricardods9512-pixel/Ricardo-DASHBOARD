'use server'

import { createClient } from '@/lib/supabase/server'

export async function signupStudent(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: isRegistered, error: checkError } = await supabase.rpc('email_is_registered_student', {
    p_email: email,
  })

  if (checkError) {
    return { error: 'No se pudo verificar el email. Probá de nuevo.' }
  }

  if (!isRegistered) {
    return {
      error: 'Tu profesor todavía no te agregó como alumno con este email. Pedile que te sume primero.',
    }
  }

  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
