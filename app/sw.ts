import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  Serwist,
  responsesAreSame,
  BROADCAST_UPDATE_DEFAULT_HEADERS,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your `injectionPoint`.
    // `injectionPoint` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    navigateFallbackAllowlist: [/^\/.*$/],
    cleanupOutdatedCaches: true,
  },
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: defaultCache,
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

// Add an event listener that runs on fetch events for the test-copy API
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle our specific test API
  if (request.url.includes("/api/test-copy")) {
    event.respondWith(
      (async () => {
        const cacheName = "test-copy-cache";
        const cache = await caches.open(cacheName);

        // Try to get from cache first
        const cachedResponse = await cache.match(request);

        // Always fetch a fresh response
        const fetchPromise = fetch(request);
        const freshResponse = await fetchPromise;

        // Store the fresh response in cache
        await cache.put(request, freshResponse.clone());

        // Compare cached and fresh responses if we had a cached one
        if (cachedResponse) {
          // Get the headers that are used for comparison
          const headersToCompare = BROADCAST_UPDATE_DEFAULT_HEADERS;

          // Check if responses are the same
          const areResponsesSame = responsesAreSame(
            cachedResponse,
            freshResponse.clone(),
            headersToCompare
          );

          // If responses are different, notify all clients
          if (!areResponsesSame) {
            const clients = await self.clients.matchAll({ type: "window" });
            for (const client of clients) {
              client.postMessage({
                type: "CACHE_UPDATED",
                message: "Cache content has been updated with new data",
                url: request.url,
                timestamp: new Date().toISOString(),
                headers: headersToCompare,
                areResponsesSame: false,
              });
            }
          } else {
            // Notify the responses are the same
            const clients = await self.clients.matchAll({ type: "window" });
            for (const client of clients) {
              client.postMessage({
                type: "CACHE_UPDATED",
                message: "Cache content is up to date",
                url: request.url,
                timestamp: new Date().toISOString(),
                headers: headersToCompare,
                areResponsesSame: true,
              });
            }
          }
        }

        // Return the fresh response
        return freshResponse;
      })()
    );
  }
});

serwist.addEventListeners();
