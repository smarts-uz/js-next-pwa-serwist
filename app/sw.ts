import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  Serwist,
  ExpirationPlugin,
  CacheFirst,
  StaleWhileRevalidate,
} from "serwist";
import { defaultCache } from "@serwist/next/worker";

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
  skipWaiting: true,
  clientsClaim: true,
  // navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ url }) => url.pathname.includes("api"),
      handler: new StaleWhileRevalidate({
        cacheName: "my-api-cache",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 2,
            maxAgeSeconds: 6, // Changed from 5 to 6 seconds
            purgeOnQuotaError: true,
            maxAgeFrom: "last-fetched",
            matchOptions: {
              ignoreVary: true,
            },
          }),
        ],
      }),
    },
  ],
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

// add an event listener to check when cache is deleted

serwist.addEventListeners();
