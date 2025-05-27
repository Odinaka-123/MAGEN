import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { scanBreachesForEmail, getUserByEmail } from "@/services/database"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    // Get userId from email
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json({ error: "User email missing in session" }, { status: 400 })
    }
    const user = await getUserByEmail(userEmail);
    if (!user || !user.id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    const userId = user.id;
    const body = await request.json();
    const email = body.email;
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const result = await scanBreachesForEmail(userId, email);
    return NextResponse.json({ message: "Scan complete", breaches: result });
  } catch (error) {
    console.error("Error scanning breaches:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
