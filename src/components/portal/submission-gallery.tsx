export type SubmissionWithUrl = {
  id: string
  category: string
  note: string | null
  status: string
  points_awarded: number | null
  created_at: string
  imageUrl: string | null
}

const CATEGORY_LABELS: Record<string, string> = {
  mapa_mental: '🧠 Mapa mental',
  simulacro: '📝 Simulacro',
  matematicas: '🔢 Matemáticas',
  indice_temas: '📑 Índice de temas',
}

const dateFormatter = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' })

export function SubmissionGallery({ submissions }: { submissions: SubmissionWithUrl[] }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="text-sm font-semibold">🗂️ Tus envíos</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {submissions.map((s) => (
          <div key={s.id} className="overflow-hidden rounded-xl border border-[var(--border)]">
            {s.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.imageUrl} alt={s.category} className="h-28 w-full object-cover" />
            )}
            <div className="p-2">
              <p className="text-[10px] font-semibold">{CATEGORY_LABELS[s.category] ?? s.category}</p>
              <p className="text-[10px] text-[var(--foreground-muted)]">{dateFormatter.format(new Date(s.created_at))}</p>
              <p
                className="mt-1 text-[10px] font-semibold"
                style={{ color: s.status === 'revisado' ? 'var(--status-good)' : 'var(--status-warning)' }}
              >
                {s.status === 'revisado' ? `✅ +${s.points_awarded} pts` : '⏳ Pendiente de revisión'}
              </p>
            </div>
          </div>
        ))}
        {submissions.length === 0 && (
          <p className="col-span-full text-sm text-[var(--foreground-muted)]">Todavía no subiste ninguna foto.</p>
        )}
      </div>
    </section>
  )
}
