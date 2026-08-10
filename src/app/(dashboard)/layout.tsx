import { NavLinks } from './nav-links'
import { logout } from './actions'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1">
      <aside className="flex w-60 shrink-0 flex-col justify-between border-r border-[var(--border)] bg-[var(--surface)] p-4">
        <div>
          <div className="px-3 py-2">
            <p className="text-sm font-semibold">Panel de Control</p>
            <p className="text-xs text-[var(--foreground-muted)]">Negocio gamificado</p>
          </div>
          <div className="mt-4">
            <NavLinks />
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--foreground-secondary)] hover:bg-[var(--border)]"
          >
            Cerrar sesión
          </button>
        </form>
      </aside>
      <main className="flex-1 overflow-x-hidden bg-[var(--background)] px-8 py-8">{children}</main>
    </div>
  )
}
