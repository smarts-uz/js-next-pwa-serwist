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

// Add message event listener to handle cache requests
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CACHE_URLS") {
    // Pass the actual event to handleCache
    console.log("event", event);
    serwist.handleCache(event);
  }
});

// Manually trigger caching important URLs
self.clients.matchAll().then((clients) => {
  if (clients && clients.length > 0) {
    console.log("clients", clients);
    clients[0].postMessage({
      type: "CACHE_URLS",
      payload: {
        urlsToCache: [
          "/",
          "/offline",
          "/manifest.json",
          "/favicon.ico",
          "/images/logo.png",
        ],
      },
    });
  }
});

serwist.addEventListeners();
