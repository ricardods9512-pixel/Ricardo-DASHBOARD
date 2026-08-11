import { google } from 'googleapis'
import { createClient } from '@/lib/supabase/server'

const ONLINE_ESCUELA_FOLDER_ID = '1Z3ON2EOuGmm1_TongJYQSZDxtaxQt3kD'

const TEMPLATES = [
  { id: '1v8xfbWmSuc0AY63PCbSvMjlXWFZ1HfWA', label: 'Contrato de servicio' },
  { id: '1cc9yWPCnJQgy_jPRUuc5Ca28slMwPs_E', label: 'Cuestionario diagnóstico inicial' },
  { id: '1w0BCiHDPXi8aaUptYnFzh1_JZobFX4FQr2hYFdQ7ZXo', label: 'Plan de acción' },
  { id: '1jGbM_qZyf3c2sEhwGW4McP4_h8ojkGdq', label: 'Notas por trimestre' },
]

export function getOAuthClient() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI
  if (!clientId || !clientSecret || !redirectUri) return null
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

export async function getDriveConnection() {
  const supabase = await createClient()
  const { data } = await supabase.from('google_drive_auth').select('*').eq('id', 1).maybeSingle()
  return data as { connected_email: string | null; refresh_token: string | null } | null
}

async function getDriveClient() {
  const oauth2Client = getOAuthClient()
  if (!oauth2Client) return null

  const connection = await getDriveConnection()
  if (!connection?.refresh_token) return null

  oauth2Client.setCredentials({ refresh_token: connection.refresh_token })
  return google.drive({ version: 'v3', auth: oauth2Client })
}

export async function createStudentDriveKit(studentName: string): Promise<string | null> {
  const drive = await getDriveClient()
  if (!drive) return null

  const folder = await drive.files.create({
    requestBody: {
      name: `ONLINE ${studentName.toUpperCase()}`,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [ONLINE_ESCUELA_FOLDER_ID],
    },
    fields: 'id',
  })

  const folderId = folder.data.id
  if (!folderId) return null

  await Promise.all(
    TEMPLATES.map((template) =>
      drive.files.copy({
        fileId: template.id,
        requestBody: {
          name: `${template.label} - ${studentName}`,
          parents: [folderId],
        },
      }),
    ),
  )

  return `https://drive.google.com/drive/folders/${folderId}`
}
