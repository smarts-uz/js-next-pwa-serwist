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

// Handle fetch events with response copying
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/test-copy")) {
    event.respondWith(
      (async () => {
        try {
          // Fetch the original response
          const originalResponse = await fetch(event.request.clone());
          
          // Create a new response with modified headers
          const modifiedResponse = new Response(originalResponse.body, originalResponse);
          
          // Modify headers
          modifiedResponse.headers.set('x-cache', 'MISS');
          modifiedResponse.headers.set('x-modified-header', 'modified-value');
          modifiedResponse.headers.set('x-custom-header', 'modified-custom-value');
          
          return modifiedResponse;
        } catch (error) {
          throw error;
        }
      })()
    );
  }
});

serwist.addEventListeners();
