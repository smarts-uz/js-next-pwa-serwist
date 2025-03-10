export async function registerSW() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered with scope:", registration.scope);

      // Set up background sync if supported
      if ("SyncManager" in window) {
        navigator.serviceWorker.ready.then((registration) => {
          // Register a sync event
          registration.sync
            .register("sync-data")
            .then(() => {
              console.log("Background sync registered");
            })
            .catch((err) => {
              console.error("Background sync registration failed:", err);
            });
        });
      }

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
}

export async function unregisterSW() {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const result = await registration.unregister();
      return result;
    }
    return false;
  }
  return false;
}
