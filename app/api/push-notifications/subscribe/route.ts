import { type NextRequest, NextResponse } from "next/server"
import { getMessaging } from "firebase-admin/messaging"

export async function POST(request: NextRequest) {
  try {
    const { token, topic } = await request.json()

    if (!token || !topic) {
      return NextResponse.json({ success: false, message: "FCM token and topic are required" }, { status: 400 })
    }

    await getMessaging().subscribeToTopic(token, topic)

    return NextResponse.json({
      success: true,
      message: `Successfully subscribed to topic: ${topic}`,
    })
  } catch (error) {
    console.error("Error subscribing to topic:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred while subscribing to topic",
      },
      { status: 500 },
    )
  }
}

