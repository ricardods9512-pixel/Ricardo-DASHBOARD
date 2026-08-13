import { reviewSubmission } from '@/app/(dashboard)/escuela/actions'

export type SubmissionForReview = {
  id: string
  student_id: string
  student_name: string
  category: string
  note: string | null
  status: string
  points_awarded: number | null
  created_at: string
  imageUrl: string | null
}

const CATEGORY_LABELS: Record<string, { label: string; defaultPoints: number }> = {
  mapa_mental: { label: '🧠 Mapa mental', defaultPoints: 15 },
  simulacro: { label: '📝 Simulacro de examen', defaultPoints: 20 },
  matematicas: { label: '🔢 Matemáticas', defaultPoints: 15 },
  indice_temas: { label: '📑 Índice de temas', defaultPoints: 10 },
}

const dateFormatter = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

export function GameReview({ submissions }: { submissions: SubmissionForReview[] }) {
  const pending = submissions.filter((s) => s.status === 'pendiente')
  const reviewed = submissions.filter((s) => s.status === 'revisado')

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-semibold">📥 Pendientes de revisión ({pending.length})</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pending.map((s) => {
            const meta = CATEGORY_LABELS[s.category]
            const formId = `review-${s.id}`
            return (
              <div key={s.id} className="overflow-hidden rounded-xl border border-[var(--border)]">
                {s.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.imageUrl} alt={s.category} className="h-40 w-full object-cover" />
                )}
                <div className="p-3">
                  <p className="text-sm font-semibold">{s.student_name}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {meta?.label ?? s.category} · {dateFormatter.format(new Date(s.created_at))}
                  </p>
                  {s.note && <p className="mt-1 text-xs text-[var(--foreground-secondary)]">“{s.note}”</p>}

                  <form action={reviewSubmission} id={formId} className="mt-2 flex items-center gap-2">
                    <input type="hidden" name="submission_id" value={s.id} />
                    <input type="hidden" name="student_id" value={s.student_id} />
                    <input type="hidden" name="category" value={s.category} />
                    <input
                      name="points"
                      type="number"
                      defaultValue={meta?.defaultPoints ?? 10}
                      className="w-16 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-[var(--series-1)] px-2.5 py-1 text-xs font-semibold text-white"
                    >
                      Confirmar puntos
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
          {pending.length === 0 && (
            <p className="col-span-full text-sm text-[var(--foreground-muted)]">No hay envíos pendientes.</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-semibold">✅ Ya revisados ({reviewed.length})</h2>
        <div className="mt-4 flex flex-col gap-2">
          {reviewed.slice(0, 20).map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
            >
              <span>
                {s.student_name} · {CATEGORY_LABELS[s.category]?.label ?? s.category}
              </span>
              <span className="font-semibold text-[var(--status-good)]">+{s.points_awarded} pts</span>
            </div>
          ))}
          {reviewed.length === 0 && (
            <p className="text-sm text-[var(--foreground-muted)]">Todavía no revisaste ningún envío.</p>
          )}
        </div>
      </section>
    </div>
  )
}
