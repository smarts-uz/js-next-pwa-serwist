import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, StorableRequest } from "serwist";

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

// create a storable request example

const request = new Request("/offline");
const storableRequest = await StorableRequest.fromRequest(request);

const objectRequest = storableRequest.toObject();
console.log("objectRequest", objectRequest);
const parsedRequest = new StorableRequest(objectRequest).toRequest();
console.log("parsedRequest", parsedRequest);

serwist.addEventListeners();
