import Link from 'next/link'

export type SidebarChannel = {
  id: string
  slug: string
  name: string
  icon: string
  kind: string
}

function ChannelLink({ channel, active }: { channel: SidebarChannel; active: boolean }) {
  return (
    <Link
      href={`/comunicaciones?channel=${channel.slug}`}
      className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm ${
        active ? 'bg-[var(--series-1)]/15 font-semibold text-[var(--series-1)]' : 'text-[var(--foreground-secondary)] hover:bg-[var(--border)]/50'
      }`}
    >
      <span className="w-4 shrink-0 text-center text-xs opacity-70">{channel.icon}</span>
      <span className="truncate">{channel.name}</span>
    </Link>
  )
}

export function ChannelSidebar({
  canales,
  privados,
  individuales,
  dms,
  activeSlug,
}: {
  canales: SidebarChannel[]
  privados: SidebarChannel[]
  individuales: SidebarChannel[]
  dms: SidebarChannel[]
  activeSlug: string
}) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:w-64">
      <div>
        <p className="px-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
          Canales de texto
        </p>
        <div className="mt-1 flex flex-col gap-0.5">
          {canales.map((c) => (
            <ChannelLink key={c.id} channel={c} active={c.slug === activeSlug} />
          ))}
        </div>
      </div>

      {privados.length > 0 && (
        <div>
          <p className="px-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
            Privado
          </p>
          <div className="mt-1 flex flex-col gap-0.5">
            {privados.map((c) => (
              <ChannelLink key={c.id} channel={c} active={c.slug === activeSlug} />
            ))}
          </div>
        </div>
      )}

      {individuales.length > 0 && (
        <div>
          <p className="px-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
            Canales de trabajo individual
          </p>
          <div className="mt-1 flex max-h-64 flex-col gap-0.5 overflow-y-auto">
            {individuales.map((c) => (
              <ChannelLink key={c.id} channel={c} active={c.slug === activeSlug} />
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="px-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
          Mensajes directos ({dms.length})
        </p>
        <div className="mt-1 flex max-h-64 flex-col gap-0.5 overflow-y-auto">
          {dms.map((c) => (
            <ChannelLink key={c.id} channel={c} active={c.slug === activeSlug} />
          ))}
          {dms.length === 0 && (
            <p className="px-2 py-1 text-xs text-[var(--foreground-muted)]">
              Se crean automáticamente para cada alumno activo.
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}
