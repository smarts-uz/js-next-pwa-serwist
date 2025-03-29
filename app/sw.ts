import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, CacheFirst } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your `injectionPoint`.
    // `injectionPoint` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    navigateFallbackAllowlist: [/^\/.*$/],
    cleanupOutdatedCaches: true,
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  // runtimeCaching: defaultCache,
  runtimeCaching: [
    {
      matcher: ({ request }) => request.destination === "style",
      handler: new CacheFirst(),
    },
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  }
});

// Handle navigation preload
self.addEventListener('fetch', (event) => {
  if (event.preloadResponse) {
    event.respondWith(
      event.preloadResponse.then((preloadResponse) => {
        if (preloadResponse) {
          return preloadResponse;
        }
        return fetch(event.request);
      })
    );
  }
});

// Ensure all pages are precached during installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      self.skipWaiting(),
      serwist.handleInstall(event),
    ])
  );
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      serwist.handleActivate(event),
    ])
  );
});
