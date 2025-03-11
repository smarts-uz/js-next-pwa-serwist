import { type NextRequest, NextResponse } from "next/server"
import { getMessaging } from "firebase-admin/messaging"

export async function POST(request: NextRequest) {
  try {
    const { token, topic } = await request.json()

    if (!token || !topic) {
      return NextResponse.json({ success: false, message: "FCM token and topic are required" }, { status: 400 })
    }

    await getMessaging().unsubscribeFromTopic(token, topic)

    return NextResponse.json({
      success: true,
      message: `Successfully unsubscribed from topic: ${topic}`,
    })
  } catch (error) {
    console.error("Error unsubscribing from topic:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred while unsubscribing from topic",
      },
      { status: 500 },
    )
  }
}

