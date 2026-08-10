export function PendingTab({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center">
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-sm text-[var(--foreground-muted)]">
        Todavía no armamos esta pestaña. Mandame capturas o los datos de esta parte del Excel y la
        construimos igual que las demás.
      </p>
    </div>
  )
}
