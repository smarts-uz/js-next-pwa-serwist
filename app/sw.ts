import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, BackgroundSyncQueue } from "serwist";

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

// Create a background sync queue for file uploads
const uploadQueue = new BackgroundSyncQueue("uploadQueue", {
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        const response = await fetch(entry.request);
        if (!response.ok) throw new Error("Upload failed");
        
        // Notify clients about successful upload
        const clients = await self.clients.matchAll();
        const uploadData = await entry.request.json();
        clients.forEach((client) => {
          client.postMessage({
            type: "UPLOAD_COMPLETE",
            fileId: uploadData.fileId,
            fileName: uploadData.fileName,
          });
        });
      } catch (error) {
        // Put the request back in the queue if it fails
        await queue.unshiftRequest(entry);
        throw error;
      }
    }
  },
});

// Handle fetch events for file uploads
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/upload")) {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(event.request.clone());
          return response;
        } catch (error) {
          // Queue the upload for background sync
          await uploadQueue.pushRequest({ request: event.request });
          return new Response(JSON.stringify({ queued: true }), {
            status: 202,
            headers: { "Content-Type": "application/json" },
          });
        }
      })()
    );
  }
});

serwist.addEventListeners()
