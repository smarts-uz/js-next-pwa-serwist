import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, PrecacheFallbackPlugin, NetworkOnly } from "serwist";
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
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,

  offlineAnalyticsConfig: true,
  // disableDevLogs: true,
  importScripts: ["/custom-sw.js"],
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
  /^\/$/,
  new NetworkOnly({
    plugins: [
      new PrecacheFallbackPlugin({
        fallbackUrls: ["/offline"],
        serwist,
      }),
    ],
  })
);

serwist.addEventListeners();
