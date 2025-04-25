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

import { CacheFirst } from "serwist";

serwist.registerCapture(
  /^\/features\/.*$/,
  new CacheFirst({
    cacheName: "features-cache",
    matchOptions: {
      ignoreSearch: true,
    },
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          if (response.status === 200) {
            return response;
          }
          return null;
        },
      },
    ],
  })
);

// Get the cache key for the offline page URL
const offlineUrl = "http://localhost:3001/offline";
const offlineCacheKey = serwist.getPrecacheKeyForUrl(offlineUrl);

// Log the cache key for debugging purposes
console.log(`Cache key for offline page:`, offlineCacheKey);

serwist.addEventListeners();
