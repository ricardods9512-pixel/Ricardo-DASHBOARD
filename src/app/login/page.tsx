import Link from 'next/link'
import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Panel de Control</h1>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Métricas, escuela online y comunicaciones
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="mt-6 text-sm text-[var(--foreground-secondary)]">
          ¿Primera vez?{' '}
          <Link href="/signup" className="font-medium text-[var(--series-1)]">
            Crear cuenta
          </Link>
        </p>
      </div>
    </main>
  )
}
