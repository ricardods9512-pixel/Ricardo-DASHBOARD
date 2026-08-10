import Link from 'next/link'
import { SignupForm } from './signup-form'

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Crear cuenta</h1>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Configuración inicial del panel
        </p>
        <div className="mt-6">
          <SignupForm />
        </div>
        <p className="mt-6 text-sm text-[var(--foreground-secondary)]">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="font-medium text-[var(--series-1)]">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  )
}
