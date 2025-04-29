import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GeolocationDisplay from "./components/GeolocationDisplay";

export default function GeolocationPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Geolocation Services</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Device Location</CardTitle>
          <CardDescription>
            Access and use your device's location information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GeolocationDisplay />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Geolocation in PWAs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Geolocation API allows web applications to access the user's
            geographical location information, enabling location-aware features
            similar to native apps.
          </p>

          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Get the current position (latitude and longitude)</li>
              <li>Track position changes in real-time</li>
              <li>
                Access additional data like altitude, heading, and speed (when
                available)
              </li>
              <li>Configure accuracy requirements and timeout settings</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            Note: Geolocation requires user permission and a secure context
            (HTTPS). The accuracy may vary depending on the device and
            environment.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
