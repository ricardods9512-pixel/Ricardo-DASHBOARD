import { NextResponse } from 'next/server'
import { getOAuthClient } from '@/lib/google-drive'

export async function GET() {
  const oauth2Client = getOAuthClient()
  if (!oauth2Client) {
    return NextResponse.json(
      { error: 'Faltan las variables de entorno de Google OAuth en el servidor.' },
      { status: 500 },
    )
  }

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/drive'],
  })

  return NextResponse.redirect(url)
}
