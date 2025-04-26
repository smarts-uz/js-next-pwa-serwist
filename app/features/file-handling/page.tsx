import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FileHandler from "@/components/FileHandler";

export default function FileHandlingPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">File Handling</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>File System Access API</CardTitle>
          <CardDescription>
            Open, edit, and save files directly from your web browser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileHandler />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About File Handling in PWAs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The File System Access API allows web apps to read or save changes
            directly to files and folders on the user's device. This creates a
            more seamless experience similar to native applications.
          </p>

          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Open files directly from the device's file system</li>
              <li>Edit file contents in the browser</li>
              <li>Save changes back to the original file</li>
              <li>Create new files and save them to the device</li>
              <li>Register as a file handler for specific file types</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            Note: File System Access API requires a secure context (HTTPS) and
            is currently supported in Chromium-based browsers.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
