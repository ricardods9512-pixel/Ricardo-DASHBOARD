import { updateModuleProgress } from '@/app/(dashboard)/escuela/actions'

export type CommunityModule = {
  id: string
  code: string | null
  title: string
  subtitle: string | null
  icon: string | null
  color: string | null
  progress_pct: number
  kind: string
}

export function ModuleGrid({ modules }: { modules: CommunityModule[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((m) => {
        const formId = `mod-${m.id}`
        return (
          <div key={m.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <div
              className="flex h-28 flex-col justify-end p-4"
              style={{ background: `linear-gradient(135deg, ${m.color ?? '#1f2937'}, color-mix(in srgb, ${m.color ?? '#1f2937'} 60%, black))` }}
            >
              <span className="text-2xl">{m.icon}</span>
              {m.subtitle && <p className="text-xs font-semibold uppercase tracking-wide text-white/80">{m.subtitle}</p>}
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold">
                {m.code !== null ? `${m.code}. ` : ''}
                {m.title}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--border)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${m.progress_pct}%`,
                      backgroundColor: m.progress_pct >= 100 ? 'var(--status-good)' : 'var(--series-1)',
                    }}
                  />
                </div>
                <span className="w-9 text-right text-xs font-semibold tabular-nums">{m.progress_pct}%</span>
              </div>
              <form action={updateModuleProgress} id={formId} className="mt-3 flex items-center gap-2">
                <input type="hidden" name="module_id" value={m.id} />
                <input
                  name="progress_pct"
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={m.progress_pct}
                  className="w-16 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs"
                />
                <button type="submit" className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-semibold">
                  Actualizar %
                </button>
              </form>
            </div>
          </div>
        )
      })}
    </div>
  )
}
