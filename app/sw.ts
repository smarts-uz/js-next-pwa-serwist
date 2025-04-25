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

// Get all precached URLs and their corresponding cache keys
const precacheMap = serwist.getUrlsToPrecacheKeys();
const precachedUrls = serwist.getPrecachedUrls();

// Log the mapping for debugging purposes
console.log("Precached URLs and their cache keys:", precacheMap);
console.log("All precached URLs:", precachedUrls);

serwist.addEventListeners();
