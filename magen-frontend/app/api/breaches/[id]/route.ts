import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getBreachById, updateBreachStatus } from "@/services/database"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const breachId = Number.parseInt(params.id)

    const breach = await getBreachById(breachId, userId)

    if (!breach) {
      return NextResponse.json({ error: "Breach not found" }, { status: 404 })
    }

    return NextResponse.json(breach)
  } catch (error) {
    console.error("Error fetching breach:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const breachId = Number.parseInt(params.id)

    const data = await request.json()
    const { status } = data

    if (!status || !["New", "Active", "Resolved"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    await updateBreachStatus(breachId, userId, status)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating breach:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
