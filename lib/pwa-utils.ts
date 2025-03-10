// Service Worker Registration
export async function registerSW() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js")
      console.log("Service Worker registered with scope:", registration.scope)
      return registration
    } catch (error) {
      console.error("Service Worker registration failed:", error)
    }
  }
}

// Check if the app is installed
export function isAppInstalled(): boolean {
  if (typeof window !== "undefined") {
    return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true
  }
  return false
}

// Get network connection type
export function getNetworkConnectionType(): string {
  if (typeof navigator !== "undefined" && navigator.connection) {
    return navigator.connection.type
  }
  return "unknown"
}

// Get effective connection type (4g, 3g, 2g, slow-2g)
export function getEffectiveConnectionType(): string {
  if (typeof navigator !== "undefined" && navigator.connection) {
    return navigator.connection.effectiveType
  }
  return "unknown"
}

// Check if the device is online
export function isOnline(): boolean {
  if (typeof navigator !== "undefined") {
    return navigator.onLine
  }
  return true
}

// Convert a base64 string to Uint8Array for the push server key
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

