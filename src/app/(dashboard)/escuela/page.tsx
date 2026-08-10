import { createClient } from '@/lib/supabase/server'
import {
  addStudent,
  addCourse,
  enrollStudent,
  updateEnrollmentProgress,
  addGoal,
  updateGoalStatus,
  awardPoints,
  awardBadge,
} from './actions'

const dateFormatter = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short' })

export default async function EscuelaPage() {
  const supabase = await createClient()

  const [
    { data: students },
    { data: courses },
    { data: enrollments },
    { data: goals },
    { data: badges },
    { data: studentBadges },
  ] = await Promise.all([
    supabase.from('school_students').select('*').order('points', { ascending: false }),
    supabase.from('courses').select('*').order('created_at', { ascending: false }),
    supabase
      .from('enrollments')
      .select('*, school_students(name), courses(name)')
      .order('enrolled_at', { ascending: false }),
    supabase
      .from('student_goals')
      .select('*, school_students(name)')
      .order('created_at', { ascending: false }),
    supabase.from('badges').select('*').order('points_required', { ascending: true }),
    supabase.from('student_badges').select('student_id, badges(icon, name)'),
  ])

  const badgesByStudent = new Map<string, { icon: string | null; name: string }[]>()
  for (const row of studentBadges ?? []) {
    const list = badgesByStudent.get(row.student_id) ?? []
    const badge = row.badges as unknown as { icon: string | null; name: string } | null
    if (badge) list.push(badge)
    badgesByStudent.set(row.student_id, list)
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Escuela online</h1>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Alumnos, cursos, objetivos y gamificación
        </p>
      </div>

      {/* Leaderboard */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-base font-semibold">🏆 Ranking de alumnos</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-[var(--foreground-muted)]">
                <th className="pb-2 pr-4">#</th>
                <th className="pb-2 pr-4">Alumno</th>
                <th className="pb-2 pr-4">Nivel</th>
                <th className="pb-2 pr-4">Puntos</th>
                <th className="pb-2 pr-4">Racha</th>
                <th className="pb-2 pr-4">Insignias</th>
                <th className="pb-2">Sumar puntos</th>
              </tr>
            </thead>
            <tbody>
              {(students ?? []).map((s, i) => (
                <tr key={s.id} className="border-t border-[var(--border)]">
                  <td className="py-2 pr-4 tabular-nums text-[var(--foreground-muted)]">{i + 1}</td>
                  <td className="py-2 pr-4 font-medium">{s.name}</td>
                  <td className="py-2 pr-4 tabular-nums">Nv. {s.level ?? 1}</td>
                  <td className="py-2 pr-4 tabular-nums">{s.points ?? 0}</td>
                  <td className="py-2 pr-4 tabular-nums">{s.streak_days ?? 0} días</td>
                  <td className="py-2 pr-4">
                    <span className="text-base">
                      {(badgesByStudent.get(s.id) ?? []).map((b) => b.icon).join(' ') || '—'}
                    </span>
                  </td>
                  <td className="py-2">
                    <form action={awardPoints} className="flex items-center gap-2">
                      <input type="hidden" name="student_id" value={s.id} />
                      <input
                        type="number"
                        name="points"
                        defaultValue={10}
                        className="w-16 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-[var(--series-1)] px-2.5 py-1 text-xs font-semibold text-white"
                      >
                        +
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!students || students.length === 0) && (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-[var(--foreground-muted)]">
                    Todavía no hay alumnos cargados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {badges && badges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
            {badges.map((b) => (
              <span
                key={b.id}
                title={b.description ?? ''}
                className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--foreground-secondary)]"
              >
                {b.icon} {b.name} · {b.points_required}p
              </span>
            ))}
          </div>
        )}

        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold">
            + Otorgar insignia manualmente
          </summary>
          <form action={awardBadge} className="mt-3 flex flex-wrap items-end gap-3">
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
              Insignia
              <select
                name="badge_id"
                required
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
              >
                {(badges ?? []).map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.icon} {b.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="rounded-lg bg-[var(--series-1)] px-4 py-2 text-sm font-semibold text-white"
            >
              Otorgar
            </button>
          </form>
        </details>
      </section>

      {/* Cursos */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-base font-semibold">Cursos</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(courses ?? []).map((c) => (
            <div key={c.id} className="rounded-xl border border-[var(--border)] p-4">
              <p className="font-medium">{c.name}</p>
              {c.description && (
                <p className="mt-1 text-xs text-[var(--foreground-secondary)]">{c.description}</p>
              )}
              <p className="mt-2 text-sm tabular-nums text-[var(--foreground-muted)]">
                ${c.price ?? 0}
              </p>
            </div>
          ))}
          {(!courses || courses.length === 0) && (
            <p className="text-sm text-[var(--foreground-muted)]">Todavía no hay cursos cargados.</p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <details className="rounded-xl border border-[var(--border)] p-4">
            <summary className="cursor-pointer text-sm font-semibold">+ Agregar curso</summary>
            <form action={addCourse} className="mt-3 flex flex-col gap-3">
              <TextField label="Nombre" name="name" required />
              <TextField label="Descripción" name="description" />
              <TextField label="Precio" name="price" type="number" step="0.01" />
              <SubmitButton label="Guardar curso" />
            </form>
          </details>

          <details className="rounded-xl border border-[var(--border)] p-4">
            <summary className="cursor-pointer text-sm font-semibold">+ Inscribir alumno</summary>
            <form action={enrollStudent} className="mt-3 flex flex-col gap-3">
              <SelectField label="Alumno" name="student_id" options={(students ?? []).map((s) => ({ value: s.id, label: s.name }))} />
              <SelectField label="Curso" name="course_id" options={(courses ?? []).map((c) => ({ value: c.id, label: c.name }))} />
              <SubmitButton label="Inscribir" />
            </form>
          </details>
        </div>
      </section>

      {/* Inscripciones / progreso */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-base font-semibold">Progreso en cursos</h2>
        <div className="mt-4 flex flex-col gap-3">
          {(enrollments ?? []).map((e) => {
            const student = e.school_students as unknown as { name: string } | null
            const course = e.courses as unknown as { name: string } | null
            return (
              <div key={e.id} className="flex flex-col gap-2 rounded-xl border border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {student?.name} <span className="text-[var(--foreground-muted)]">→</span> {course?.name}
                  </p>
                  <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-[var(--border)]">
                    <div
                      className="h-full rounded-full bg-[var(--series-1)]"
                      style={{ width: `${e.progress_pct ?? 0}%` }}
                    />
                  </div>
                </div>
                <form action={updateEnrollmentProgress} className="flex items-center gap-2">
                  <input type="hidden" name="enrollment_id" value={e.id} />
                  <input
                    type="number"
                    name="progress_pct"
                    min={0}
                    max={100}
                    defaultValue={e.progress_pct ?? 0}
                    className="w-20 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs"
                  />
                  <button
                    type="submit"
                    className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold"
                  >
                    Actualizar
                  </button>
                </form>
              </div>
            )
          })}
          {(!enrollments || enrollments.length === 0) && (
            <p className="text-sm text-[var(--foreground-muted)]">Todavía no hay inscripciones.</p>
          )}
        </div>
      </section>

      {/* Objetivos */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-base font-semibold">Objetivos de alumnos</h2>
        <div className="mt-4 flex flex-col gap-3">
          {(goals ?? []).map((g) => {
            const student = g.school_students as unknown as { name: string } | null
            return (
              <div key={g.id} className="flex flex-col gap-2 rounded-xl border border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">{g.title}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {student?.name} {g.category ? `· ${g.category}` : ''}
                    {g.target_date ? ` · vence ${dateFormatter.format(new Date(g.target_date))}` : ''}
                  </p>
                </div>
                <form action={updateGoalStatus} className="flex items-center gap-2">
                  <input type="hidden" name="goal_id" value={g.id} />
                  <select
                    name="status"
                    defaultValue={g.status ?? 'pendiente'}
                    className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-xs"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_progreso">En progreso</option>
                    <option value="completado">Completado</option>
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
          {(!goals || goals.length === 0) && (
            <p className="text-sm text-[var(--foreground-muted)]">Todavía no hay objetivos cargados.</p>
          )}
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold">+ Agregar objetivo</summary>
          <form action={addGoal} className="mt-3 grid grid-cols-2 gap-3">
            <SelectField label="Alumno" name="student_id" options={(students ?? []).map((s) => ({ value: s.id, label: s.name }))} />
            <TextField label="Categoría" name="category" />
            <div className="col-span-2">
              <TextField label="Título del objetivo" name="title" required />
            </div>
            <TextField label="Fecha límite" name="target_date" type="date" />
            <div className="col-span-2">
              <SubmitButton label="Guardar objetivo" />
            </div>
          </form>
        </details>
      </section>

      {/* Agregar alumno */}
      <details className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <summary className="cursor-pointer text-sm font-semibold">+ Agregar alumno</summary>
        <form action={addStudent} className="mt-3 grid grid-cols-2 gap-3">
          <TextField label="Nombre" name="name" required />
          <TextField label="Email" name="email" type="email" />
          <TextField label="Teléfono" name="phone" />
          <SelectField
            label="Fuente"
            name="source"
            options={[
              { value: 'organico', label: 'Orgánico' },
              { value: 'referido', label: 'Referido' },
              { value: 'ads', label: 'Ads' },
              { value: 'discord', label: 'Discord' },
            ]}
          />
          <div className="col-span-2">
            <SubmitButton label="Guardar alumno" />
          </div>
        </form>
      </details>
    </div>
  )
}

function TextField({
  label,
  name,
  type = 'text',
  step,
  required,
}: {
  label: string
  name: string
  type?: string
  step?: string
  required?: boolean
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
      {label}
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
      />
    </label>
  )
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string
  name: string
  options: { value: string; label: string }[]
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
      {label}
      <select
        name={name}
        required
        className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="rounded-lg bg-[var(--series-1)] px-4 py-2 text-sm font-semibold text-white"
    >
      {label}
    </button>
  )
}
