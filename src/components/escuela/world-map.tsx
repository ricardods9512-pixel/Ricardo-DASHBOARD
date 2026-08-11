import { COUNTRY_COORDS, projectToMap } from '@/lib/data/countries'

type StudentPin = {
  id: string
  name: string
  country: string | null
  active: boolean
}

// Continentes en forma simplificada (silueta estilizada, no cartográficamente exacta)
const CONTINENTS = [
  // Norteamérica
  'M120,90 C160,60 230,55 260,90 C290,110 280,160 250,190 C220,220 190,230 170,210 C140,230 110,210 100,170 C90,140 95,110 120,90 Z',
  // Sudamérica
  'M230,240 C260,235 285,260 280,300 C275,340 260,390 235,410 C215,425 200,400 205,370 C195,340 205,290 210,265 C215,250 220,242 230,240 Z',
  // Europa
  'M470,90 C500,75 540,80 555,100 C565,115 555,135 535,140 C520,145 500,145 485,135 C470,128 460,105 470,90 Z',
  // África
  'M480,160 C520,150 555,170 560,215 C565,265 545,320 515,350 C495,370 470,350 465,315 C450,280 455,230 465,195 C468,180 472,168 480,160 Z',
  // Asia
  'M590,70 C650,55 750,65 800,100 C840,125 830,165 790,180 C750,195 690,190 650,170 C610,155 580,120 585,95 C586,86 587,78 590,70 Z',
  // Oceanía
  'M760,300 C790,292 820,305 825,330 C828,350 805,365 780,362 C760,360 745,345 748,325 C750,314 753,306 760,300 Z',
]

export function WorldMap({ students }: { students: StudentPin[] }) {
  const byCountry = new Map<string, StudentPin[]>()
  for (const s of students) {
    if (!s.country || !COUNTRY_COORDS[s.country]) continue
    const list = byCountry.get(s.country) ?? []
    list.push(s)
    byCountry.set(s.country, list)
  }

  const unlocated = students.filter((s) => !s.country || !COUNTRY_COORDS[s.country])

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="overflow-x-auto">
        <svg viewBox="0 0 1000 500" className="h-auto w-full min-w-[640px]" style={{ background: 'color-mix(in srgb, var(--series-1) 6%, var(--background))' }}>
          {CONTINENTS.map((d, i) => (
            <path key={i} d={d} fill="var(--border)" opacity={0.7} />
          ))}
          {Array.from(byCountry.entries()).map(([country, list]) => {
            const coord = COUNTRY_COORDS[country]
            const { x, y } = projectToMap(coord.lon, coord.lat)
            const activeCount = list.filter((s) => s.active).length
            const color = activeCount > 0 ? 'var(--status-good)' : 'var(--foreground-muted)'
            const radius = 6 + Math.min(list.length, 10) * 1.2
            return (
              <g key={country}>
                <circle cx={x} cy={y} r={radius} fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1.5} />
                <circle cx={x} cy={y} r={4} fill={color} />
                <text x={x + radius + 4} y={y + 4} fontSize={11} fill="var(--foreground)" fontWeight={600}>
                  {coord.flag} {country} ({list.length})
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-[var(--border)] px-5 py-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--status-good)' }} /> Activos
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--foreground-muted)' }} /> Sin alumnos activos / alumni
        </span>
        <span className="text-[var(--foreground-muted)]">
          Mapa estilizado por país (no cartográficamente exacto) · {students.length} alumnos en total
        </span>
      </div>

      {unlocated.length > 0 && (
        <div className="border-t border-[var(--border)] px-5 py-3 text-xs text-[var(--foreground-muted)]">
          Sin país asignado: {unlocated.map((s) => s.name).join(', ')}
        </div>
      )}
    </div>
  )
}
