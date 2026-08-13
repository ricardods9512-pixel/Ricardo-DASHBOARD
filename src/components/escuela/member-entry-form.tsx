import { addStudent } from '@/app/(dashboard)/escuela/actions'
import { COUNTRY_NAMES } from '@/lib/data/countries'
import { PendingSubmitButton } from './pending-submit-button'

export function MemberEntryForm() {
  return (
    <details className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <summary className="cursor-pointer text-sm font-semibold">+ Agregar miembro</summary>
      <p className="mt-3 text-xs text-[var(--foreground-muted)]">
        Después de agregarlo, compartile este link para que cree su cuenta de la 🎮 Zona de Juegos:{' '}
        <span className="font-semibold">tu-dominio.vercel.app/portal/signup</span> (con el mismo email que cargues acá).
      </p>
      <form action={addStudent} className="mt-4 grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Nombre
          <input
            name="name"
            required
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Usuario
          <input
            name="username"
            placeholder="nombre-apellido"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Email (necesario para la Zona de Juegos)
          <input
            name="email"
            type="email"
            required
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          País
          <select
            name="country"
            defaultValue=""
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
          >
            <option value="">—</option>
            {COUNTRY_NAMES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <p className="col-span-2 text-[10px] text-[var(--foreground-muted)]">
          Puede tardar unos segundos: además de guardarlo, crea su carpeta en Google Drive.
        </p>
        <div className="col-span-2">
          <PendingSubmitButton label="Guardar miembro" pendingLabel="Guardando y creando carpeta en Drive…" />
        </div>
      </form>
    </details>
  )
}
