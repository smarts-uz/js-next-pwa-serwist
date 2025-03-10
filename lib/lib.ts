// IndexedDB wrapper for offline data storage

const DB_NAME = "pwa-data"
const DB_VERSION = 1
const SYNC_STORE = "sync-requests"

let db: IDBDatabase | null = null

// Initialize the database
export async function initDB(): Promise<IDBDatabase> {
  if (db) return db

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      console.error("Error opening IndexedDB:", event)
      reject("Error opening IndexedDB")
    }

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create object stores
      if (!db.objectStoreNames.contains(SYNC_STORE)) {
        const store = db.createObjectStore(SYNC_STORE, { keyPath: "id", autoIncrement: true })
        store.createIndex("timestamp", "timestamp", { unique: false })
        store.createIndex("status", "status", { unique: false })
      }
    }
  })
}

// Save data for background sync
export async function saveDataForSync(data: any): Promise<number> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([SYNC_STORE], "readwrite")
    const store = transaction.objectStore(SYNC_STORE)

    const request = store.add({
      data,
      timestamp: new Date().toISOString(),
      status: "pending",
    })

    request.onsuccess = () => {
      // Notify about the update
      const channel = new BroadcastChannel("sync-updates")
      channel.postMessage({ type: "sync-updated" })
      channel.close()

      // Trigger background sync if available
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.sync
            .register("sync-data")
            .catch((err) => console.error("Background sync registration failed:", err))
        })
      }

      resolve(request.result as number)
    }

    request.onerror = () => {
      reject("Error saving data for sync")
    }
  })
}

// Get all pending sync requests
export async function getPendingSyncRequests(): Promise<number> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([SYNC_STORE], "readonly")
    const store = transaction.objectStore(SYNC_STORE)
    const index = store.index("status")

    const request = index.count("pending")

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject("Error getting pending sync requests")
    }
  })
}

// Get all pending sync requests data
export async function getPendingSyncRequestsData(): Promise<any[]> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([SYNC_STORE], "readonly")
    const store = transaction.objectStore(SYNC_STORE)
    const index = store.index("status")

    const request = index.getAll("pending")

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject("Error getting pending sync requests data")
    }
  })
}

// Mark a sync request as completed
export async function markSyncRequestComplete(id: number): Promise<void> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([SYNC_STORE], "readwrite")
    const store = transaction.objectStore(SYNC_STORE)

    const getRequest = store.get(id)

    getRequest.onsuccess = () => {
      const data = getRequest.result
      if (data) {
        data.status = "completed"
        const updateRequest = store.put(data)

        updateRequest.onsuccess = () => {
          // Notify about the update
          const channel = new BroadcastChannel("sync-updates")
          channel.postMessage({ type: "sync-updated" })
          channel.close()

          resolve()
        }

        updateRequest.onerror = () => {
          reject("Error updating sync request")
        }
      } else {
        reject("Sync request not found")
      }
    }

    getRequest.onerror = () => {
      reject("Error getting sync request")
    }
  })
}

