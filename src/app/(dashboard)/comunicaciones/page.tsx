import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { addCommunication, updateCommunicationStatus } from './actions'

const dateTimeFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

const channelIcon: Record<string, string> = {
  whatsapp: '📱',
  email: '✉️',
  discord: '🎮',
  llamada: '📞',
  otro: '💬',
}

export default async function ComunicacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ student?: string }>
}) {
  const { student: studentFilter } = await searchParams
  const supabase = await createClient()

  const { data: students } = await supabase.from('school_students').select('id, name').order('name')

  let query = supabase
    .from('communications')
    .select('*, school_students(name)')
    .order('occurred_at', { ascending: false })
    .limit(100)

  if (studentFilter) {
    query = query.eq('student_id', studentFilter)
  }

  const { data: communications } = await query

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Comunicaciones</h1>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Historial de contacto con tus alumnos
        </p>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-base font-semibold">Registrar comunicación</h2>
        <form action={addCommunication} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
            Alumno
            <select
              name="student_id"
              required
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
            >
              {(students ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
            Canal
            <select
              name="channel"
              defaultValue="whatsapp"
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="discord">Discord</option>
              <option value="llamada">Llamada</option>
              <option value="otro">Otro</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
            Dirección
            <select
              name="direction"
              defaultValue="enviado"
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
            >
              <option value="enviado">Enviado por mí</option>
              <option value="recibido">Recibido del alumno</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
            Asunto
            <input
              name="subject"
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
            />
          </label>
          <label className="col-span-full flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
            Mensaje
            <textarea
              name="message"
              required
              rows={3}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
            />
          </label>
          <div className="col-span-full">
            <button
              type="submit"
              className="rounded-lg bg-[var(--series-1)] px-4 py-2 text-sm font-semibold text-white"
            >
              Guardar
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Historial</h2>
          <div className="flex flex-wrap gap-2">
            <FilterLink label="Todos" active={!studentFilter} href="/comunicaciones" />
            {(students ?? []).map((s) => (
              <FilterLink
                key={s.id}
                label={s.name}
                active={studentFilter === s.id}
                href={`/comunicaciones?student=${s.id}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {(communications ?? []).map((c) => {
            const student = c.school_students as unknown as { name: string } | null
            return (
              <div
                key={c.id}
                className="flex flex-col gap-2 rounded-xl border border-[var(--border)] p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">
                    <span aria-hidden>{channelIcon[c.channel ?? 'otro'] ?? '💬'}</span>{' '}
                    {student?.name ?? 'Alumno'}
                    {c.subject ? ` · ${c.subject}` : ''}
                  </p>
                  <p className="mt-1 text-sm text-[var(--foreground-secondary)]">{c.message}</p>
                  <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                    {c.direction === 'recibido' ? 'Recibido' : 'Enviado'} ·{' '}
                    {c.occurred_at ? dateTimeFormatter.format(new Date(c.occurred_at)) : ''}
                  </p>
                </div>
                <form action={updateCommunicationStatus} className="flex items-center gap-2">
                  <input type="hidden" name="communication_id" value={c.id} />
                  <select
                    name="status"
                    defaultValue={c.status ?? 'pendiente'}
                    className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-xs"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="respondido">Respondido</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold"
                  >
                    Guardar
                  </button>
                </form>
              </div>
            )
          })}
          {(!communications || communications.length === 0) && (
            <p className="text-sm text-[var(--foreground-muted)]">
              Todavía no hay comunicaciones registradas.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

function FilterLink({ label, active, href }: { label: string; active: boolean; href: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? 'bg-[var(--series-1)] text-white'
          : 'border border-[var(--border)] text-[var(--foreground-secondary)]'
      }`}
    >
      {label}
    </Link>
  )
}
