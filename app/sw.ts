import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true,
    concurrency: 10,
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  offlineAnalyticsConfig: true,
  disableDevLogs: true,
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

self.addEventListener("message", async (event) => {
  if (event.data.action === "cache-on-demand") {
    const cache = await caches.open("static-image-assets");
    const isCached = await cache.match("images/cache-me-outside.jpg");
    if (!isCached) {
      const res = await fetch("images/cache-me-outside.jpg");
      await cache.put("images/cache-me-outside.jpg", res);
    }
  }
  event.ports[0].postMessage(true);
});

serwist.addEventListeners();
// addEventListeners() {
//   self.addEventListener("install", this.handleInstall);
//   self.addEventListener("activate", this.handleActivate);
//   self.addEventListener("fetch", this.handleFetch);
//   self.addEventListener("message", this.handleCache);
// }
