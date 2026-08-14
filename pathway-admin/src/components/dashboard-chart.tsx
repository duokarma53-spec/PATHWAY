"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  { name: "Jan", applications: 40, admits: 24 },
  { name: "Feb", applications: 30, admits: 13 },
  { name: "Mar", applications: 20, admits: 98 },
  { name: "Apr", applications: 27, admits: 39 },
  { name: "May", applications: 18, admits: 48 },
  { name: "Jun", applications: 23, admits: 38 },
  { name: "Jul", applications: 34, admits: 43 },
]

export function DashboardChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip 
          cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--background))', 
            borderRadius: '8px',
            border: '1px solid hsl(var(--border))',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            fontSize: '12px'
          }}
        />
        <Bar
          dataKey="applications"
          name="Applications"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          barSize={24}
        />
        <Bar
          dataKey="admits"
          name="Admits"
          fill="hsl(var(--accent))"
          radius={[4, 4, 0, 0]}
          barSize={24}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
