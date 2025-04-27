import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
import { defaultCache } from "@serwist/next/worker";
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
  },

  runtimeCaching: [...defaultCache],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  offlineAnalyticsConfig: true,
  // disableDevLogs: true,
  importScripts: ["/custom-sw.js"],
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

self.addEventListener("fetch", async (event) => {
  // const cache = await caches.open(serwist.precacheStrategy.cacheName);
  const url = new URL(event.request.url);

  if (url.origin === location.origin && url.pathname === "/api/test-response") {
    event.respondWith(
      (async () => {
        const apiCache = await caches.open("api-cache");
        const cachedResponse = await apiCache.match(event.request);
        console.log("cachedResponse", cachedResponse);
        if (cachedResponse) {
          return cachedResponse;
        }

        const networkResponse = await fetch(event.request);

        // Only cache successful responses
        if (networkResponse.ok) {
          await apiCache.put(event.request, networkResponse.clone());
        }

        return networkResponse;
      })()
    );
  }
});

serwist.addEventListeners();
