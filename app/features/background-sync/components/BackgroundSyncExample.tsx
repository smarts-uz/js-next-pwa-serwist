"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, Upload, RefreshCw } from "lucide-react";

interface UploadFile {
  id: string;
  name: string;
  size: number;
  status: "pending" | "completed" | "failed";
  timestamp: Date;
}

// IndexedDB setup for storing offline uploads
const DB_NAME = "offlineUploadsDB";
const STORE_NAME = "pendingUploads";

const openDatabase = (): Promise<IDBDatabase> => {
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

const saveToIndexedDB = async (fileData: any): Promise<void> => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(fileData);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const getPendingUploads = async (): Promise<any[]> => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const removeFromIndexedDB = async (id: string): Promise<void> => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export function BackgroundSyncExample() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "completed"
  >("idle");

  const loadPendingUploads = async () => {
    try {
      const pendingUploads = await getPendingUploads();
      if (pendingUploads.length > 0) {
        setFiles((prev) => {
          // Merge with existing files, avoiding duplicates
          const existingIds = new Set(prev.map((f) => f.id));
          const newFiles = pendingUploads.filter((f) => !existingIds.has(f.id));
          return [...prev, ...newFiles];
        });
      }
    } catch (error) {
      console.error("Failed to load pending uploads:", error);
    }
  };

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger a background sync when back online
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.sync.register("myQueueName").catch((err) => {
            console.error("Background sync registration failed:", err);
          });
        });
      }
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for upload completion messages from the service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "UPLOAD_COMPLETE" && event.data?.fileId) {
        setFiles((prev) =>
          prev.map((file) =>
            file.id === event.data.fileId
              ? { ...file, status: "completed" }
              : file
          )
        );
        // Remove the completed upload from IndexedDB
        removeFromIndexedDB(event.data.fileId).catch(console.error);
      } else if (event.data?.type === "SYNC_COMPLETE") {
        setUploadStatus("completed");
        // Refresh the file list to update statuses
        loadPendingUploads();
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    // Load any pending uploads from IndexedDB
    loadPendingUploads();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setUploadStatus("uploading");
    const filesArray = Array.from(selectedFiles);

    for (const file of filesArray) {
      const newFile: UploadFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        status: "pending",
        timestamp: new Date(),
      };

      setFiles((prev) => [...prev, newFile]);

      // If offline, store the file data for later upload
      if (!navigator.onLine) {
        try {
          // Convert file to ArrayBuffer to store in IndexedDB
          const arrayBuffer = await file.arrayBuffer();
          await saveToIndexedDB({
            ...newFile,
            file: arrayBuffer,
            type: file.type,
          });
          continue; // Skip the fetch attempt when offline
        } catch (error) {
          console.error("Failed to save file for offline upload:", error);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id ? { ...f, status: "failed" } : f
            )
          );
          continue;
        }
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileId", newFile.id);
      formData.append("fileName", file.name);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();
        if (data.queued) {
          // File was queued for background sync
          setFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id ? { ...f, status: "pending" } : f
            )
          );

          // Store in IndexedDB for persistence
          const arrayBuffer = await file.arrayBuffer();
          await saveToIndexedDB({
            ...newFile,
            file: arrayBuffer,
            type: file.type,
          });
        } else {
          // File was uploaded immediately
          setFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id ? { ...f, status: "completed" } : f
            )
          );
        }
      } catch (error) {
        console.error("Upload error:", error);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === newFile.id ? { ...f, status: "failed" } : f
          )
        );

        // If there was an error and we're online, it might be a server issue
        // Still store it for retry with background sync
        if (navigator.onLine) {
          try {
            const arrayBuffer = await file.arrayBuffer();
            await saveToIndexedDB({
              ...newFile,
              file: arrayBuffer,
              type: file.type,
            });
          } catch (dbError) {
            console.error("Failed to save failed upload:", dbError);
          }
        }
      }
    }

    setUploadStatus("completed");
  };

  const handleSyncNow = async () => {
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register("myQueueName");
      } catch (err) {
        console.error("Manual sync registration failed:", err);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileSelect}
            multiple
          />
          <label htmlFor="file-upload">
            <Button asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Select Files
              </span>
            </Button>
          </label>
          {!isOnline && files.some((file) => file.status === "pending") && (
            <Button variant="outline" onClick={handleSyncNow}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync When Online
            </Button>
          )}
        </div>
        <Badge variant={isOnline ? "default" : "destructive"}>
          {isOnline ? "Online" : "Offline"}
        </Badge>
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <Card key={file.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {file.status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : file.status === "failed" ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-500" />
                )}
                <div>
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {file.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {uploadStatus === "uploading" && (
        <div className="text-sm text-muted-foreground">Uploading files...</div>
      )}
      {uploadStatus === "completed" && (
        <div className="text-sm text-green-500">
          All files uploaded successfully!
        </div>
      )}
    </div>
  );
}
