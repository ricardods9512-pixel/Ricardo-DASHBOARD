'use client'

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type FunnelStage = {
  label: string
  value: number
  color: string
}

export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={stages}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={140}
            tick={{ fill: 'var(--foreground-secondary)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
            {stages.map((s) => (
              <Cell key={s.label} fill={s.color} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              style={{ fill: 'var(--foreground)', fontSize: 12, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
