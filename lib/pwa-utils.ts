"use client";

import { Serwist } from "@serwist/window";

// Service Worker Registration
export async function registerSW() {
  if ("serviceWorker" in navigator) {
    try {
      const serwist = new Serwist("/sw.js", { scope: "/", type: "classic" });
      return void serwist.register();
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
}

// Check if the app is installed
export function isAppInstalled(): boolean {
  if (typeof window !== "undefined") {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    );
  }
  return false;
}
