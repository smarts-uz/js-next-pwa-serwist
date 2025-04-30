// Cache name for storing sync data
const CACHE_NAME = 'periodic-sync-cache-v1';

// Handle periodic sync events
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

// Handle installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/api/test-response?status=200'
      ]);
    })
  );
});

const syncContent = async () => {
  try {
    // Fetch fresh data
    const response = await fetch('/api/test-response?status=200');
    const data = await response.json();

    // Notify clients about successful sync
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        data,
        timestamp: new Date().toISOString()
      });
    });

    console.log('Sync completed:', data);
  } catch (error) {
    console.error('Sync failed:', error);
  };


  // Handle client messages
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'GET_LAST_SYNC') {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then(cache => cache.match('last-sync'))
          .then(response => response ? response.text() : null)
          .then(timestamp => {
            event.source.postMessage({
              type: 'LAST_SYNC_RESPONSE',
              timestamp
            });
          })
      );
    }
  });
}
