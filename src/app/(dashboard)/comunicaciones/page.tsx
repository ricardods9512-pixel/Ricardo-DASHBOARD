import { createClient } from '@/lib/supabase/server'
import { ensureStudentDmChannels, ensureStudentCommsSetup } from './actions'
import { ChannelSidebar, type SidebarChannel } from '@/components/comunicaciones/channel-sidebar'
import { ChannelMessages, type CommMessage } from '@/components/comunicaciones/channel-messages'

export default async function ComunicacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ channel?: string }>
}) {
  await ensureStudentDmChannels()
  await ensureStudentCommsSetup()

  const { channel: channelSlug } = await searchParams
  const supabase = await createClient()

  const { data: channels } = await supabase
    .from('comm_channels')
    .select('*')
    .order('kind', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  const allChannels = (channels ?? []) as (SidebarChannel & { kind: string })[]
  const canales = allChannels.filter((c) => c.kind === 'canal')
  const privados = allChannels.filter((c) => c.kind === 'privado')
  const individuales = allChannels.filter((c) => c.kind === 'individual')
  const dms = allChannels.filter((c) => c.kind === 'dm')

  const active =
    allChannels.find((c) => c.slug === channelSlug) ?? canales[0] ?? privados[0] ?? individuales[0] ?? dms[0]

  const { data: messages } = active
    ? await supabase
        .from('comm_messages')
        .select('*')
        .eq('channel_id', active.id)
        .order('created_at', { ascending: true })
        .limit(500)
    : { data: [] }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Comunicaciones</h1>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Servidor de la comunidad — canales, grupo privado y chats individuales con alumnos activos
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <ChannelSidebar
          canales={canales}
          privados={privados}
          individuales={individuales}
          dms={dms}
          activeSlug={active?.slug ?? ''}
        />
        {active ? (
          <div className="flex-1">
            <ChannelMessages
              channelId={active.id}
              channelName={active.name}
              channelIcon={active.icon}
              messages={(messages ?? []) as CommMessage[]}
            />
          </div>
        ) : (
          <p className="text-sm text-[var(--foreground-muted)]">No hay canales todavía.</p>
        )}
      </div>
    </div>
  )
}
