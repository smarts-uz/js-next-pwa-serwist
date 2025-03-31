import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  Serwist,
  NetworkFirst,
  NavigationRoute,
  disableNavigationPreload,
  isNavigationPreloadSupported,
  enableNavigationPreload,
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

// Debug logging
const debug = (...args: any[]) => {
  console.log('[Service Worker]', ...args);
};

// Store navigation preload state
let navigationPreloadEnabled = true;

// Log service worker startup
debug('Service Worker starting up');

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

// Handle messages from clients
self.addEventListener("message", (event) => {
  debug('Received message:', event.data);
  
  if (event.data && event.data.type === "TOGGLE_NAV_PRELOAD") {
    debug('Handling TOGGLE_NAV_PRELOAD message');
    
    event.waitUntil(
      (async () => {
        try {
          if (isNavigationPreloadSupported()) {
            debug('Navigation preload is supported');
            
            // Toggle the state
            navigationPreloadEnabled = !navigationPreloadEnabled;
            debug('New navigation preload state:', navigationPreloadEnabled);
            
            if (navigationPreloadEnabled) {
              debug('Enabling navigation preload');
              await enableNavigationPreload();
            } else {
              debug('Disabling navigation preload');
              await disableNavigationPreload();
            }
            
            // Verify the state change
            const state = await self.registration.navigationPreload.getState();
            debug('Verified state:', state);
            
            // Notify all clients about the state change
            const clients = await self.clients.matchAll();
            debug('Notifying clients:', clients.length);
            
            clients.forEach(client => {
              client.postMessage({ 
                type: 'NAV_PRELOAD_STATE_CHANGED',
                enabled: navigationPreloadEnabled
              });
            });
          } else {
            debug('Navigation preload is not supported');
          }
        } catch (error) {
          debug('Error toggling navigation preload:', error);
          console.error('Failed to toggle navigation preload:', error);
        }
      })()
    );
  }
});

// Initialize navigation preload on install
self.addEventListener('install', (event) => {
  debug('Service Worker installing');
  event.waitUntil(
    (async () => {
      if (isNavigationPreloadSupported()) {
        debug('Enabling navigation preload on install');
        navigationPreloadEnabled = true;
        await enableNavigationPreload();
      }
    })()
  );
});

// Log when service worker is activated
self.addEventListener('activate', (event) => {
  debug('Service Worker activated');
});

// Swap in NetworkOnly, CacheFirst, or StaleWhileRevalidate as needed.
const navigationStrategy = new NetworkFirst({
  cacheName: "cached-navigations",
});

const navigationRoute = new NavigationRoute(navigationStrategy, {
  allowlist: [
    /^\/$/,
    /^\/features\/.*$/,
    /^\/api\/.*$/,
  ],
  denylist: [
    /^\/admin\/.*$/,
    /^\/auth\/.*$/,
    /^\/api\/private\/.*$/,
  ],
});

serwist.registerRoute(navigationRoute);
serwist.addEventListeners();
