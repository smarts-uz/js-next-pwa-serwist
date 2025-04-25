import { defaultCache } from "@serwist/next/worker";
import type {
  PrecacheEntry,
  SerwistGlobalConfig,
  Route,
  HTTPMethod,
} from "serwist";
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

// Example of a route that caches API responses
serwist.unregisterRoute({
  method: "GET",
  match: ({ url }) => url.pathname.startsWith("/"),
  handler: {
    handle: async ({ request, event }) => {
      const cache = await caches.open("api-cache");
      const cachedResponse = await cache.match(request);

      if (cachedResponse) return cachedResponse;

      const response = await fetch(request);

      if (response.ok) {
        event.waitUntil(cache.put(request, response.clone()));
      }

      return response;
    },
  },
  setCatchHandler: async () => {
    return new Response(JSON.stringify({ error: "Service unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  },
});

serwist.addEventListeners();
