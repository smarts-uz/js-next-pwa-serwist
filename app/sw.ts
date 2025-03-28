import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

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
  runtimeCaching: defaultCache,
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

// Ensure all pages are precached during installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open('pages-cache');
      const pages = [
        '/',
        '/offline',
        '/manifest.json',
        '/features/web-share',
        '/features/file-handling',
        '/features/local-storage',
        '/features/network-info',
        '/features/protocol-handler',
        '/features/background-fetch',
        '/features/audio',
        '/features/transitions',
        '/features/web-authentication',
        '/features/payment-request',
      ];
      await cache.addAll(pages);
    })()
  );
});

serwist.addEventListeners();