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

// add all requests from

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
        return response;
      }
      return null;
    },
  },
  // Plugin to modify cached response before use
  {
    cachedResponseWillBeUsed: async ({ cachedResponse }) => {
      // Add custom header to cached response
      const cachedRes = cachedResponse as Response;

      const headers = new Headers(cachedRes.headers);
      headers.set("X-Cached-Response", "true");
      return new Response(cachedRes.body, {
        status: cachedRes.status,
        statusText: cachedRes.statusText,
        headers,
      });
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

// Custom handler for precache strategy
serwist.precacheStrategy.handle = async ({ request }) => {
  try {
    // Try to get response from cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If not in cache, fetch from network
    const response = await fetch(request);

    // Cache the response if successful
    if (response.status === 200) {
      const cache = await caches.open(serwist.precacheStrategy.cacheName);
      await cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Return offline fallback if fetch fails
    return new Response("Offline fallback content", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

serwist.addEventListeners();
