import { createClient } from '@/lib/supabase/server'
import { pointsProgressInLevel } from '@/lib/data/gamification'
import { ProfileCard } from '@/components/portal/profile-card'
import { SkinGallery } from '@/components/portal/skin-gallery'
import { SubmissionForm } from '@/components/portal/submission-form'
import { SubmissionGallery, type SubmissionWithUrl } from '@/components/portal/submission-gallery'
import { LeaderboardView } from '@/components/portal/leaderboard-view'

export default async function PortalPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <p className="text-sm text-[var(--foreground-muted)]">No se pudo cargar tu sesión.</p>
  }

  const { data: student } = await supabase
    .from('school_students')
    .select('id, name, points, level')
    .eq('auth_user_id', user.id)
    .single()

  if (!student) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-sm">
        <p className="font-semibold">Tu cuenta todavía no está vinculada a ningún alumno.</p>
        <p className="mt-1 text-[var(--foreground-muted)]">
          Pedile a tu profesor que te agregue en el panel con este mismo email, y volvé a entrar.
        </p>
      </div>
    )
  }

  const [{ data: submissions }, { data: skins }, { data: prefs }, { data: leaderboard }] = await Promise.all([
    supabase
      .from('game_submissions')
      .select('id, category, note, status, points_awarded, created_at, image_path')
      .eq('student_id', student.id)
      .order('created_at', { ascending: false }),
    supabase.from('game_skins').select('*').order('level_required', { ascending: true }),
    supabase.from('student_profile_prefs').select('equipped_skin_id').eq('student_id', student.id).maybeSingle(),
    supabase.from('leaderboard_view').select('*').order('points', { ascending: false }).limit(20),
  ])

  const submissionsWithUrls: SubmissionWithUrl[] = await Promise.all(
    (submissions ?? []).map(async (s) => {
      const { data: signed } = await supabase.storage
        .from('game-submissions')
        .createSignedUrl(s.image_path, 3600)
      return { ...s, imageUrl: signed?.signedUrl ?? null }
    }),
  )

  const progress = pointsProgressInLevel(student.points ?? 0)
  const equippedSkin = (skins ?? []).find((s) => s.id === prefs?.equipped_skin_id) ?? null

  return (
    <div className="flex flex-col gap-6">
      <ProfileCard
        name={student.name}
        points={student.points ?? 0}
        level={progress.level}
        pointsInLevel={progress.pointsInLevel}
        pointsToNext={progress.pointsToNext}
        progressPct={progress.progressPct}
        equippedSkin={equippedSkin}
      />
      <SkinGallery skins={skins ?? []} level={progress.level} equippedSkinId={prefs?.equipped_skin_id ?? null} />
      <SubmissionForm />
      <SubmissionGallery submissions={submissionsWithUrls} />
      <LeaderboardView entries={leaderboard ?? []} ownId={student.id} />
    </div>
  )
}
