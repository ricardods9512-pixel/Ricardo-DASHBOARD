import type { ChannelField } from '@/lib/data/channel-config'
import { upsertChannelMetric } from '@/app/(dashboard)/channel-metrics-actions'

export function ChannelMetricForm({
  channel,
  fields,
}: {
  channel: string
  fields: ChannelField[]
}) {
  return (
    <details className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <summary className="cursor-pointer text-sm font-semibold">
        + Agregar / actualizar mes
      </summary>
      <form action={upsertChannelMetric} className="mt-4 grid grid-cols-2 gap-3">
        <input type="hidden" name="channel" value={channel} />
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Mes
          <input
            name="month"
            type="month"
            required
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
          />
        </label>
        {fields.map((f) => (
          <label
            key={f.key}
            className="flex flex-col gap-1 text-xs font-medium text-[var(--foreground-secondary)]"
          >
            {f.label}
            <input
              name={f.key}
              type="number"
              step={f.format === 'currency' ? '0.01' : '1'}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--series-1)]"
            />
          </label>
        ))}
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
