import { updateMemberProfile } from '@/app/(dashboard)/escuela/actions'
import { COUNTRY_NAMES } from '@/lib/data/countries'

export type Member = {
  id: string
  name: string
  username: string | null
  email: string | null
  country: string | null
  bio: string | null
  status: string | null
  enrolled_at: string | null
  drive_folder_url: string | null
}

const dateFormatter = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function MemberDirectory({ members }: { members: Member[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-[var(--foreground-muted)]">Activos {members.filter((m) => m.status === 'activo').length}</p>

      {members.map((m) => {
        const formId = `member-${m.id}`
        return (
          <div key={m.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--series-1)] text-sm font-semibold text-white">
                  {initials(m.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">@{m.username ?? m.name.toLowerCase().replace(/\s+/g, '-')}</p>
                  {m.bio && <p className="mt-1 max-w-sm text-xs text-[var(--foreground-secondary)]">{m.bio}</p>}
                </div>
              </div>
              <span
                className="h-fit rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{
                  backgroundColor:
                    m.status === 'activo'
                      ? 'color-mix(in srgb, var(--status-good) 18%, transparent)'
                      : 'color-mix(in srgb, var(--foreground-muted) 18%, transparent)',
                  color: m.status === 'activo' ? 'var(--status-good)' : 'var(--foreground-muted)',
                }}
              >
                {m.status === 'activo' ? '🟢 Activo' : m.status === 'completado' ? '🎓 Completado' : '⚪ Baja'}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-3 text-xs text-[var(--foreground-muted)]">
              {m.enrolled_at && <span>📅 Se unió el {dateFormatter.format(new Date(m.enrolled_at))}</span>}
              {m.email && <span>✉️ {m.email}</span>}
              {m.drive_folder_url && (
                <a
                  href={m.drive_folder_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--series-1)]"
                >
                  📁 Ver carpeta en Drive
                </a>
              )}
            </div>

            <form action={updateMemberProfile} id={formId} className="mt-3 flex flex-wrap items-end gap-2">
              <input type="hidden" name="student_id" value={m.id} />
              <label className="flex flex-col gap-1 text-[10px] font-medium text-[var(--foreground-secondary)]">
                Usuario
                <input
                  name="username"
                  defaultValue={m.username ?? ''}
                  className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[10px] font-medium text-[var(--foreground-secondary)]">
                País (para el mapa)
                <select
                  name="country"
                  defaultValue={m.country ?? ''}
                  className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs"
                >
                  <option value="">—</option>
                  {COUNTRY_NAMES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-1 flex-col gap-1 text-[10px] font-medium text-[var(--foreground-secondary)]">
                Bio
                <input
                  name="bio"
                  defaultValue={m.bio ?? ''}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs"
                />
              </label>
              <button type="submit" className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold">
                Guardar
              </button>
            </form>
          </div>
        )
      })}

      {members.length === 0 && (
        <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm text-[var(--foreground-muted)]">
          Todavía no hay miembros cargados.
        </p>
      )}
    </div>
  )
}
