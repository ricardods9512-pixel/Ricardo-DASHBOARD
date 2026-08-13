import { disconnectGoogleDrive } from '@/app/(dashboard)/escuela/actions'

export function DriveConnectionStatus({ connectedEmail }: { connectedEmail: string | null }) {
  if (!connectedEmail) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div>
          <p className="text-sm font-semibold">📁 Google Drive no conectado</p>
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Conectá tu Drive para que cada alumno nuevo tenga su carpeta y plantillas creadas automáticamente.
          </p>
        </div>
        <a
          href="/api/google/connect"
          className="rounded-lg bg-[var(--series-1)] px-4 py-2 text-sm font-semibold text-white"
        >
          Conectar Google Drive
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-sm">
        📁 Google Drive conectado como <span className="font-semibold">{connectedEmail}</span> — las carpetas de
        alumnos nuevos se crean solas.
      </p>
      <form action={disconnectGoogleDrive}>
        <button type="submit" className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold">
          Desconectar
        </button>
      </form>
    </div>
  )
}
