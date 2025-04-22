import { CacheExpiration } from "serwist";

export default async function handleApiRequest(request: Request) {
  const cacheName = "api-responses";
  const cache = await caches.open(cacheName);

  // Create cache expiration instance
  const expirationManager = new CacheExpiration(cacheName, {
    maxAgeSeconds: 60, // 1 minute expiration
    maxEntries: 10, // Store max 10 entries
  });

  // Try to get from cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    // Check if the cached response is expired
    const isExpired = await expirationManager.isURLExpired(request.url);

    if (isExpired) {
      // Delete expired entry from cache
      await cache.delete(request);
      // Delete metadata from IndexedDB
      await expirationManager.delete();
      // Fetch fresh response
      const response = await fetch(request);
      if (response.ok) {
        await cache.put(request, response.clone());
        await expirationManager.updateTimestamp(request.url);
      }
      return response;
    }

    // Update timestamp and expire old entries
    await expirationManager.updateTimestamp(request.url);
    await expirationManager.expireEntries();
    return cachedResponse;
  }

  // If not in cache, fetch from network
  const response = await fetch(request);
  if (response.ok) {
    // Clone response before adding to cache
    await cache.put(request, response.clone());
    // Update expiration timestamp
    await expirationManager.updateTimestamp(request.url);
  }

  return response;
}
