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
// wrap in a listener
// The code example is demonstrating how to serialize/deserialize a Request object:
// Convert a Request to a StorableRequest
// Convert to a plain object (which can be stored in IndexedDB)
// Later reconstruct the original Request from the stored data
// This pattern enables reliable handling of network operations in offline-first Progressive Web Apps.
self.addEventListener("install", async () => {
  const request = new Request("/offline");
  const storableRequest = await StorableRequest.fromRequest(request);
  console.log("storableRequest", storableRequest);
  const objectRequest = storableRequest.toObject();
  console.log("objectRequest", objectRequest);
  const parsedRequest = new StorableRequest(objectRequest).toRequest();
  console.log("parsedRequest", parsedRequest);
});

serwist.addEventListeners();
