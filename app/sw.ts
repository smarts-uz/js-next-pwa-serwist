/* eslint-disable @typescript-eslint/no-unused-vars */
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  Serwist,
  responsesAreSame,
  BROADCAST_UPDATE_DEFAULT_HEADERS,
  CacheExpiration,
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

const cacheName = "/api/test-response?status=200";

const expirationManager = new CacheExpiration(cacheName, {
  maxAgeSeconds: 60 * 1000,
  maxEntries: 10,
})
const openCache = await caches.open(cacheName);



// self.addEventListener("fetch", (event) => {
//   const request = event.request;

//   if (request.url.includes("/api/test-copy")) {
//     event.respondWith(
//       (async () => {
//         const cacheName = "test-copy-cache";
//         const cache = await caches.open(cacheName);

//         const cachedResponse = await cache.match(request);

//         const fetchPromise = fetch(request);
//         const freshResponse = await fetchPromise;

//         await cache.put(request, freshResponse.clone());

//         if (cachedResponse) {
//           const headersToCompare = BROADCAST_UPDATE_DEFAULT_HEADERS;

//           const areResponsesSame = responsesAreSame(
//             cachedResponse,
//             freshResponse.clone(),
//             headersToCompare,
//           );

//           if (!areResponsesSame) {
//             const clients = await self.clients.matchAll({ type: "window" });
//             for (const client of clients) {
//               client.postMessage({
//                 type: "CACHE_UPDATED",
//                 message: "Cache content has been updated with new data",
//                 url: request.url,
//                 timestamp: new Date().toISOString(),
//                 headers: headersToCompare,
//                 areResponsesSame: false,
//               });
//             }
//           } else {
//             const clients = await self.clients.matchAll({ type: "window" });
//             for (const client of clients) {
//               client.postMessage({
//                 type: "CACHE_UPDATED",
//                 message: "Cache content is up to date",
//                 url: request.url,
//                 timestamp: new Date().toISOString(),
//                 headers: headersToCompare,
//                 areResponsesSame: true,
//               });
//             }
//           }
//         }

//         return freshResponse;
//       })(),
//     );
//   }
// });

serwist.addEventListeners();
