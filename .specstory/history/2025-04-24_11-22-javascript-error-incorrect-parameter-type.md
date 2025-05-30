<!-- Generated by SpecStory -->

# JavaScript Error: Incorrect Parameter Type (2025-04-24 16:22:31)

_**User**_

waitUntil.js:228 Uncaught (in promise) incorrect-class: The parameter 'options.event' passed into 'serwist.StrategyHandler.constructor()' must be an instance of class ExtendableEvent.

---

_**Assistant**_



---

The error indicates you're trying to use `serwist.handleCache()` with an incorrectly typed parameter. The Serwist library expects a real `ExtendableEvent` instance, but you're passing a plain object with type casting.

Let's fix this by using the proper way to cache URLs in Serwist:

---

```diff
  
  declare const self: ServiceWorkerGlobalScope;
+ 
+ const additionalManifestEntries = [
+   "/",
+   "/offline",
+   "/manifest.json",
+   "/favicon.ico",
+   "/images/logo.png",
+ ];
  
  const serwist = new Serwist({
-   precacheEntries: self.__SW_MANIFEST,
+   precacheEntries: [...(self.__SW_MANIFEST || []), ...additionalManifestEntries],
    precacheOptions: {
      cleanupOutdatedCaches: true,
```

```diff
    },
  });
- 
- // handle cache event
- serwist.handleCache({
-   data: {
-     type: "CACHE_URLS",
-     payload: {
-       urlsToCache: [
-         "/",
-         "/offline",
-         "/manifest.json",
-         "/favicon.ico",
-         "/images/logo.png",
-       ],
-     },
-   },
- } as ExtendableMessageEvent);
  
  serwist.addEventListeners();
```

---

The issue was that you were manually calling `serwist.handleCache()` with a plain JavaScript object cast as an `ExtendableMessageEvent`. This isn't valid as Serwist expects a real event instance.

The correct approach is to include the URLs you want to cache in the precache configuration. I've moved your URLs from the manual cache call to the `additionalManifestEntries` array and added them to the `precacheEntries` in the Serwist configuration.

This way, Serwist will precache these URLs when the service worker installs, without needing the manual `handleCache()` call that was causing the error.

---

_**User**_

create an example with for serwist.handle Cache just a simple fone 

---

_**Assistant**_



---

Here's a simple example for using `serwist.handleCache()` correctly:

```typescript
// Example for properly using serwist.handleCache with a message event

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_URLS') {
    // Pass the actual event to handleCache
    serwist.handleCache(event);
  }
});
```

To fix your current code, update it like this:

---

```diff
  });
  
- // handle cache event
- serwist.handleCache({
-   data: {
-     type: "CACHE_URLS",
+ // Add message event listener to handle cache requests
+ self.addEventListener('message', (event) => {
+   if (event.data && event.data.type === 'CACHE_URLS') {
+     // Pass the actual event to handleCache
+     serwist.handleCache(event);
+   }
+ });
+ 
+ // Manually trigger caching important URLs
+ self.clients.matchAll().then(clients => {
+   if (clients && clients.length > 0) {
+     clients[0].postMessage({
+       type: 'CACHE_URLS',
        payload: {
          urlsToCache: [
```

```diff
          ],
        },
-   },
- } as ExtendableMessageEvent);
+     });
+   }
+ });
  
  serwist.addEventListeners();
- 
- // Example for properly using serwist.handleCache with a message event
- 
- self.addEventListener('message', (event) => {
-   if (event.data && event.data.type === 'CACHE_URLS') {
-     // Pass the actual event to handleCache
-     serwist.handleCache(event);
-   }
- });
  
```

---

The key issue was that `handleCache` expects a real event object, not a manually constructed object cast as an event. This solution:

1. Adds a proper event listener for 'message' events
2. Checks if the received message has the correct type ('CACHE_URLS')
3. Passes the actual event object to `handleCache`
4. Uses the `self.clients.matchAll()` API to find active clients and send a message to trigger caching

The service worker will now properly handle cache requests with real event objects instead of manually constructed ones, which should resolve the error you were encountering.

---

