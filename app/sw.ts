import type {
  PrecacheEntry,
  SerwistGlobalConfig,
  SerwistPlugin,
} from "serwist";
import {
  Serwist,
  NetworkOnly,
  BackgroundSyncPlugin,
  BackgroundSyncQueue,
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
  precacheOptions: {
    cleanupOutdatedCaches: true,
  },
  runtimeCaching: [...defaultCache],
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

const queue = new BackgroundSyncQueue("myQueueName");

const statusPlugin = {
  fetchDidSucceed({ response }) {
    if (response.status >= 500) {
      // Throwing anything here will trigger fetchDidFail.
      throw new Error("Server error.");
    }
    // If it's not 5xx, use the response as-is.
    return response;
  },
} satisfies SerwistPlugin;

// const backgroundSync = new BackgroundSyncPlugin("myQueueName", {
//   maxRetentionTime: 24 * 60, // Retry for a maximum of 24 Hours (specified in minutes)
// });

serwist.registerCapture(
  /\/api\/.*\/*.json/,
  new NetworkOnly({
    plugins: [statusPlugin],
  }),
  "POST"
);

self.addEventListener("fetch", (event) => {
  // Add in your own criteria here to return early if this
  // isn't a request that should use background sync.
  if (event.request.method !== "POST") {
    return;
  }

  const backgroundSync = async () => {
    try {
      const response = await fetch(event.request.clone());
      console.log("response", response);
      return response;
    } catch (error) {
      await queue.pushRequest({ request: event.request });
      return Response.error();
    }
  };

  event.respondWith(backgroundSync());
});

serwist.addEventListeners();
