self.addEventListener("message", async (event) => {
  if (event.data.action === "cache-on-demand") {
    const cache = await caches.open("static-image-assets");
    const isCached = await cache.match("images/cache-me-outside.jpg");
    if (!isCached) {
      const res = await fetch("images/cache-me-outside.jpg");
      await cache.put("images/cache-me-outside.jpg", res);
    }
  }
  event.ports[0].postMessage(true);
});

// IndexedDB setup for retrieving pending uploads
const DB_NAME = "offlineUploadsDB";
const STORE_NAME = "pendingUploads";

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

const getPendingUploads = async () => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const removePendingUpload = async (id) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Handle background sync
self.addEventListener("sync", async (event) => {
  if (event.tag === "myQueueName") {
    console.log("Background sync triggered:", event.tag);

    try {
      // Get the queued files from IndexedDB
      const pendingUploads = await getPendingUploads();
      console.log(`Found ${pendingUploads.length} pending uploads`);

      // Process each pending upload
      for (const upload of pendingUploads) {
        try {
          // Create a new Blob from the stored ArrayBuffer
          const fileBlob = new Blob([upload.file], { type: upload.type });

          // Create and send FormData with the file
          const formData = new FormData();
          formData.append("file", fileBlob, upload.name);
          formData.append("fileId", upload.id);
          formData.append("fileName", upload.name);

          // Attempt to upload the file
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData
          });

          if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
          }

          // If successful, remove from IndexedDB and notify clients
          await removePendingUpload(upload.id);

          // Notify all clients about this specific upload completion
          const clients = await self.clients.matchAll();
          clients.forEach(client => {
            client.postMessage({
              type: "UPLOAD_COMPLETE",
              fileId: upload.id,
              message: "File upload completed successfully"
            });
          });

          console.log(`Successfully synced file: ${upload.name}`);
        } catch (uploadError) {
          console.error(`Error syncing file ${upload.name}:`, uploadError);
          // We don't remove the file from IndexedDB so it can be retried later
        }
      }

      // Notify all clients that sync process is complete
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: "SYNC_COMPLETE",
          message: "Background sync completed"
        });
      });

      console.log("Background sync completed");
    } catch (error) {
      console.error("Error during background sync:", error);
      // The sync will be retried automatically based on the maxRetentionTime
    }
  }
});