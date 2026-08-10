import { addAgendaLead } from '@/app/(dashboard)/agenda-actions'

export function AgendaEntryForm() {
  return (
    <details className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <summary className="cursor-pointer text-sm font-semibold">+ Agregar nuevo lead / agenda</summary>
      <form action={addAgendaLead} className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Mes
          <input
            name="month"
            type="month"
            required
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Instagram
          <input
            name="instagram"
            type="text"
            required
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Curso hij@
          <input
            name="curso"
            type="text"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Email
          <input
            name="email"
            type="email"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Funnel
          <input
            name="funnel"
            type="text"
            placeholder="BIENVENIDA, DM, FU..."
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Día llamada de ventas
          <input
            name="sales_call_day"
            type="date"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Hora
          <input
            name="hora_sales_call"
            type="time"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Status
          <select
            name="status"
            defaultValue="BOOK"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
          >
            <option value="BOOK">BOOK</option>
            <option value="REBOOK">REBOOK</option>
            <option value="CLIENT">CLIENT</option>
            <option value="NOT CLOSED">NOT CLOSED</option>
            <option value="CANCEL">CANCEL</option>
            <option value="NO SHOW">NO SHOW</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Setter
          <input
            name="setter"
            type="text"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)] sm:col-span-3">
          Comentarios
          <input
            name="comentarios"
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
