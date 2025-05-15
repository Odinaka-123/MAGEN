import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getBreachesByUserId } from "@/services/database"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const breaches = await getBreachesByUserId(userId)

    return NextResponse.json(breaches)
  } catch (error) {
    console.error("Error fetching breaches:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
