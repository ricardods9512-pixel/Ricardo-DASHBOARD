import { postMessage } from '@/app/(dashboard)/comunicaciones/actions'

export type CommMessage = {
  id: string
  author_name: string
  is_owner: boolean
  body: string
  created_at: string
}

const dateFormatter = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
const timeFormatter = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' })

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function ChannelMessages({
  channelId,
  channelName,
  channelIcon,
  messages,
}: {
  channelId: string
  channelName: string
  channelIcon: string
  messages: CommMessage[]
}) {
  const dayDividers = new Set<string>()
  let previousDay = ''
  for (const m of messages) {
    const day = dateFormatter.format(new Date(m.created_at))
    if (day !== previousDay) dayDividers.add(m.id)
    previousDay = day
  }

  return (
    <div className="flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-5 py-3">
        <span className="text-[var(--foreground-muted)]">{channelIcon}</span>
        <h2 className="text-sm font-semibold">{channelName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 && (
          <p className="text-sm text-[var(--foreground-muted)]">
            Todavía no hay mensajes en este canal. Escribí el primero abajo.
          </p>
        )}
        {messages.map((m) => {
          const showDivider = dayDividers.has(m.id)
          return (
            <div key={m.id}>
              {showDivider && (
                <div className="my-3 flex items-center gap-3 text-[10px] text-[var(--foreground-muted)]">
                  <div className="h-px flex-1 bg-[var(--border)]" />
                  {dateFormatter.format(new Date(m.created_at))}
                  <div className="h-px flex-1 bg-[var(--border)]" />
                </div>
              )}
              <div className="mt-3 flex items-start gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: m.is_owner ? 'var(--series-1)' : '#6b7280' }}
                >
                  {initials(m.author_name)}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {m.author_name}{' '}
                    <span className="ml-1 text-[10px] font-normal text-[var(--foreground-muted)]">
                      {timeFormatter.format(new Date(m.created_at))}
                    </span>
                  </p>
                  <p className="whitespace-pre-wrap text-sm text-[var(--foreground-secondary)]">{m.body}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <form action={postMessage} className="flex items-center gap-2 border-t border-[var(--border)] p-3">
        <input type="hidden" name="channel_id" value={channelId} />
        <input
          name="body"
          placeholder={`Mensaje #${channelName}`}
          required
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--series-1)]"
        />
        <button type="submit" className="rounded-lg bg-[var(--series-1)] px-4 py-2 text-sm font-semibold text-white">
          Enviar
        </button>
      </form>
    </div>
  )
}
