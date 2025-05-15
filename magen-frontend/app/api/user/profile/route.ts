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

    // Get user profile and preferences
    const userProfile = (await query(
      `
      SELECT 
        u.id, u.name, u.email, u.created_at,
        p.email_alerts, p.in_app_alerts, p.weekly_digest, p.data_sharing
      FROM users u
      LEFT JOIN user_preferences p ON u.id = p.user_id
      WHERE u.id = ?
    `,
      [userId],
    )) as any[]

    if (!userProfile.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(userProfile[0])
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const data = await request.json()

    // Update user profile
    if (data.name || data.email) {
      const updates = []
      const params = []

      if (data.name) {
        updates.push("name = ?")
        params.push(data.name)
      }

      if (data.email) {
        updates.push("email = ?")
        params.push(data.email)
      }

      params.push(userId)

      await query(
        `
        UPDATE users 
        SET ${updates.join(", ")}
        WHERE id = ?
      `,
        params,
      )
    }

    // Update user preferences
    if (
      data.emailAlerts !== undefined ||
      data.inAppAlerts !== undefined ||
      data.weeklyDigest !== undefined ||
      data.dataSharing !== undefined
    ) {
      // Check if preferences exist
      const existingPrefs = (await query("SELECT user_id FROM user_preferences WHERE user_id = ?", [userId])) as any[]

      if (existingPrefs.length) {
        // Update existing preferences
        const updates = []
        const params = []

        if (data.emailAlerts !== undefined) {
          updates.push("email_alerts = ?")
          params.push(data.emailAlerts)
        }

        if (data.inAppAlerts !== undefined) {
          updates.push("in_app_alerts = ?")
          params.push(data.inAppAlerts)
        }

        if (data.weeklyDigest !== undefined) {
          updates.push("weekly_digest = ?")
          params.push(data.weeklyDigest)
        }

        if (data.dataSharing !== undefined) {
          updates.push("data_sharing = ?")
          params.push(data.dataSharing)
        }

        params.push(userId)

        await query(
          `
          UPDATE user_preferences 
          SET ${updates.join(", ")}
          WHERE user_id = ?
        `,
          params,
        )
      } else {
        // Insert new preferences
        await query(
          `
          INSERT INTO user_preferences (
            user_id, 
            email_alerts, 
            in_app_alerts, 
            weekly_digest, 
            data_sharing
          ) VALUES (?, ?, ?, ?, ?)
        `,
          [
            userId,
            data.emailAlerts !== undefined ? data.emailAlerts : true,
            data.inAppAlerts !== undefined ? data.inAppAlerts : true,
            data.weeklyDigest !== undefined ? data.weeklyDigest : false,
            data.dataSharing !== undefined ? data.dataSharing : false,
          ],
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
