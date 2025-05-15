import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { query } from "@/services/database"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const data = await request.json()

    // Save onboarding preferences
    await query(
      `
      INSERT INTO user_preferences (
        user_id, 
        email_alerts, 
        in_app_alerts, 
        weekly_digest, 
        data_sharing
      ) VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        email_alerts = VALUES(email_alerts),
        in_app_alerts = VALUES(in_app_alerts),
        weekly_digest = VALUES(weekly_digest),
        data_sharing = VALUES(data_sharing)
    `,
      [
        userId,
        data.emailAlerts !== undefined ? data.emailAlerts : true,
        data.inAppAlerts !== undefined ? data.inAppAlerts : true,
        data.weeklyDigest !== undefined ? data.weeklyDigest : false,
        data.dataSharing !== undefined ? data.dataSharing : false,
      ],
    )

    // If additional emails were provided, save them
    if (data.additionalEmails && Array.isArray(data.additionalEmails)) {
      for (const email of data.additionalEmails) {
        await query(
          `
          INSERT INTO monitored_emails (user_id, email)
          VALUES (?, ?)
        `,
          [userId, email],
        )
      }
    }

    // Mark onboarding as complete
    await query(
      `
      UPDATE users
      SET onboarding_completed = TRUE
      WHERE id = ?
    `,
      [userId],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving onboarding preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
