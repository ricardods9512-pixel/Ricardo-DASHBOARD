import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getOAuthClient } from '@/lib/google-drive'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error')

  if (errorParam || !code) {
    return NextResponse.redirect(`${origin}/escuela?drive=error`)
  }

  const oauth2Client = getOAuthClient()
  if (!oauth2Client) {
    return NextResponse.redirect(`${origin}/escuela?drive=error`)
  }

  try {
    const { tokens } = await oauth2Client.getToken(code)
    if (!tokens.refresh_token) {
      return NextResponse.redirect(`${origin}/escuela?drive=no_refresh_token`)
    }

    oauth2Client.setCredentials(tokens)
    const drive = google.drive({ version: 'v3', auth: oauth2Client })
    const about = await drive.about.get({ fields: 'user' })
    const connectedEmail = about.data.user?.emailAddress ?? null

    const supabase = await createClient()
    const { error } = await supabase.from('google_drive_auth').upsert({
      id: 1,
      connected_email: connectedEmail,
      refresh_token: tokens.refresh_token,
      updated_at: new Date().toISOString(),
    })

    if (error) throw new Error(error.message)

    return NextResponse.redirect(`${origin}/escuela?drive=connected`)
  } catch {
    return NextResponse.redirect(`${origin}/escuela?drive=error`)
  }
}
