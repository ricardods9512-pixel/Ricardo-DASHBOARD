export const BUSINESS_LEVELS = [
  { name: 'Iniciado', threshold: 0 },
  { name: 'Aprendiz', threshold: 1000 },
  { name: 'Constante', threshold: 2500 },
  { name: 'Sólido', threshold: 5000 },
  { name: 'Avanzado', threshold: 10000 },
  { name: 'Experto', threshold: 20000 },
  { name: 'Élite', threshold: 35000 },
  { name: 'Maestro', threshold: 55000 },
  { name: 'Leyenda', threshold: 80000 },
] as const

export function levelForXp(xp: number) {
  let levelIndex = 0
  for (let i = 0; i < BUSINESS_LEVELS.length; i++) {
    if (xp >= BUSINESS_LEVELS[i].threshold) levelIndex = i
  }
  const current = BUSINESS_LEVELS[levelIndex]
  const next = BUSINESS_LEVELS[levelIndex + 1]
  const progressPct = next
    ? Math.min(100, ((xp - current.threshold) / (next.threshold - current.threshold)) * 100)
    : 100

  return {
    number: levelIndex + 1,
    name: current.name,
    next: next?.name ?? null,
    nextThreshold: next?.threshold ?? null,
    progressPct,
  }
}

export function studentLevelBand(level: number | null) {
  const lvl = level ?? 1
  if (lvl >= 9) return 'Leyenda'
  if (lvl >= 7) return 'Platino'
  if (lvl >= 5) return 'Oro'
  if (lvl >= 3) return 'Plata'
  return 'Bronce'
}

export const STUDENT_LEVEL_BANDS = ['Bronce', 'Plata', 'Oro', 'Platino', 'Leyenda'] as const

export function levelForPoints(points: number) {
  return Math.floor(points / 200) + 1
}

export function pointsProgressInLevel(points: number) {
  const level = levelForPoints(points)
  const levelStart = (level - 1) * 200
  const pointsInLevel = points - levelStart
  return {
    level,
    pointsInLevel,
    pointsToNext: 200 - pointsInLevel,
    progressPct: Math.min(100, (pointsInLevel / 200) * 100),
  }
}
