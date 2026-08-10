'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Métricas', icon: '📊' },
  { href: '/escuela', label: 'Escuela', icon: '🎓' },
  { href: '/comunicaciones', label: 'Comunicaciones', icon: '💬' },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const active = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-[var(--series-1)] text-white'
                : 'text-[var(--foreground-secondary)] hover:bg-[var(--border)]'
            }`}
          >
            <span aria-hidden>{link.icon}</span>
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
