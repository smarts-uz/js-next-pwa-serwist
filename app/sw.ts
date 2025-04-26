import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, CacheFirst } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// const serwist = new Serwist({
//   precacheEntries: self.__SW_MANIFEST,
//   precacheOptions: {
//     cleanupOutdatedCaches: true,
//   },
//   skipWaiting: true,
//   clientsClaim: true,
//   navigationPreload: true,
//   runtimeCaching: [...defaultCache],
//   offlineAnalyticsConfig: true,
//   disableDevLogs: true,
//   importScripts: ["/custom-sw.js"],
//   fallbacks: {
//     entries: [
//       {
//         url: "/offline",
//         matcher({ request }) {
//           return request.destination === "document";
//         },
//       },
//     ],
//   },
// });
const serwist = new Serwist({ precacheEntries: self.__SW_MANIFEST });

serwist.registerCapture(({ request, sameOrigin }) => {
  console.log("request", request);
  return sameOrigin && request.destination === "document";
}, new CacheFirst());

serwist.addEventListeners();
