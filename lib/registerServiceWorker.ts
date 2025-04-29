"use client";

declare const confirmUpdate: () => boolean;
import { Serwist } from "@serwist/window";
import type { BroadcastMessage } from "serwist";
import type { SerwistMessageEvent } from "@serwist/window";

export async function registerSW() {
  if (!("serviceWorker" in navigator)) return;

  const serwist = new Serwist("/sw.js", { scope: "/", type: "classic" });
  const SW_VERSION = "1.0.0";
  console.log("serwist", serwist);
  const handleWaiting = () => {
    console.log(
      "A new service worker has installed, but it can't activate until all tabs running the current version have fully unloaded."
    );

    serwist.addEventListener("controlling", location.reload);
    if (confirmUpdate()) {
      serwist.messageSkipWaiting();
    }
  };

  const handleMessage = (event: SerwistMessageEvent) => {
    if (
      event.data.meta === "serwist-broadcast-update" &&
      event.data.type === "CACHE_UPDATED"
    ) {
      const {
        payload: { updatedURL },
      }: BroadcastMessage = event.data;

      console.log(`A newer version of ${updatedURL} is available!`);
    }
  };

  const cacheUrls = () => {
    const urlsToCache = [
      location.href,
      ...performance.getEntriesByType("resource").map((r) => r.name),
    ];

    serwist.messageSW({
      type: "CACHE_URLS",
      payload: { urlsToCache },
    });
  };

  const handleSelfMessage = (event: MessageEvent) => {
    console.log("Received self message:", event.data);

    if (event.data?.type === "SKIP_WAITING") {
      self.skipWaiting();
    }

    if (event.data?.type === "GET_VERSION") {
      event.ports[0]?.postMessage(SW_VERSION);
    }
  };

  serwist.addEventListener("waiting", handleWaiting);
  serwist.addEventListener("message", handleMessage);
  self.addEventListener("message", handleSelfMessage);

  cacheUrls();
  void serwist.register();

  // Cleanup function
  return () => {
    serwist.removeEventListener("waiting", handleWaiting);
    serwist.removeEventListener("message", handleMessage);
    self.removeEventListener("message", handleSelfMessage);
  };
}
