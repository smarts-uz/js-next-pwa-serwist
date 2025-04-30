// Badge API implementation for service worker
let badgeCount = 0;

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SET_BADGE') {
    handleSetBadge(event.data);
    console.log("Badge set to", event.data.count);
  }
});

// Listen for push notifications to update badge
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    if (data.badge) {
      handleSetBadge({ count: data.badge });
    }
    badgeCount++; // Increment badge for each notification
    handleSetBadge({ count: badgeCount });
  }
});

// Clear badge when notifications are clicked
self.addEventListener('notificationclick', () => {
  badgeCount = 0;
  handleSetBadge({ count: 0 });
});

// Handle badge updates
async function handleSetBadge(data) {
  try {
    if (!self.navigator.setAppBadge) {
      console.warn('Badge API not supported');
      return;
    }

    // Store the current badge count
    badgeCount = data.count;

    // Update badge
    if (data.count === 0) {
      await self.navigator.clearAppBadge();
    } else {
      await self.navigator.setAppBadge(data.count);
    }

    // Notify all clients about badge update
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'BADGE_UPDATED',
        count: data.count
      });
    });

  } catch (error) {
    console.error('Error setting badge:', error);
  }
}

// Sync badge count when coming back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-badge') {
    handleSetBadge({ count: badgeCount });
  }
});

// Example usage:
// From your application:
// navigator.serviceWorker.controller.postMessage({
//   type: 'SET_BADGE',
//   count: 5 // or 0 to clear
// });
//
// To register for background sync:
// navigator.serviceWorker.ready.then(registration => {
//   registration.sync.register('sync-badge');
// });
