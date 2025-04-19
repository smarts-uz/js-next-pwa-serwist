"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, Upload } from "lucide-react";

interface UploadFile {
  id: string;
  name: string;
  size: number;
  status: "pending" | "completed" | "failed";
  timestamp: Date;
}

export function BackgroundSyncExample() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "completed"
  >("idle");

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for upload completion messages
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "UPLOAD_COMPLETE") {
        setFiles((prev) =>
          prev.map((file) =>
            file.id === event.data.fileId
              ? { ...file, status: "completed" }
              : file
          )
        );
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

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
        } else {
          // File was uploaded immediately
          setFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id ? { ...f, status: "completed" } : f
            )
          );
        }
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === newFile.id ? { ...f, status: "failed" } : f
          )
        );
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
