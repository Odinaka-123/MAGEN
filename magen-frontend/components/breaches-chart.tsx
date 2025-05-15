"use client"

import { Chart, ChartContainer } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react"
import { getBreachStats } from "@/services/api"

export function BreachesChart() {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getBreachStats()
      .then((stats) => setChartData(stats.monthlyBreaches || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

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
            <XAxis dataKey="month" />
            <YAxis />
            {/* Remove ChartTooltip if it causes type error, or ensure ChartTooltipContent is a valid string or component as required by recharts. */}
            {/* <ChartTooltip content={<ChartTooltipContent />} /> */}
            <Area type="monotone" dataKey="breaches" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </Chart>
    </ChartContainer>
  )
}
