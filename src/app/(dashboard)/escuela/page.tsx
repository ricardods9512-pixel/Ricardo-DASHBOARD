import { createClient } from '@/lib/supabase/server'
import { EscuelaTabs } from './escuela-tabs'
import { CommunityFeed, type CommunityPost } from '@/components/escuela/community-feed'
import { ModuleGrid, type CommunityModule } from '@/components/escuela/module-grid'
import { SessionCalendar, type CommunitySession } from '@/components/escuela/session-calendar'
import { MemberDirectory, type Member } from '@/components/escuela/member-directory'
import { MemberEntryForm } from '@/components/escuela/member-entry-form'
import { WorldMap } from '@/components/escuela/world-map'
import { Leaderboard, type LeaderboardRow } from '@/components/escuela/leaderboard'

type PointsLogRow = {
  student_id: string
  points: number
  occurred_at: string
}

function rankPoints(log: PointsLogRow[], students: Member[], sinceDays: number | null): LeaderboardRow[] {
  const cutoff = sinceDays !== null ? new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) : null
  const totals = new Map<string, number>()
  for (const row of log) {
    if (cutoff && row.occurred_at < cutoff) continue
    totals.set(row.student_id, (totals.get(row.student_id) ?? 0) + row.points)
  }
  const nameById = new Map(students.map((s) => [s.id, s.name]))
  return Array.from(totals.entries())
    .map(([student_id, points]) => ({ student_id, points, name: nameById.get(student_id) ?? 'Alumno' }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 20)
}

export default async function EscuelaPage() {
  const supabase = await createClient()

  const [
    { data: students },
    { data: posts },
    { data: modules },
    { data: sessions },
    { data: pointsLog },
  ] = await Promise.all([
    supabase.from('school_students').select('*').order('points', { ascending: false }),
    supabase.from('community_posts').select('*').order('created_at', { ascending: false }),
    supabase.from('community_modules').select('*').order('sort_order', { ascending: true }),
    supabase.from('community_sessions').select('*').order('session_date', { ascending: true }),
    supabase.from('points_log').select('student_id, points, occurred_at').order('occurred_at', { ascending: false }),
  ])

  const members = (students ?? []) as Member[]
  const log = (pointsLog ?? []) as PointsLogRow[]

  const weekly = rankPoints(log, members, 7)
  const monthly = rankPoints(log, members, 30)
  const allTime = rankPoints(log, members, null)

  const mapStudents = members.map((m) => ({
    id: m.id,
    name: m.name,
    country: m.country,
    active: m.status === 'activo',
  }))

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Escuela — Educare.io_RicardoDiazCoaching</h1>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Comunidad, aula, calendario, miembros, mapa global y clasificación gamificada
        </p>
      </div>

      <EscuelaTabs
        tabs={{
          comunidad: <CommunityFeed posts={(posts ?? []) as CommunityPost[]} memberCount={members.length} />,
          aula: <ModuleGrid modules={(modules ?? []) as CommunityModule[]} />,
          calendario: <SessionCalendar sessions={(sessions ?? []) as CommunitySession[]} />,
          miembros: (
            <div className="flex flex-col gap-4">
              <MemberEntryForm />
              <MemberDirectory members={members} />
            </div>
          ),
          mapa: <WorldMap students={mapStudents} />,
          clasificacion: (
            <Leaderboard
              weekly={weekly}
              monthly={monthly}
              allTime={allTime}
              students={members.map((m) => ({ id: m.id, name: m.name }))}
            />
          ),
        }}
      />
    </div>
  )
}
