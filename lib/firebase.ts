// Firebase configuration for push notifications
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

let messaging: any = null;

// Initialize Firebase
export async function initializeFirebase() {
  if (typeof window === "undefined") return;
  if (Object.keys(firebaseConfig).map((key) => key === "")) {
    return alert("Firebase configuration is not set");
  }
  try {
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);

    // Handle incoming messages when the app is in the foreground
    onMessage(messaging, (payload: any) => {
      console.log("Message received in the foreground:", payload);

      // Display a notification if the browser supports it
      if ("Notification" in window && Notification.permission === "granted") {
        const notificationTitle =
          payload.notification?.title || "New Notification";
        const notificationOptions = {
          body: payload.notification?.body || "You have a new notification",
          icon: "/icon-512x512.png",
        };

        new Notification(notificationTitle, notificationOptions);
      }
    });

    return app;
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    throw error;
  }
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    throw new Error("This browser does not support notifications");
  }
  if (Object.keys(firebaseConfig).map((key) => key === "")) {
    alert("Firebase configuration is not set");
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  const permission = await Notification.requestPermission();
  return permission;
}

// Subscribe to a topic
export async function subscribeToTopic(topic: string) {
  if (Object.keys(firebaseConfig).map((key) => key === "")) {
    alert("Firebase configuration is not set");
    return;
  }
  if (!messaging) {
    return alert("Firebase configuration is not set");
  }

  try {
    // Get the FCM token
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U",
    });

    if (!currentToken) {
      throw new Error("No registration token available");
    }

    console.log("FCM Token:", currentToken);

    // In a real app, you would send this token to your server
    // to subscribe to a specific topic
    console.log(`Subscribed to topic: ${topic}`);

    return currentToken;
  } catch (error) {
    console.error("Error subscribing to topic:", error);
    throw error;
  }
}

// Send a test notification
export async function sendTestNotification(title: string, body: string) {
  // In a real app, you would call your backend API to send a notification
  // For this example, we'll simulate it with a timeout
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      if ("Notification" in window && Notification.permission === "granted") {
        const notification = new Notification(title, {
          body,
          icon: "/icon-512x512.png",
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }

      resolve();
    }, 1000);
  });
}
