import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  Serwist,
  BroadcastCacheUpdate,
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

// Set up broadcast cache updates
const broadcastUpdate = new BroadcastCacheUpdate({
  headersToCheck: [...BROADCAST_UPDATE_DEFAULT_HEADERS, "X-My-Custom-Header"],
});

// Handle fetch events for cache updates
self.addEventListener("fetch", (event) => {
  // Handle cache updates for API requests
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      (async () => {
        const cacheName = "api-cache";
        const cache = await caches.open(cacheName);
        const oldResponse = await cache.match(event.request);
        const newResponse = await fetch(event.request.clone());

        // Check and broadcast if the response has changed
        await broadcastUpdate.notifyIfUpdated({
          cacheName,
          oldResponse,
          newResponse,
          request: event.request,
          event,
        });

        // Cache the new response
        await cache.put(event.request, newResponse.clone());
        return newResponse;
      })()
    );
  }
});

// Listen for messages from clients
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

serwist.addEventListeners();
