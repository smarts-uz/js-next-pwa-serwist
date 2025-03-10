// Push notification utilities

const VAPID_PUBLIC_KEY = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"

// Convert a base64 string to Uint8Array for the push server key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Subscribe to push notifications
export async function subscribeToNotifications(): Promise<PushSubscription> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push notifications are not supported in this browser")
  }

  try {
    // Get the service worker registration
    const registration = await navigator.serviceWorker.ready

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    })

    // Send the subscription to the server
    await fetch("/api/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscription }),
    })

    return subscription
  } catch (error) {
    console.error("Error subscribing to push notifications:", error)
    throw error
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromNotifications(): Promise<boolean> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push notifications are not supported in this browser")
  }

  try {
    // Get the service worker registration
    const registration = await navigator.serviceWorker.ready

    // Get the push subscription
    const subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      return false
    }

    // Unsubscribe
    const result = await subscription.unsubscribe()

    // Notify the server
    if (result) {
      await fetch("/api/push", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription }),
      })
    }

    return result
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error)
    throw error
  }
}

// Send a test notification
export async function sendTestNotification(subscription: PushSubscription): Promise<Response> {
  return fetch("/api/push", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscription,
      message: "This is a test notification from the PWA example app!",
    }),
  })
}

