import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, BroadcastUpdatePlugin, StaleWhileRevalidate } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  // precacheOptions: {
  //   cleanupOutdatedCaches: true,
  // },
  // skipWaiting: true,
  // clientsClaim: true,
  // navigationPreload: true,
  // runtimeCaching: [
  //   ...defaultCache,

  // ],
  // offlineAnalyticsConfig: true,
  // disableDevLogs: true,
  // importScripts: ["/custom-sw.js"],
  // fallbacks: {
  //   entries: [
  //     {
  //       url: "/offline",
  //       matcher({ request }) {
  //         return request.destination === "document";
  //       },
  //     },
  //   ],
  // },
});

serwist.registerCapture(
  ({ url }) => url.pathname.includes("/api/"),
  new StaleWhileRevalidate({
    plugins: [new BroadcastUpdatePlugin()],
  })
);

self.addEventListener("message", async (event) => {
  // Optional: ensure the message came from Serwist
  console.log(event.data);
  if (
    event.data?.meta === "serwist-broadcast-update" &&
    event.data?.type === "CACHE_UPDATED"
  ) {
    const { cacheName, updatedURL } = event.data.payload || {};
    console.log(cacheName, updatedURL);
    // Do something with cacheName and updatedURL.
    // For example, get the cached content and update
    // the content on the page.

    if (!cacheName || !updatedURL) {
      return;
    }

    const cache = await caches.open(cacheName);
    const updatedResponse = await cache.match(updatedURL);
    if (!updatedResponse) {
      return;
    }

    const updatedText = await updatedResponse.text();
    console.log(updatedText);
  }
});

serwist.addEventListeners();
