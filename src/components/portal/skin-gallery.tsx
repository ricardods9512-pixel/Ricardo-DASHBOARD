import { equipSkin } from '@/app/portal/actions'
import type { Skin } from './profile-card'

export function SkinGallery({
  skins,
  level,
  equippedSkinId,
}: {
  skins: Skin[]
  level: number
  equippedSkinId: string | null
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="text-sm font-semibold">✨ Skins</h2>
      <p className="mt-1 text-xs text-[var(--foreground-muted)]">Se desbloquean solas al subir de nivel</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {skins.map((s) => {
          const unlocked = level >= s.level_required
          const equipped = equippedSkinId === s.id
          return (
            <div
              key={s.id}
              className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center"
              style={{
                borderColor: equipped ? s.color : 'var(--border)',
                opacity: unlocked ? 1 : 0.4,
              }}
            >
              <span className="text-3xl">{unlocked ? s.icon : '🔒'}</span>
              <p className="text-xs font-semibold">{s.name}</p>
              <p className="text-[10px] text-[var(--foreground-muted)]">Nivel {s.level_required}</p>
              {unlocked && !equipped && (
                <form action={equipSkin}>
                  <input type="hidden" name="skin_id" value={s.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] font-semibold"
                  >
                    Equipar
                  </button>
                </form>
              )}
              {equipped && <span className="text-[10px] font-semibold text-[var(--status-good)]">Equipada</span>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
