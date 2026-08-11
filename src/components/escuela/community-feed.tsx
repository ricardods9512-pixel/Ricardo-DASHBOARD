import { addPost } from '@/app/(dashboard)/escuela/actions'

export type CommunityPost = {
  id: string
  author_name: string
  title: string
  body: string | null
  category: string
  likes_count: number
  comments_count: number
  created_at: string
}

const dateFormatter = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function CommunityFeed({
  posts,
  memberCount,
}: {
  posts: CommunityPost[]
  memberCount: number
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
      <div className="flex flex-col gap-4">
        <details className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <summary className="cursor-pointer text-sm font-semibold text-[var(--foreground-secondary)]">
            ✏️ Escribe algo...
          </summary>
          <form action={addPost} className="mt-4 flex flex-col gap-3">
            <input
              name="title"
              placeholder="Título de la publicación"
              required
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-medium outline-none focus:border-[var(--series-1)]"
            />
            <textarea
              name="body"
              placeholder="Escribe algo para la comunidad..."
              rows={3}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--series-1)]"
            />
            <div className="flex items-center gap-3">
              <select
                name="category"
                defaultValue="General discussion"
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs"
              >
                <option value="General discussion">General discussion</option>
                <option value="Anuncios">Anuncios</option>
                <option value="Wins">Wins</option>
                <option value="Dudas">Dudas</option>
              </select>
              <button
                type="submit"
                className="ml-auto rounded-lg bg-[var(--series-1)] px-4 py-1.5 text-xs font-semibold text-white"
              >
                Publicar
              </button>
            </div>
          </form>
        </details>

        {posts.map((p) => (
          <article key={p.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--series-1)] text-xs font-semibold text-white">
                {initials(p.author_name)}
              </div>
              <div>
                <p className="text-sm font-semibold">{p.author_name}</p>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {dateFormatter.format(new Date(p.created_at))} · {p.category}
                </p>
              </div>
            </div>
            <h3 className="mt-3 text-base font-bold">{p.title}</h3>
            {p.body && <p className="mt-1 text-sm text-[var(--foreground-secondary)]">{p.body}</p>}
            <div className="mt-3 flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
              <span>👍 {p.likes_count}</span>
              <span>💬 {p.comments_count}</span>
            </div>
          </article>
        ))}

        {posts.length === 0 && (
          <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm text-[var(--foreground-muted)]">
            Todavía no hay publicaciones.
          </p>
        )}
      </div>

      <aside className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--series-1)] text-2xl">
          🎓
        </div>
        <p className="text-sm font-semibold">Educare.io_RicardoDiazCoaching</p>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-lg border border-[var(--border)] py-2">
            <p className="text-lg font-bold">{memberCount}</p>
            <p className="text-[10px] text-[var(--foreground-muted)]">Miembros</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] py-2">
            <p className="text-lg font-bold">1</p>
            <p className="text-[10px] text-[var(--foreground-muted)]">Administrador</p>
          </div>
        </div>
      </aside>
    </div>
  )
}
