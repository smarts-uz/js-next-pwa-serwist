import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  Serwist,
  responsesAreSame,
  BROADCAST_UPDATE_DEFAULT_HEADERS,
} from "serwist";

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

self.addEventListener("message", async (event) => {
  if (event.data?.type === "COMPARE_RESPONSES") {
    const { original, modified } = event.data.urls;

    try {
      const [originalResponse, modifiedResponse] = await Promise.all([
        fetch(original),
        fetch(modified),
      ]);

      const areEqual = responsesAreSame(
        originalResponse,
        modifiedResponse,
        BROADCAST_UPDATE_DEFAULT_HEADERS
      );

      const windows = await self.clients.matchAll({ type: "window" });
      for (const win of windows) {
        win.postMessage({
          type: "RESPONSE_COMPARISON",
          responsesEqual: areEqual,
          message: areEqual
            ? "Responses match exactly"
            : "Responses differ - headers or body content do not match",
        });
      }
    } catch (error) {
      console.error("Error comparing responses:", error);
      const windows = await self.clients.matchAll({ type: "window" });
      for (const win of windows) {
        win.postMessage({
          type: "RESPONSE_COMPARISON",
          responsesEqual: false,
          message: "Error comparing responses",
        });
      }
    }
  }
});

serwist.addEventListeners();
