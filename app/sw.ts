import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

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
    concurrency: 10,
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  offlineAnalyticsConfig: true,
  disableDevLogs: true,
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

// Configure fetch options for precache strategy
serwist.precacheStrategy.fetchOptions = {
  // Force caching of responses
  cache: "force-cache",
  // Add custom headers
  headers: {
    "X-Custom-Header": "value",
  },
  // Set credentials mode
  credentials: "same-origin",
  // Set redirect mode
  redirect: "follow",
  // Set referrer policy
  referrerPolicy: "no-referrer",
};

// Set custom cache name
serwist.precacheStrategy.cacheName = "precache-v1";

// Add plugins for advanced caching behavior
serwist.precacheStrategy.plugins.push(
  // Plugin to modify response before caching
  {
    cacheWillUpdate: async ({ response }) => {
      // Only cache successful responses
      if (response.status === 200) {
        console.log("cacheWillUpdate", response);

        return response;
      }
      return null;
    },
  },
  // Plugin to handle cache updates
  {
    cacheDidUpdate: async ({
      cacheName,
      request,
      oldResponse,
      newResponse,
    }) => {
      // Log cache updates
      console.log(
        `Cache ${cacheName} updated for ${request.url} old ${oldResponse} new ${newResponse}`
      );
    },
  }
);

serwist.addEventListeners();
