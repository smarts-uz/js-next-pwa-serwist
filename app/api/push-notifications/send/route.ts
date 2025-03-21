import { type NextRequest, NextResponse } from "next/server";
import { getMessaging } from "firebase-admin/messaging";
import { initializeFirebaseAdmin } from "@/lib/firebase-admin";

initializeFirebaseAdmin();

export async function POST(request: NextRequest) {
  try {
    const { token, title, body, data } = await request.json();
    console.log("token-api", token);
    if (!token) {
      return NextResponse.json(
        { success: false, message: "FCM token is required" },
        { status: 400 }
      );
    }

    const message = {
      token,
      notification: {
        title,
        body,
      },
      data: data || {},
    };
    console.log('message',message)
    const response = await getMessaging().send(message);
    console.log("response", response);

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully",
      messageId: response,
    });
  } catch (error) {
    // console.error("Error sending push notification:", error);
    console.log(error)
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred sending notification",
      },
      { status: 500 }
    );
  }
}
