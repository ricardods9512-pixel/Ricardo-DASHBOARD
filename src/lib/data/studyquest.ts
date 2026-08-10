export function studyQuestLevel(xp: number) {
  if (xp >= 400) return { label: '👑 Leyenda', color: 'var(--series-1)' }
  if (xp >= 250) return { label: '💎 Platino', color: '#7dd3fc' }
  if (xp >= 150) return { label: '🥇 Oro', color: '#eab308' }
  if (xp >= 100) return { label: '🥈 Plata', color: '#9ca3af' }
  return { label: '🥉 Bronce', color: '#b45309' }
}
