"use client"

import { Chart, ChartContainer } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react"
import { getChart } from "@/services/api"

export function BreachesChart() {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getChart()
      .then((data: any[]) => setChartData(data))
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] w-full text-muted-foreground">
        <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mb-2"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>
        <span>No breach data to display yet!</span>
      </div>
    );
  }

  return (
    <ChartContainer className="h-[300px] w-full">
      <Chart>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* Tooltip for X axis */}
            <XAxis dataKey="month" tick={{ fontSize: 12 }}>
              <text x={0} y={0} dx={0} dy={-10} textAnchor="middle" fill="#888">
                <tspan>Month</tspan>
              </text>
            </XAxis>
            <YAxis tick={{ fontSize: 12 }}>
              <text x={0} y={0} dx={-10} dy={0} textAnchor="middle" fill="#888" transform="rotate(-90)">
                <tspan>Breaches</tspan>
              </text>
            </YAxis>
            {/* ChartTooltip for data points */}
            {/* <ChartTooltip content={<ChartTooltipContent />} /> */}
            <Area type="monotone" dataKey="breaches" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </Chart>
    </ChartContainer>
  )
}
