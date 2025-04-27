import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  Serwist,
  BroadcastUpdatePlugin,
  StaleWhileRevalidate,
  BROADCAST_UPDATE_DEFAULT_HEADERS,
} from "serwist";
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
  runtimeCaching: [
    {
      matcher: ({ url }) => url.pathname.includes("api"),
      handler: new StaleWhileRevalidate({
        plugins: [
          new BroadcastUpdatePlugin({
            headersToCheck: [
              ...BROADCAST_UPDATE_DEFAULT_HEADERS,
              "X-Serwist-Broadcast-Update",
              "X-Response-Status",
              "X-API-Key",
              "X-Timestamp",
              "X-Expires-At"
            ],
          }),
        ],
      }),
    },
  ],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  offlineAnalyticsConfig: true,
  // disableDevLogs: true,
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

serwist.addEventListeners();
