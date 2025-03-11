import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PushNotificationManager from "@/components/PushNotificationManager";

export default function PushNotificationsPage() {
  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Push Notifications</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Firebase Push Notifications</CardTitle>
          <CardDescription>
            Subscribe to receive notifications even when the app is closed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PushNotificationManager />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Push Notifications in PWAs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Push notifications allow web applications to receive messages from a
            server when the app is not active, enabling timely updates and
            re-engagement with users.
          </p>

          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Receive notifications even when the browser is closed</li>
              <li>Display system notifications to the user</li>
              <li>Include actions that the user can interact with</li>
              <li>Deep link to specific parts of the application</li>
              <li>Firebase integration for reliable delivery</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            Note: Push notifications require user permission, a secure context
            (HTTPS), and service worker support. This implementation uses
            Firebase Cloud Messaging for cross-browser compatibility.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

