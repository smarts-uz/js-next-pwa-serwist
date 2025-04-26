import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { NavigationRoute, Serwist } from "serwist";

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
  runtimeCaching: [...defaultCache],
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

// get all urls from serwist & log them
const urls = serwist.getPrecachedUrls();
console.log(urls);

const result = serwist.registerRoute(
  new NavigationRoute(
    serwist.createHandlerBoundToUrl("http://localhost:3001/offline"),
    {
      allowlist: [],
      denylist: [],
    }
  )
);
console.log(result);

serwist.addEventListeners();
