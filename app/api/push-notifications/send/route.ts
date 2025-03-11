import { type NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}"
) as ServiceAccount;
initializeApp({
  credential: cert(serviceAccount),
});
// if (!initializeApp.length) {
// }
console.log(cert(serviceAccount));

export async function POST(request: NextRequest) {
  try {
    const { token, title, body, data } = await request.json();

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

    const response = await getMessaging().send(message);

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully",
      messageId: response,
    });
  } catch (error) {
    console.error("Error sending push notification:", error);
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
