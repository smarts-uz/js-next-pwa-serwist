import { type NextRequest, NextResponse } from "next/server"
import { getMessaging } from "firebase-admin/messaging"

export async function POST(request: NextRequest) {
  try {
    const { topic, title, body, data } = await request.json()

    if (!topic) {
      return NextResponse.json({ success: false, message: "Topic is required" }, { status: 400 })
    }

    const message = {
      topic,
      notification: {
        title,
        body,
      },
      data: data || {},
    }

    const response = await getMessaging().send(message)

    return NextResponse.json({
      success: true,
      message: "Notification sent to topic successfully",
      messageId: response,
    })
  } catch (error) {
    console.error("Error sending push notification to topic:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred sending notification to topic",
      },
      { status: 500 },
    )
  }
}

