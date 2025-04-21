export async function registerSW() {
  if ("serviceWorker" in navigator) {
    try {
      // Check if service worker is already registered
      const existingRegistration =
        await navigator.serviceWorker.getRegistration();
      if (existingRegistration) {
        // If service worker is already active, reload to ensure precaching
        if (existingRegistration.active) {
          window.location.reload();
          return existingRegistration;
        }
      }

      // Register new service worker with Serwist
      const registration = await window.serwist.register();
      if (!registration) throw new Error("Service Worker registration failed");

      // Listen for service worker updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              window.location.reload();
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
}

export async function unregisterSW() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      return registration ? await registration.unregister() : false;
    } catch (error) {
      console.error("Service Worker unregistration failed:", error);
      return false;
    }
  }
  return false;
}
