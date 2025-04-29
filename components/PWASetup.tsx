"use client";

import { useEffect } from "react";
import { registerSW } from "@/lib/registerServiceWorker";

export default function PWASetup() {
  useEffect(() => {
    registerSW();
  }, []);

  useEffect(() => {
    // Register protocol handler
    if ("navigator" in window && "registerProtocolHandler" in navigator) {
      try {
        navigator.registerProtocolHandler(
          "web+pwa",
          `${window.location.origin}/features/protocol-handler?url=%s`
        );
      } catch (error) {
        console.error("Failed to register protocol handler:", error);
      }
    }
  }, []);

  return null;
}
