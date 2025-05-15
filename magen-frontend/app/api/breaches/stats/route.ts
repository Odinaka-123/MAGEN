import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { query } from "@/services/database"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)

    // Get breach statistics
    const totalBreaches = (await query("SELECT COUNT(*) as total FROM breaches WHERE user_id = ?", [userId])) as any[]

    const activeBreaches = (await query(
      'SELECT COUNT(*) as active FROM breaches WHERE user_id = ? AND status IN ("New", "Active")',
      [userId],
    )) as any[]

    const resolvedBreaches = (await query(
      'SELECT COUNT(*) as resolved FROM breaches WHERE user_id = ? AND status = "Resolved"',
      [userId],
    )) as any[]

    // Get monthly breach counts for the chart
    const monthlyBreaches = (await query(
      `
      SELECT 
        DATE_FORMAT(detected_date, '%Y-%m') as month,
        COUNT(*) as count
      FROM breaches
      WHERE user_id = ?
      GROUP BY DATE_FORMAT(detected_date, '%Y-%m')
      ORDER BY month ASC
      LIMIT 12
    `,
      [userId],
    )) as any[]

    return NextResponse.json({
      total: totalBreaches[0].total,
      active: activeBreaches[0].active,
      resolved: resolvedBreaches[0].resolved,
      monthlyData: monthlyBreaches,
    })
  } catch (error) {
    console.error("Error fetching breach statistics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
