// Firebase configuration for push notifications
import { initializeApp } from "firebase/app"
import { getMessaging, getToken, onMessage } from "firebase/messaging"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFUVzKPPJ-MnXl9HGVfIY_pI4ZW1JnDDM",
  authDomain: "nextjs-pwa-example.firebaseapp.com",
  projectId: "nextjs-pwa-example",
  storageBucket: "nextjs-pwa-example.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6a7b8c9d0e1",
  measurementId: "G-ABCDEFGHIJ",
}

let messaging: any = null

// Initialize Firebase
export async function initializeFirebase() {
  if (typeof window === "undefined") return

  try {
    const app = initializeApp(firebaseConfig)
    messaging = getMessaging(app)

    // Handle incoming messages when the app is in the foreground
    onMessage(messaging, (payload: any) => {
      console.log("Message received in the foreground:", payload)

      // Display a notification if the browser supports it
      if ("Notification" in window && Notification.permission === "granted") {
        const notificationTitle = payload.notification?.title || "New Notification"
        const notificationOptions = {
          body: payload.notification?.body || "You have a new notification",
          icon: "/icon-192x192.png",
        }

        new Notification(notificationTitle, notificationOptions)
      }
    })

    return app
  } catch (error) {
    console.error("Error initializing Firebase:", error)
    throw error
  }
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    throw new Error("This browser does not support notifications")
  }

  if (Notification.permission === "granted") {
    return "granted"
  }

  const permission = await Notification.requestPermission()
  return permission
}

// Subscribe to a topic
export async function subscribeToTopic(topic: string) {
  if (!messaging) {
    throw new Error("Firebase messaging is not initialized")
  }

  try {
    // Get the FCM token
    const currentToken = await getToken(messaging, {
      vapidKey: "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U",
    })

    if (!currentToken) {
      throw new Error("No registration token available")
    }

    console.log("FCM Token:", currentToken)

    // In a real app, you would send this token to your server
    // to subscribe to a specific topic
    console.log(`Subscribed to topic: ${topic}`)

    return currentToken
  } catch (error) {
    console.error("Error subscribing to topic:", error)
    throw error
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
          icon: "/icon-192x192.png",
        })

        notification.onclick = () => {
          window.focus()
          notification.close()
        }
      }

      resolve()
    }, 1000)
  })
}

