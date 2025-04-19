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

// const cacheName = "test-copy-cache-blah";
// const request = new Request("/api/test-copy");

// const cache = await caches.open(cacheName);
// const oldResponse = await cache.match(request);
// const newResponse = await fetch(request);

// await cache.put(request, newResponse.clone());

// console.log("2");
// if (
//   oldResponse &&
//   !responsesAreSame(oldResponse, newResponse, BROADCAST_UPDATE_DEFAULT_HEADERS)
// ) {
//   console.log("start");

//   const windows = await self.clients.matchAll({ type: "window" });
//   for (const win of windows) {
//     win.postMessage({
//       type: "CACHE_UPDATED",
//       message: "API response has been updated",
//       url: request.url,
//       timestamp: new Date().toISOString(),
//       headers: {
//         cachedHeaders: Object.fromEntries(oldResponse.headers.entries()),
//         freshHeaders: Object.fromEntries(newResponse.headers.entries()),
//         comparedHeaders: BROADCAST_UPDATE_DEFAULT_HEADERS,
//       },
//     });
//     console.log("done");
//     alert("Cache Updated");
//   }
// }

// Example: Compare cached and fresh responses from API
const cacheName = "test-copy-cache";
const request = new Request("/api/test-copy");
console.log("request", request);
// Try to get cached response
const cache = await caches.open(cacheName);
const cachedResponse = await cache.match(request);

// Fetch fresh response
const freshResponse = await fetch(request);

console.log("fresh", freshResponse);

// Store fresh response in cache
await cache.put(request, freshResponse.clone());

// Compare cached and fresh responses if we have both
console.log("cache-response", cachedResponse);
if (cachedResponse) {
  const responsesMatch = responsesAreSame(
    cachedResponse,
    freshResponse,
    BROADCAST_UPDATE_DEFAULT_HEADERS
  );
  console.log("response-match", responsesMatch);
  if (!responsesMatch) {
    // Notify all window clients about the update
    const windows = await self.clients.matchAll({ type: "window" });
    for (const win of windows) {
      win.postMessage({
        type: "CACHE_UPDATED",
        message: "API response has been updated",
        url: request.url,
        timestamp: new Date().toISOString(),
        // Add header comparison details
        headers: {
          cachedHeaders: Object.fromEntries(cachedResponse.headers.entries()),
          freshHeaders: Object.fromEntries(freshResponse.headers.entries()),
          comparedHeaders: BROADCAST_UPDATE_DEFAULT_HEADERS,
        },
      });
    }
  }
}

serwist.addEventListeners();
