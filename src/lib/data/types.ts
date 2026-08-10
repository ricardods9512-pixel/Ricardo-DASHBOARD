export type BusinessMetric = {
  id: string
  month: string
  revenue: number | null
  expenses: number | null
  new_clients: number | null
  active_clients: number | null
  churn_rate: number | null
  conversion_rate: number | null
  mrr: number | null
  ltv: number | null
  notes: string | null
}

export type DiscordMetric = {
  id: string
  month: string
  total_members: number | null
  new_members: number | null
  active_members: number | null
  messages_count: number | null
  voice_minutes: number | null
  engagement_rate: number | null
  notes: string | null
}

export type SchoolStudent = {
  id: string
  name: string
  email: string | null
  phone: string | null
  source: string | null
  status: string | null
  enrolled_at: string | null
  points: number | null
  level: number | null
  streak_days: number | null
}

export type Course = {
  id: string
  name: string
  description: string | null
  price: number | null
}

export type Enrollment = {
  id: string
  student_id: string
  course_id: string
  progress_pct: number | null
  status: string | null
  enrolled_at: string | null
  completed_at: string | null
  satisfaction_score: number | null
}

export type StudentGoal = {
  id: string
  student_id: string
  title: string
  category: string | null
  status: string | null
  target_date: string | null
  completed_date: string | null
  progress_pct: number | null
  notes: string | null
}

export type Badge = {
  id: string
  name: string
  description: string | null
  icon: string | null
  points_required: number | null
}

export type StudentBadge = {
  id: string
  student_id: string
  badge_id: string
  earned_at: string | null
}

export type Communication = {
  id: string
  student_id: string | null
  channel: string | null
  direction: string | null
  subject: string | null
  message: string
  status: string | null
  occurred_at: string | null
}
