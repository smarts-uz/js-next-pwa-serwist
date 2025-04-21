"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  FolderOpen,
  Save,
  FileText,
  AlertCircle,
  Trash2,
  Download,
  Upload,
} from "lucide-react";

declare global {
  interface Window {
    showOpenFilePicker: (
      options?: OpenFilePickerOptions
    ) => Promise<FileSystemFileHandle[]>;
    showSaveFilePicker: (
      options?: SaveFilePickerOptions
    ) => Promise<FileSystemFileHandle | null>;
  }
}

interface OpenFilePickerOptions {
  types?: FilePickerAcceptType[];
  multiple?: boolean;
}

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: FilePickerAcceptType[];
}

interface FilePickerAcceptType {
  description: string;
  accept: Record<string, string[]>;
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FileSystemExample() {
  const [fsSupported, setFsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("text");

  // Text file state
  const [textContent, setTextContent] = useState("");
  const [textFileName, setTextFileName] = useState("document.txt");
  const [textFileHandle, setTextFileHandle] =
    useState<FileSystemFileHandle | null>(null);

  // JSON file state
  const [jsonContent, setJsonContent] = useState<Record<string, any>>({
    name: "Example User",
    email: "user@example.com",
    preferences: {
      theme: "dark",
      fontSize: 16,
      notifications: true,
    },
  });
  const [jsonFileName, setJsonFileName] = useState("data.json");
  const [jsonFileHandle, setJsonFileHandle] =
    useState<FileSystemFileHandle | null>(null);

  // Check for File System Access API support
  useEffect(() => {
    setFsSupported("showOpenFilePicker" in window);
  }, []);

  // Open a text file
  const openTextFile = async () => {
    if (!fsSupported) return;

    try {
      setError(null);

      // Show file picker
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "Text Files",
            accept: {
              "text/plain": [".txt"],
            },
          },
        ],
        multiple: false,
      });

      // Get file data
      const file = await fileHandle.getFile();
      const content = await file.text();

      // Update state
      setTextFileHandle(fileHandle);
      setTextFileName(file.name);
      setTextContent(content);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Error opening text file:", err);
        setError(`Failed to open text file: ${err.message}`);
      }
    }
  };

  // Save a text file
  const saveTextFile = async () => {
    if (!fsSupported) return;

    try {
      setError(null);

      let fileHandle = textFileHandle;

      // If no file is open, show save dialog
      if (!fileHandle) {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: textFileName,
          types: [
            {
              description: "Text Files",
              accept: {
                "text/plain": [".txt"],
              },
            },
          ],
        });

        if (!fileHandle) {
          return alert("null");
        }

        setTextFileHandle(fileHandle);
        setTextFileName(fileHandle.name || textFileName);
      }

      // Create a writable stream and write the content
      const writable = await fileHandle.createWritable();
      await writable.write(textContent);
      await writable.close();
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Error saving text file:", err);
        setError(`Failed to save text file: ${err.message}`);
      }
    }
  };

  // Open a JSON file
  const openJsonFile = async () => {
    if (!fsSupported) return;

    try {
      setError(null);

      // Show file picker
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "JSON Files",
            accept: {
              "application/json": [".json"],
            },
          },
        ],
        multiple: false,
      });

      // Get file data
      const file = await fileHandle.getFile();
      const content = await file.text();

      // Parse JSON
      const jsonData = JSON.parse(content);

      // Update state
      setJsonFileHandle(fileHandle);
      setJsonFileName(file.name);
      setJsonContent(jsonData);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name !== "AbortError") {
          console.error("Error opening JSON file:", err);
          setError(
            err.name === "SyntaxError"
              ? "Invalid JSON file. The file could not be parsed."
              : `Failed to open JSON file: ${err.message}`
          );
        }
      }
    }
  };

  // Save a JSON file
  const saveJsonFile = async () => {
    if (!fsSupported) return;

    try {
      setError(null);

      let fileHandle = jsonFileHandle;

      // If no file is open, show save dialog
      if (!fileHandle) {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: jsonFileName,
          types: [
            {
              description: "JSON Files",
              accept: {
                "application/json": [".json"],
              },
            },
          ],
        });
        if (!fileHandle) return;
        setJsonFileHandle(fileHandle);
        setJsonFileName(fileHandle.name || jsonFileName);
      }

      // Create a writable stream and write the content
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(jsonContent, null, 2));
      await writable.close();
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Error saving JSON file:", err);
        setError(`Failed to save JSON file: ${err.message}`);
      }
    }
  };

  // Update JSON field
  const updateJsonField = (path: string, value: any) => {
    const pathParts = path.split(".");
    setJsonContent((prevJson) => {
      const newJson = { ...prevJson };
      let current = newJson;

      // Navigate to the nested object
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }

      // Update the value
      current[pathParts[pathParts.length - 1]] = value;
      return newJson;
    });
  };

  // Download file (fallback for browsers without File System Access API)
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Upload file (fallback for browsers without File System Access API)
  const uploadFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: "text" | "json"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;

      if (fileType === "text") {
        setTextFileName(file.name);
        setTextContent(content);
      } else {
        try {
          const jsonData = JSON.parse(content);
          setJsonFileName(file.name);
          setJsonContent(jsonData);
        } catch (err) {
          setError("Invalid JSON file. The file could not be parsed.");
        }
      }
    };

    reader.onerror = () => {
      setError(`Failed to read ${fileType} file`);
    };

    reader.readAsText(file);
  };

  if (!fsSupported) {
    return (
      <div className="space-y-6">
        <Alert variant="default" className="bg-yellow-950 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-200" />
          <AlertTitle className="text-yellow-100">
            File System Access API Not Supported
          </AlertTitle>
          <AlertDescription className="text-yellow-200">
            Your browser doesn't support the File System Access API. We'll use a
            fallback method instead.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text Files</TabsTrigger>
            <TabsTrigger value="json">JSON Files</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Text Editor</span>
                  <Badge variant="outline">{textFileName}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter text content here..."
                  className="min-h-[200px] font-mono"
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center">
                  <Input
                    type="file"
                    accept=".txt"
                    id="upload-text"
                    className="hidden"
                    onChange={(e) => uploadFile(e, "text")}
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("upload-text")?.click()
                    }
                    className="flex items-center"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
                <Button
                  onClick={() =>
                    downloadFile(textContent, textFileName, "text/plain")
                  }
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="json" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>JSON Editor</span>
                  <Badge variant="outline">{jsonFileName}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={jsonContent.name}
                      onChange={(e) => updateJsonField("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      value={jsonContent.email}
                      onChange={(e) => updateJsonField("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Theme</label>
                    <Input
                      value={jsonContent.preferences?.theme}
                      onChange={(e) =>
                        updateJsonField("preferences.theme", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Font Size</label>
                    <Input
                      type="number"
                      value={jsonContent.preferences?.fontSize}
                      onChange={(e) =>
                        updateJsonField(
                          "preferences.fontSize",
                          Number.parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center">
                  <Input
                    type="file"
                    accept=".json"
                    id="upload-json"
                    className="hidden"
                    onChange={(e) => uploadFile(e, "json")}
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("upload-json")?.click()
                    }
                    className="flex items-center"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
                <Button
                  onClick={() =>
                    downloadFile(
                      JSON.stringify(jsonContent, null, 2),
                      jsonFileName,
                      "application/json"
                    )
                  }
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Text Files</TabsTrigger>
          <TabsTrigger value="json">JSON Files</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Text Editor</span>
                {textFileHandle && (
                  <Badge variant="outline" className="flex items-center">
                    <FileText className="mr-1 h-3 w-3" />
                    {textFileName}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Enter text content here..."
                className="min-h-[200px] font-mono"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={openTextFile}
                  className="flex items-center"
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Open File
                </Button>
                {textFileHandle && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTextFileHandle(null);
                      setTextFileName("document.txt");
                      setTextContent("");
                    }}
                    className="flex items-center"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Close File
                  </Button>
                )}
              </div>
              <Button onClick={saveTextFile} className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save File
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="json" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>JSON Editor</span>
                {jsonFileHandle && (
                  <Badge variant="outline" className="flex items-center">
                    <FileText className="mr-1 h-3 w-3" />
                    {jsonFileName}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={jsonContent.name}
                    onChange={(e) => updateJsonField("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={jsonContent.email}
                    onChange={(e) => updateJsonField("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <Input
                    value={jsonContent.preferences?.theme}
                    onChange={(e) =>
                      updateJsonField("preferences.theme", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Size</label>
                  <Input
                    type="number"
                    value={jsonContent.preferences?.fontSize}
                    onChange={(e) =>
                      updateJsonField(
                        "preferences.fontSize",
                        Number.parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">JSON Preview</h4>
                  <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(jsonContent, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={openJsonFile}
                  className="flex items-center"
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Open File
                </Button>
                {jsonFileHandle && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setJsonFileHandle(null);
                      setJsonFileName("data.json");
                      setJsonContent({
                        name: "Example User",
                        email: "user@example.com",
                        preferences: {
                          theme: "dark",
                          fontSize: 16,
                          notifications: true,
                        },
                      });
                    }}
                    className="flex items-center"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Close File
                  </Button>
                )}
              </div>
              <Button onClick={saveJsonFile} className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save File
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-md bg-muted p-4">
        <h4 className="text-sm font-medium mb-2">How it works:</h4>
        <p className="text-sm text-muted-foreground">
          This example demonstrates using the File System Access API to read and
          write files directly from the user's file system. This API provides a
          secure way for web applications to interact with the local file
          system, enabling capabilities previously only available to native
          applications.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          The File System Access API allows web applications to:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mt-2">
          <li>Open files with a file picker</li>
          <li>Read and write to files</li>
          <li>Save files to specific locations</li>
          <li>Access directories and their contents</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-2">
          For browsers that don't support the File System Access API, this
          example falls back to using the traditional File API with
          download/upload functionality.
        </p>
      </div>
    </div>
  );
}
