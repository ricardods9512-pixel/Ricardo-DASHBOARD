'use client'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

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

export function TrendChart({
  data,
  series,
  valueFormat,
}: {
  data: Record<string, unknown>[]
  series: Series[]
  valueFormat?: 'currency'
}) {
  const valueFormatter =
    valueFormat === 'currency' ? (value: number) => currencyFormat.format(value) : undefined

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--gridline)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: 'var(--foreground-muted)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--gridline)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--foreground-muted)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={valueFormatter}
          />
          <Tooltip
            formatter={(value) =>
              valueFormatter ? valueFormatter(Number(value)) : String(value)
            }
            contentStyle={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
              color: 'var(--foreground)',
            }}
          />
          {series.length > 1 && (
            <Legend
              wrapperStyle={{ fontSize: 12, color: 'var(--foreground-secondary)' }}
              iconType="line"
              iconSize={12}
            />
          )}
          {series.map((s) => (
            <Line
              key={s.key}
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 0, fill: s.color }}
              activeDot={{ r: 5 }}
              type="monotone"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
