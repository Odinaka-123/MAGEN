import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getAlertsByUserId } from "@/services/database"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const alerts = await getAlertsByUserId(userId)

    return NextResponse.json(alerts)
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
