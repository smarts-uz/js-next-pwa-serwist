"use client";

import { useEffect } from "react";
import { registerSW } from "@/lib/pwa-utils";
import { messageSW } from "@serwist/window";

export default function PWASetup() {
  useEffect(() => {
    const getSWVersion = async () => {
      const sw = await window.serwist.getSW();
      const swVersion = await messageSW(sw, {
        type: "GET_VERSION",
        data: { message: "hello" },
      });
      console.log("Service worker version:", swVersion);
    };
    getSWVersion();
  }, []);

  useEffect(() => {
    registerSW();

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
