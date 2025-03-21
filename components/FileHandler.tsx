"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText, Save, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FileHandler() {
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(
    null,
  );
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(() => {
    if (typeof window !== "undefined") {
      return "showOpenFilePicker" in window;
    }
    return false;
  });

  const handleOpenFile = async () => {
    setError(null);
    setSuccess(null);

    try {
      // Show file picker
      // @ts-ignore
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: "Text Files",
            accept: {
              "text/plain": [
                ".txt",
                ".md",
                ".json",
                ".js",
                ".ts",
                ".html",
                ".css",
              ],
            },
          },
        ],
        multiple: false,
      });

      setFileHandle(handle);
      setFileName(handle.name);

      // Get file contents
      const file = await handle.getFile();
      const content = await file.text();
      setFileContent(content);

      setSuccess(`File "${handle.name}" opened successfully`);
    } catch (err) {
      console.error("Error opening file:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to open file");
      }
    }
  };

  const handleSaveFile = async () => {
    setError(null);
    setSuccess(null);

    if (!fileHandle) {
      setError("No file is currently open");
      return;
    }

    try {
      // Create a writable stream
      const writable = await fileHandle.createWritable();

      // Write the content
      await writable.write(fileContent);

      // Close the file
      await writable.close();

      setSuccess(`File "${fileName}" saved successfully`);
    } catch (err) {
      console.error("Error saving file:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to save file");
      }
    }
  };

  const handleCreateNewFile = async () => {
    setError(null);
    setSuccess(null);

    if (!newFileName) {
      setError("Please enter a file name");
      return;
    }

    try {
      // Show save file picker
      // @ts-ignore
      const handle = await window.showSaveFilePicker({
        suggestedName: newFileName.endsWith(".txt")
          ? newFileName
          : `${newFileName}.txt`,
        types: [
          {
            description: "Text File",
            accept: { "text/plain": [".txt"] },
          },
        ],
      });

      // Create a writable stream
      const writable = await handle.createWritable();

      // Write the content
      await writable.write(newFileContent);

      // Close the file
      await writable.close();

      setSuccess(`File "${handle.name}" created successfully`);
      setNewFileName("");
      setNewFileContent("");
    } catch (err) {
      console.error("Error creating file:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create file");
      }
    }
  };

  if (!isSupported) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Supported</AlertTitle>
        <AlertDescription>
          The File System Access API is not supported in your browser. Please
          use a Chromium-based browser like Chrome or Edge.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert
          variant="success"
          className="bg-green-950 text-green-200 border-green-200"
        >
          <FileText className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="open">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="open">Open & Edit File</TabsTrigger>
          <TabsTrigger value="create">Create New File</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button onClick={handleOpenFile} className="w-full sm:w-auto">
              <Upload className="mr-2 h-4 w-4" />
              Open File
            </Button>

            {fileName && (
              <p className="text-sm">
                Current file: <span className="font-medium">{fileName}</span>
              </p>
            )}
          </div>

          {fileHandle && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fileContent">File Content</Label>
                <Textarea
                  id="fileContent"
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              <Button onClick={handleSaveFile}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newFileName">File Name</Label>
            <Input
              id="newFileName"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Enter file name (e.g., notes.txt)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newFileContent">File Content</Label>
            <Textarea
              id="newFileContent"
              value={newFileContent}
              onChange={(e) => setNewFileContent(e.target.value)}
              rows={10}
              className="font-mono text-sm"
              placeholder="Enter file content here..."
            />
          </div>

          <Button onClick={handleCreateNewFile}>
            <Save className="mr-2 h-4 w-4" />
            Create File
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
