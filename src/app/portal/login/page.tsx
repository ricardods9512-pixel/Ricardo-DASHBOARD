import Link from 'next/link'
import { StudentLoginForm } from './login-form'

export default function PortalLoginPage() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
        <h1 className="text-xl font-semibold">🎮 Zona de Juegos</h1>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">Entrá con tu cuenta de alumno</p>
        <div className="mt-6">
          <StudentLoginForm />
        </div>
        <p className="mt-6 text-sm text-[var(--foreground-secondary)]">
          ¿Todavía no creaste tu cuenta?{' '}
          <Link href="/portal/signup" className="font-medium text-[var(--series-1)]">
            Crear cuenta
          </Link>
        </p>
      </div>
    </main>
  )
}
