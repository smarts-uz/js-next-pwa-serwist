"use client"

import { useEffect } from "react"
import { registerSW } from "@/lib/pwa-utils"

export default function PWASetup() {
  useEffect(() => {
    // Register service worker
    registerSW()

    // Register protocol handler
    if ("navigator" in window && "registerProtocolHandler" in navigator) {
      try {
        navigator.registerProtocolHandler(
          "web+pwa",
          `${window.location.origin}/features/protocol-handler?url=%s`,
          "Next.js PWA",
        )
      } catch (error) {
        console.error("Failed to register protocol handler:", error)
      }
    }
  }, [])

  return null
}

