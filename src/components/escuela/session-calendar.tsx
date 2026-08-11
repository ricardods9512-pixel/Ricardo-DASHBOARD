import { addSession, deleteSession } from '@/app/(dashboard)/escuela/actions'

export type CommunitySession = {
  id: string
  session_date: string
  session_time: string | null
  title: string
  meet_link: string | null
  notes: string | null
}

const WEEKDAYS = ['lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.', 'dom.']
const MONTH_NAME = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })
const dateFormatter = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: '2-digit', month: 'short' })

function buildMonthGrid(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1)
  const startOffset = (first.getDay() + 6) % 7 // lunes = 0
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const cells: (number | null)[] = Array(startOffset).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function SessionCalendar({ sessions }: { sessions: CommunitySession[] }) {
  const now = new Date()
  const cells = buildMonthGrid(now.getFullYear(), now.getMonth())
  const sessionsByDay = new Map<number, CommunitySession[]>()
  for (const s of sessions) {
    const d = new Date(s.session_date)
    if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
      const list = sessionsByDay.get(d.getDate()) ?? []
      list.push(s)
      sessionsByDay.set(d.getDate(), list)
    }
  }

  const upcoming = sessions
    .filter((s) => s.session_date >= now.toISOString().slice(0, 10))
    .sort((a, b) => (a.session_date < b.session_date ? -1 : 1))

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
          <h3 className="text-sm font-semibold capitalize">{MONTH_NAME.format(now)}</h3>
        </div>
        <div className="grid grid-cols-7 text-center text-xs">
          {WEEKDAYS.map((w) => (
            <div key={w} className="border-b border-[var(--border)] py-2 font-medium text-[var(--foreground-muted)]">
              {w}
            </div>
          ))}
          {cells.map((day, i) => {
            const daySessions = day ? sessionsByDay.get(day) ?? [] : []
            const isToday = day === now.getDate()
            return (
              <div
                key={i}
                className="min-h-[70px] border-b border-r border-[var(--border)] p-1.5 text-left align-top last:border-r-0"
              >
                {day && (
                  <>
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                        isToday ? 'bg-[var(--status-critical)] text-white' : 'text-[var(--foreground-secondary)]'
                      }`}
                    >
                      {day}
                    </span>
                    {daySessions.map((s) => (
                      <p key={s.id} className="mt-1 truncate rounded bg-[var(--series-1)]/15 px-1 py-0.5 text-[10px] font-medium text-[var(--series-1)]">
                        📅 {s.session_time ?? ''} {s.title}
                      </p>
                    ))}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h3 className="text-sm font-semibold">Próximas sesiones</h3>
        <div className="mt-3 flex flex-col gap-2">
          {upcoming.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-2 rounded-xl border border-[var(--border)] p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium capitalize">
                  {dateFormatter.format(new Date(s.session_date))} · {s.session_time}
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">{s.title}</p>
              </div>
              <div className="flex items-center gap-2">
                {s.meet_link && (
                  <a
                    href={s.meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-[var(--series-1)] px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    🔗 Google Meet
                  </a>
                )}
                <form action={deleteSession}>
                  <input type="hidden" name="session_id" value={s.id} />
                  <button type="submit" className="rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
          {upcoming.length === 0 && (
            <p className="text-sm text-[var(--foreground-muted)]">No hay sesiones próximas cargadas.</p>
          )}
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold">+ Agregar sesión</summary>
          <form action={addSession} className="mt-3 grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
              Fecha (martes)
              <input
                name="session_date"
                type="date"
                required
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
              Hora
              <input
                name="session_time"
                type="time"
                defaultValue="18:00"
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
              />
            </label>
            <label className="col-span-2 flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
              Título
              <input
                name="title"
                type="text"
                defaultValue="Sesión en vivo"
                required
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
              />
            </label>
            <label className="col-span-2 flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
              Link de Google Meet
              <input
                name="meet_link"
                type="url"
                placeholder="https://meet.google.com/..."
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
              />
            </label>
            <div className="col-span-2">
              <button type="submit" className="rounded-lg bg-[var(--series-1)] px-4 py-2 text-sm font-semibold text-white">
                Guardar sesión
              </button>
            </div>
          </form>
        </details>
      </div>
    </div>
  )
}
