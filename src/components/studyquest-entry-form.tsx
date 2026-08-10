import { addStudyQuestClient } from '@/app/(dashboard)/studyquest-actions'

export function StudyQuestEntryForm() {
  return (
    <details className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <summary className="cursor-pointer text-sm font-semibold">+ Agregar nuevo alumno</summary>
      <form action={addStudyQuestClient} className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Fecha de alta
          <input
            name="fecha_alta"
            type="date"
            required
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Cliente
          <input
            name="cliente"
            type="text"
            required
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Pilar
          <select
            name="pilar"
            defaultValue="Pilar 5"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
          >
            <option value="Pilar 1">Pilar 1</option>
            <option value="Pilar 2">Pilar 2</option>
            <option value="Pilar 3">Pilar 3</option>
            <option value="Pilar 4">Pilar 4</option>
            <option value="Pilar 5">Pilar 5</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Grupo
          <input
            name="grupo"
            type="text"
            placeholder="TODO ONLINE (opcional)"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          XP inicial
          <input
            name="xp"
            type="number"
            defaultValue={10}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)] sm:col-span-3">
          Notas
          <input
            name="notas"
            type="text"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <div className="col-span-2 mt-2 sm:col-span-3">
          <button
            type="submit"
            className="rounded-lg bg-[var(--series-1)] px-4 py-2 text-sm font-semibold text-white"
          >
            Guardar
          </button>
        </div>
      </form>
    </details>
  )
}
