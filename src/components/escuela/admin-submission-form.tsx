import { adminUploadSubmission } from '@/app/(dashboard)/escuela/actions'
import { PendingSubmitButton } from './pending-submit-button'

const CATEGORIES = [
  { value: 'mapa_mental', label: '🧠 Mapa mental' },
  { value: 'simulacro', label: '📝 Simulacro de examen' },
  { value: 'matematicas', label: '🔢 Matemáticas' },
  { value: 'indice_temas', label: '📑 Índice de temas' },
]

export function AdminSubmissionForm({ students }: { students: { id: string; name: string }[] }) {
  return (
    <details className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <summary className="cursor-pointer text-sm font-semibold">+ Subir foto por un alumno</summary>
      <p className="mt-3 text-xs text-[var(--foreground-muted)]">
        Usalo si el alumno te manda la foto por WhatsApp u otro medio en vez de subirla él mismo desde su login.
      </p>
      <form action={adminUploadSubmission} className="mt-4 grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Alumno
          <select
            name="student_id"
            required
            defaultValue=""
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
          >
            <option value="" disabled>
              —
            </option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
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
        <label className="col-span-2 flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Foto
          <input
            name="image"
            type="file"
            accept="image/*"
            required
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--series-1)] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
          />
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Comentario (opcional)
          <input
            name="note"
            type="text"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
          />
        </label>
        <div className="col-span-2">
          <PendingSubmitButton label="Subir foto" pendingLabel="Subiendo…" />
        </div>
      </form>
    </details>
  )
}
