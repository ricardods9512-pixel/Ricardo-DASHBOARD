import { updateStudyQuestClient } from '@/app/(dashboard)/studyquest-actions'
import { studyQuestLevel } from '@/lib/data/studyquest'

export type StudyQuestClient = {
  id: string
  fecha_alta: string
  cliente: string
  pilar: string | null
  grupo: string | null
  renovaciones: number
  exito_entrevista: number
  toca_6m: string | null
  resultado: number
  upsell: number
  check_3m: number
  check_6m: number
  check_9m: number
  xp: number
  notas: string | null
  toca_3m: string | null
  toca_9m: string | null
}

const PILARES = ['Pilar 1', 'Pilar 2', 'Pilar 3', 'Pilar 4', 'Pilar 5']

function CheckSelect({ formId, name, value }: { formId: string; name: string; value: number }) {
  return (
    <select
      form={formId}
      name={name}
      defaultValue={value}
      className="w-14 rounded-lg border border-[var(--border)] px-1 py-1 text-center text-xs"
      style={{
        backgroundColor: value ? 'color-mix(in srgb, var(--status-good) 20%, transparent)' : undefined,
      }}
    >
      <option value={0}>0</option>
      <option value={1}>1</option>
    </select>
  )
}

export function StudyQuestTable({ title, clients }: { title: string; clients: StudyQuestClient[] }) {
  return (
    <details open className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 bg-[var(--background)] px-5 py-3">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs text-[var(--foreground-muted)]">{clients.length} alumnos</span>
      </summary>

      <div className="overflow-x-auto p-3">
        <table className="w-full min-w-[1100px] text-xs">
          <thead>
            <tr className="text-left text-[var(--foreground-muted)]">
              <th className="px-2 py-2 font-medium">Fecha alta</th>
              <th className="px-2 py-2 font-medium">Cliente</th>
              <th className="px-2 py-2 font-medium">Pilar</th>
              <th className="px-2 py-2 font-medium">Ren.</th>
              <th className="px-2 py-2 font-medium">Éxito</th>
              <th className="px-2 py-2 font-medium">Toca 6m</th>
              <th className="px-2 py-2 font-medium">Result.</th>
              <th className="px-2 py-2 font-medium">Upsell</th>
              <th className="px-2 py-2 font-medium">3m</th>
              <th className="px-2 py-2 font-medium">6m</th>
              <th className="px-2 py-2 font-medium">9m</th>
              <th className="px-2 py-2 font-medium">XP</th>
              <th className="px-2 py-2 font-medium">Nivel</th>
              <th className="px-2 py-2 font-medium">Notas</th>
              <th className="px-2 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => {
              const formId = `sq-${c.id}`
              const level = studyQuestLevel(c.xp)
              return (
                <tr key={c.id} className="border-t border-[var(--border)] align-top">
                  <td className="whitespace-nowrap px-2 py-1.5 text-[var(--foreground-secondary)]">
                    {c.fecha_alta}
                  </td>
                  <td className="max-w-[160px] truncate px-2 py-1.5 font-medium">{c.cliente}</td>
                  <td className="px-2 py-1.5">
                    <select
                      form={formId}
                      name="pilar"
                      defaultValue={c.pilar ?? ''}
                      className="rounded-lg border border-[var(--border)] px-1.5 py-1 text-xs"
                    >
                      <option value="">—</option>
                      {PILARES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <CheckSelect formId={formId} name="renovaciones" value={c.renovaciones} />
                  </td>
                  <td className="px-2 py-1.5">
                    <CheckSelect formId={formId} name="exito_entrevista" value={c.exito_entrevista} />
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-[var(--foreground-secondary)]">
                    {c.toca_6m ?? '—'}
                  </td>
                  <td className="px-2 py-1.5">
                    <CheckSelect formId={formId} name="resultado" value={c.resultado} />
                  </td>
                  <td className="px-2 py-1.5">
                    <CheckSelect formId={formId} name="upsell" value={c.upsell} />
                  </td>
                  <td className="px-2 py-1.5">
                    <CheckSelect formId={formId} name="check_3m" value={c.check_3m} />
                  </td>
                  <td className="px-2 py-1.5">
                    <CheckSelect formId={formId} name="check_6m" value={c.check_6m} />
                  </td>
                  <td className="px-2 py-1.5">
                    <CheckSelect formId={formId} name="check_9m" value={c.check_9m} />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      form={formId}
                      name="xp"
                      type="number"
                      defaultValue={c.xp}
                      className="w-16 rounded-lg border border-[var(--border)] px-1.5 py-1 text-right text-xs"
                    />
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 font-medium" style={{ color: level.color }}>
                    {level.label}
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      form={formId}
                      name="notas"
                      type="text"
                      defaultValue={c.notas ?? ''}
                      className="w-40 rounded-lg border border-[var(--border)] px-1.5 py-1 text-xs"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <button
                      form={formId}
                      type="submit"
                      className="rounded-lg bg-[var(--series-1)] px-2.5 py-1 text-xs font-semibold text-white"
                    >
                      Guardar
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {clients.map((c) => (
          <form key={c.id} action={updateStudyQuestClient} id={`sq-${c.id}`} className="hidden">
            <input type="hidden" name="id" value={c.id} />
          </form>
        ))}
      </div>
    </details>
  )
}
