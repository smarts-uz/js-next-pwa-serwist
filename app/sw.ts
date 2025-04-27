import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  CacheableResponsePlugin,
  Serwist,
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
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200],
            headers: {
              "X-Is-Cacheable": "true",
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

serwist.addEventListeners();
