'use client'

import { useActionState } from 'react'
import { signupStudent } from './actions'

export function StudentSignupForm() {
  const [state, formAction, pending] = useActionState(signupStudent, undefined)

  if (state?.success) {
    return (
      <p className="text-sm text-[var(--status-good)]">
        ¡Cuenta creada! Revisá tu email para confirmarla y después iniciá sesión.
      </p>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-[var(--foreground-secondary)]">
          Email (el mismo que le diste a tu profesor)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--series-1)]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-[var(--foreground-secondary)]">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--series-1)]"
        />
      </div>
      {state?.error && <p className="text-sm text-[var(--status-critical)]">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-[var(--series-1)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>
    </form>
  )
}
