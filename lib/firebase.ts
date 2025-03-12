import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function validateFirebaseConfig() {
  const { apiKey, authDomain, projectId, measurementId, storageBucket, appId } =
    firebaseConfig;

  if (
    !apiKey ||
    !authDomain ||
    !projectId ||
    !measurementId ||
    !storageBucket ||
    !appId
  ) {
    alert(`Missing Firebase config values`);
    throw new Error(`Missing Firebase config values`);
  }
}
let messaging: any = null;

export async function initializeFirebase() {
  if (typeof window === "undefined") return;

  try {
    validateFirebaseConfig();
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      console.log("Message received in the foreground:", payload);
      displayNotification(payload);
    });

    return app;
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    throw error;
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    throw new Error("This browser does not support notifications");
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  const permission = await Notification.requestPermission();
  return permission;
}

export async function getFirebaseToken(): Promise<string | null> {
  if (!messaging) {
    throw new Error("Firebase messaging is not initialized");
  }

  try {
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (!currentToken) {
      console.log(
        "No registration token available. Request permission to generate one.",
      );
      return null;
    }

    return currentToken;
  } catch (error) {
    console.error("An error occurred while retrieving token:", error);
    throw error;
  }
}

function displayNotification(payload: any) {
  if ("Notification" in window && Notification.permission === "granted") {
    const notificationTitle = payload.notification?.title || "New Notification";
    const notificationOptions = {
      body: payload.notification?.body || "You have a new notification",
      icon: "/icon-512x512.png",
      data: payload.data,
    };

    const notification = new Notification(
      notificationTitle,
      notificationOptions,
    );

    notification.onclick = () => {
      window.focus();
      notification.close();
      // Handle notification click (e.g., navigate to a specific page)
      if (payload.data?.url) {
        window.location.href = payload.data.url;
      }
    };
  }
}

export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data?: any,
) {
  try {
    const response = await fetch("/api/push-notifications/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, title, body, data }),
    });

    if (!response.ok) {
      throw new Error("Failed to send push notification");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
}

export async function subscribeToTopic(token: string, topic: string) {
  try {
    const response = await fetch("/api/push-notifications/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, topic }),
    });

    if (!response.ok) {
      throw new Error("Failed to subscribe to topic");
    }

    return await response.json();
  } catch (error) {
    console.error("Error subscribing to topic:", error);
    throw error;
  }
}

export async function unsubscribeFromTopic(token: string, topic: string) {
  try {
    const response = await fetch("/api/push-notifications/unsubscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, topic }),
    });

    if (!response.ok) {
      throw new Error("Failed to unsubscribe from topic");
    }

    return await response.json();
  } catch (error) {
    console.error("Error unsubscribing from topic:", error);
    throw error;
  }
}

export async function sendNotificationToTopic(
  topic: string,
  title: string,
  body: string,
  data?: any,
) {
  try {
    const response = await fetch("/api/push-notifications/send-to-topic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic, title, body, data }),
    });

    if (!response.ok) {
      throw new Error("Failed to send notification to topic");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending notification to topic:", error);
    throw error;
  }
}
