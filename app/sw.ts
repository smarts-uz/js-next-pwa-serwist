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
    concurrency: 10,
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

serwist.addToPrecacheList([
  {
    url: "/offline",
    revision: crypto.randomUUID(),
  },
]);

// const serwist = new Serwist(options);

// const urlsToPrecache = ["/", "/foo", "/bar"] as const;

// self.addEventListener("install", (event) => {
//   const requestPromises = Promise.all(
//     urlsToPrecache.map((entry) => {
//       return serwist.handleRequest({ request: new Request(entry), event });
//     }),
//   );

//   event.waitUntil(requestPromises);
// });

// serwist.addEventListeners();

// serwist.addEventListeners();
