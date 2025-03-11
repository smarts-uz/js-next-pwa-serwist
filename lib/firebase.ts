// // Firebase configuration for push notifications
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
// };

// function validateFirebaseConfig() {
//   const { apiKey, authDomain, projectId, measurementId, storageBucket, appId } =
//     firebaseConfig;

//   if (
//     !apiKey ||
//     !authDomain ||
//     !projectId ||
//     !measurementId ||
//     !storageBucket ||
//     !appId
//   ) {
//     alert(`Missing Firebase config values`);
//     throw new Error(`Missing Firebase config values`);
//   }
// }

// let messaging: any = null;

// // Initialize Firebase
// export async function initializeFirebase() {
//   if (typeof window === "undefined") return;
//   validateFirebaseConfig();
//   try {
//     const app = initializeApp(firebaseConfig);
//     messaging = getMessaging(app);

//     // Handle incoming messages when the app is in the foreground
//     onMessage(messaging, (payload: any) => {
//       console.log("Message received in the foreground:", payload);

//       // Display a notification if the browser supports it
//       if ("Notification" in window && Notification.permission === "granted") {
//         const notificationTitle =
//           payload.notification?.title || "New Notification";
//         const notificationOptions = {
//           body: payload.notification?.body || "You have a new notification",
//           icon: "/icon-512x512.png",
//         };

//         new Notification(notificationTitle, notificationOptions);
//       }
//     });

//     return app;
//   } catch (error) {
//     console.error("Error initializing Firebase:", error);
//     throw error;
//   }
// }

// // Request notification permission
// export async function requestNotificationPermission(): Promise<NotificationPermission> {
//   if (!("Notification" in window)) {
//     throw new Error("This browser does not support notifications");
//   }

//   validateFirebaseConfig();

//   if (Notification.permission === "granted") {
//     return "granted";
//   }

//   const permission = await Notification.requestPermission();
//   return permission;
// }

// // Subscribe to a topic
// export async function subscribeToTopic(topic: string) {
//   validateFirebaseConfig();

//   if (!messaging) {
//     return alert("Firebase configuration is not set");
//   }

//   try {
//     if (!process?.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
//       return alert("No vapid key is found");
//     }

//     const currentToken = await getToken(messaging, {
//       vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
//     });

//     if (!currentToken) {
//       throw new Error("No registration token available");
//     }

//     console.log("FCM Token:", currentToken);

//     // In a real app, you would send this token to your server
//     // to subscribe to a specific topic
//     console.log(`Subscribed to topic: ${topic}`);

//     return currentToken;
//   } catch (error) {
//     console.error("Error subscribing to topic:", error);
//     throw error;
//   }
// }

// // Send a test notification
// export async function sendTestNotification(title: string, body: string) {
//   // In a real app, you would call your backend API to send a notification
//   // For this example, we'll simulate it with a timeout
//   return new Promise<void>((resolve) => {
//     setTimeout(() => {
//       if ("Notification" in window && Notification.permission === "granted") {
//         const notification = new Notification(title, {
//           body,
//           icon: "/icon-512x512.png",
//         });

//         notification.onclick = () => {
//           window.focus();
//           notification.close();
//         };
//       }

//       resolve();
//     }, 1000);
//   });
// }
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
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
    console.log("messaging", messaging);
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
        "No registration token available. Request permission to generate one."
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
      notificationOptions
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
  data?: any
) {
  try {
    const response = await fetch("/api/push-notifications", {
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
