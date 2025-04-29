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

  // runtimeCaching: [...defaultCache],
  skipWaiting: true,
  clientsClaim: true,
  // offlineAnalyticsConfig: true,
  // disableDevLogs: true,
  // importScripts: ["/custom-sw.js"],
  // fallbacks: {
  //   entries: [
  //     {
  //     url: "/offline",
  //     matcher({ request }) {
  //       return request.destination === "document";
  //     },
  //   },
  // ],
  // },
});

serwist.registerRoute({
  method: "GET",
  match: ({ url }) => {
    console.log(
      "[Service Worker] Checking if URL matches API route:",
      url.pathname
    );
    return url.pathname.startsWith("/");
  },
  handler: {
    handle: async ({ request, event }) => {
      event.waitUntil(
        Promise.resolve().then(() => {
          console.log("[Service Worker] Handling API request:", request.url);
        })
      );
      const cache = await caches.open("api-cache");
      const cachedResponse = await cache.match(request);

      if (cachedResponse) {
        console.log(
          "[Service Worker] Returning cached response for:",
          request.url
        );
        return cachedResponse;
      }

      console.log(
        "[Service Worker] No cache hit, fetching from network:",
        request.url
      );
      const response = await fetch(request);

      if (response.ok) {
        console.log(
          "[Service Worker] Caching successful response for:",
          request.url
        );
        await cache.put(request, response.clone());
      } else {
        console.warn(
          "[Service Worker] Failed to fetch from network:",
          request.url,
          response.status
        );
      }

      return response;
    },
  },
  setCatchHandler: async () => {
    console.error(
      "[Service Worker] API request failed, returning fallback response"
    );
    return new Response(JSON.stringify({ error: "Service unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  },
});

serwist.addEventListeners();
