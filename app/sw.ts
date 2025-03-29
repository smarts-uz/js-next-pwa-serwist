import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, CacheExpiration } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your `injectionPoint`.
    // `injectionPoint` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Set up cache expiration
const cacheExpiration = new CacheExpiration('api-cache-expiration', {
  maxEntries: 50, // Maximum number of entries to store
  maxAgeSeconds: 60, // 1 minute
});

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    navigateFallbackAllowlist: [/^\/.*$/],
    cleanupOutdatedCaches: true,
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
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

// Handle fetch events with cache expiration
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      (async () => {
        const cacheName = "api-cache";
        const cache = await caches.open(cacheName);
        
        // Check if the cached response is expired
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          const isExpired = await cacheExpiration.isURLExpired(event.request.url);
          if (!isExpired) {
            return cachedResponse;
          }
        }

        // Fetch new response if expired or not cached
        const newResponse = await fetch(event.request.clone());
        
        // Cache the new response with expiration
        await cache.put(event.request, newResponse.clone());
        await cacheExpiration.updateTimestamp(event.request.url);
        
        return newResponse;
      })()
    );
  }
});

serwist.addEventListeners();
