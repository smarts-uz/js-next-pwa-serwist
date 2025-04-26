"force client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LocalStorageManager from "@/components/LocalStorageManager";

export default function LocalStoragePage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Interactive Local Storage</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manage Local Storage</CardTitle>
          <CardDescription>
            Store and retrieve data that persists across browser sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LocalStorageManager />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Local Storage in PWAs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Local Storage provides a simple key-value storage mechanism that
            persists data across browser sessions, allowing PWAs to maintain
            state and user preferences even after the browser is closed.
          </p>

          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Store data that persists even when the browser is closed</li>
              <li>Synchronous API for easy data access</li>
              <li>Typically allows 5-10MB of storage per domain</li>
              <li>Data is stored as strings (objects need to be serialized)</li>
              <li>Available even when offline</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            Note: For more complex data storage needs, consider using IndexedDB
            which offers larger storage capacity and support for structured
            data.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
