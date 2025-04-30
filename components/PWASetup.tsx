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

  useEffect(() => {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.sync.register("/badge-sw.js");
        registration.sync.register("/periodic-sw.js");
        registration.sync.register("/custom-sw.js");
      });
      console.log("Service worker registered for badge sync");
    }
  }, []);

  return null;
}
