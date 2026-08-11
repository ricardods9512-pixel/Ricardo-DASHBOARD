'use client'

import { Bar, BarChart, CartesianGrid, Legend, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Series = {
  key: string
  label: string
  color: string
}

const currencyFormat = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export function MonthlyBarChart({ data, series }: { data: Record<string, unknown>[]; series: Series[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--gridline)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: 'var(--foreground-muted)', fontSize: 10 }}
            axisLine={{ stroke: 'var(--gridline)' }}
            tickLine={false}
            interval={0}
          />
          <YAxis
            tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(v) => currencyFormat.format(Number(v))}
          />
          <Tooltip
            formatter={(value) => currencyFormat.format(Number(value))}
            contentStyle={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
              color: 'var(--foreground)',
            }}
          />
          {series.length > 1 && (
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--foreground-secondary)' }} iconType="square" iconSize={10} />
          )}
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey={s.key}
                position="top"
                formatter={(v: unknown) => (typeof v === 'number' && v ? currencyFormat.format(v) : '')}
                style={{ fill: s.color, fontSize: 9, fontWeight: 600 }}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
