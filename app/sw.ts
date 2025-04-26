import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  Serwist,
  BackgroundSyncPlugin,
  NetworkFirst,
  NetworkOnly,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Create a background sync plugin with a reasonable retention time
const backgroundSync = new BackgroundSyncPlugin("myQueueName", {
  maxRetentionTime: 24 * 60, // Retry for a maximum of 24 Hours (specified in minutes)
  onSync: async () => {
    // This function is called when the sync event fires
    // The actual sync implementation is in custom-sw.js
    try {
      // Trigger the sync handler in custom-sw.js
      const syncEvent = new Event("sync") as any;
      syncEvent.tag = "myQueueName";
      self.dispatchEvent(syncEvent);
    } catch (error) {
      console.error("Error triggering custom sync handler:", error);
    }
  },
});

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true,
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    ...defaultCache,
    {
      // Route for API requests with background sync for offline support
      matcher: ({ request }) => request.url.includes("/api/upload"),
      handler: new NetworkOnly({
        plugins: [backgroundSync],
      }),
    },
    {
      matcher: ({ request }) => request.destination === "document",
      handler: new NetworkFirst(),
    },
  ],
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

serwist.addEventListeners();
