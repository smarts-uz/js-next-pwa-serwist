import { Suspense } from "react"
import FeatureCard from "@/components/FeatureCard"
import NetworkStatus from "@/components/NetworkStatus"
import PWAInstallPrompt from "@/components/PWAInstallPrompt"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MapPin, Database, Wifi, Link, Bell, Smartphone } from "lucide-react"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-5xl">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Next.js PWA</h1>
        <p className="text-muted-foreground mb-4">A comprehensive Progressive Web App with advanced features</p>
        <Suspense fallback={<div>Loading...</div>}>
          <PWAInstallPrompt />
        </Suspense>
      </div>

      <NetworkStatus className="mb-8" />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>PWA Features</CardTitle>
          <CardDescription>Explore the capabilities of this Progressive Web App</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              title="File Handling"
              description="Open and save files directly from the web app"
              icon={<FileText className="h-6 w-6" />}
              href="/features/file-handling"
            />

            <FeatureCard
              title="Geolocation"
              description="Access and use device location information"
              icon={<MapPin className="h-6 w-6" />}
              href="/features/geolocation"
            />

            <FeatureCard
              title="Local Storage"
              description="Interactive data persistence in the browser"
              icon={<Database className="h-6 w-6" />}
              href="/features/local-storage"
            />

            <FeatureCard
              title="Network Info"
              description="Monitor network connection status and type"
              icon={<Wifi className="h-6 w-6" />}
              href="/features/network-info"
            />

            <FeatureCard
              title="Protocol Handler"
              description="Register as a handler for custom protocols"
              icon={<Link className="h-6 w-6" />}
              href="/features/protocol-handler"
            />

            <FeatureCard
              title="Push Notifications"
              description="Receive notifications even when app is closed"
              icon={<Bell className="h-6 w-6" />}
              href="/features/push-notifications"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About PWAs</CardTitle>
          <CardDescription>Progressive Web Apps combine the best of web and mobile apps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-4">
            <Smartphone className="h-6 w-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium">App-like Experience</h3>
              <p className="text-sm text-muted-foreground">
                PWAs provide a full-screen experience, can be installed on the home screen, and work offline like native
                apps.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Wifi className="h-6 w-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium">Network Independence</h3>
              <p className="text-sm text-muted-foreground">
                PWAs work offline or on low-quality networks, ensuring a consistent user experience.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Bell className="h-6 w-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium">Engagement</h3>
              <p className="text-sm text-muted-foreground">
                Push notifications help re-engage users with timely, relevant content.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

