import { uploadSubmission } from '@/app/portal/actions'

const CATEGORIES = [
  { value: 'mapa_mental', label: '🧠 Mapa mental' },
  { value: 'simulacro', label: '📝 Simulacro de examen' },
  { value: 'matematicas', label: '🔢 Matemáticas' },
  { value: 'indice_temas', label: '📑 Índice de temas' },
]

export function SubmissionForm() {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="text-sm font-semibold">📸 Subí una foto y sumá puntos</h2>
      <p className="mt-1 text-xs text-[var(--foreground-muted)]">
        Tu profesor la revisa y te suma los puntos correspondientes.
      </p>
      <form action={uploadSubmission} className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Categoría
          <select
            name="category"
            required
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Foto
          <input
            name="image"
            type="file"
            accept="image/*"
            required
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--series-1)] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Comentario (opcional)
          <input
            name="note"
            type="text"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
          />
        </label>
        <button type="submit" className="rounded-lg bg-[var(--series-1)] px-4 py-2 text-sm font-semibold text-white">
          Subir
        </button>
      </form>
    </section>
  )
}
