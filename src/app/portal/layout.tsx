import { logoutStudent } from './actions'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[var(--background)]">
      <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4">
        <div>
          <p className="text-sm font-semibold">🎮 Zona de Juegos</p>
          <p className="text-xs text-[var(--foreground-muted)]">Educare.io — sumá puntos y subí de nivel</p>
        </div>
        <form action={logoutStudent}>
          <button
            type="submit"
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--foreground-secondary)] hover:bg-[var(--border)]"
          >
            Cerrar sesión
          </button>
        </form>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">{children}</main>
    </div>
  )
}
