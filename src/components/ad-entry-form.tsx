import { addAdEntry } from '@/app/(dashboard)/ads-actions'

export function AdEntryForm() {
  return (
    <details className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <summary className="cursor-pointer text-sm font-semibold">+ Agregar entrada semanal</summary>
      <form action={addAdEntry} className="mt-4 grid grid-cols-2 gap-3">
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
          Semana
          <input
            name="week_label"
            type="text"
            placeholder="Semana 1"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Nombre del anuncio
          <input
            name="ad_name"
            type="text"
            required
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Seguidores
          <input
            name="followers"
            type="number"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Inversión
          <input
            name="investment"
            type="number"
            step="0.01"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          CPF últimos 7 días
          <input
            name="cpf_7d"
            type="number"
            step="0.01"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Keyword
          <input
            name="keyword"
            type="text"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Estado
          <select
            name="status"
            defaultValue="MANTENGO ADS"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
          >
            <option value="MANTENGO ADS">🟢 Mantengo</option>
            <option value="VIGILAR">🟡 Vigilar</option>
            <option value="NUEVOS ADS">🆕 Nuevos</option>
            <option value="PARADO">🔴 Parado</option>
          </select>
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          URL
          <input
            name="url"
            type="url"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <div className="col-span-2 mt-2">
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
