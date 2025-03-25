import { Suspense } from "react";
import FeatureCard from "@/components/FeatureCard";
import NetworkStatus from "@/components/NetworkStatus";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  MapPin,
  Database,
  Wifi,
  Link,
  Bell,
  Smartphone,
  Camera,
  ArrowRightLeft,
  Lock,
  Share,
  Vibrate,
  AudioLines,
  CloudCog,
  Package,
  Bluetooth,
  Zap,
  Shield,
  Server,
} from "lucide-react";

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-5xl">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Next.js PWA</h1>
        <p className="text-muted-foreground mb-4">
          A comprehensive Progressive Web App with advanced features
        </p>
        <Suspense fallback={<div>Loading...</div>}>
          <PWAInstallPrompt />
        </Suspense>
      </div>

      <NetworkStatus className="mb-8" />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>All Features</CardTitle>
          <CardDescription>Complete list of PWA capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              title="Web Bluetooth"
              description="Connect and interact with Bluetooth devices"
              icon={<Bluetooth className="h-6 w-6" />}
              href="/features/web-bluetooth"
            />
            <FeatureCard
              title="Media Capture"
              description="Access device camera and media features"
              icon={<Camera className="h-6 w-6" />}
              href="/features/media-capture"
            />
            <FeatureCard
              title="Web Auth"
              description="Secure authentication with biometrics"
              icon={<Lock className="h-6 w-6" />}
              href="/features/web-authentication"
            />
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
            <FeatureCard
              title="View Transitions"
              description="Smooth page transitions and animations"
              icon={<ArrowRightLeft className="h-6 w-6" />}
              href="/features/transitions"
            />
            <FeatureCard
              title="Web Share API"
              description="Share content with other apps"
              icon={<Share className="h-6 w-6" />}
              href="/features/web-share"
            />
            <FeatureCard
              title="Vibration"
              description="Provide haptic feedback"
              icon={<Vibrate className="h-6 w-6" />}
              href="/features/vibration"
            />
            <FeatureCard
              title="Audio Player"
              description="Play and control audio content"
              icon={<AudioLines className="h-6 w-6" />}
              href="/features/audio"
            />
            <FeatureCard
              title="Background Fetch"
              description="Download resources in the background"
              icon={<CloudCog className="h-6 w-6" />}
              href="/features/background-fetch"
            />
            <FeatureCard
              title="Storage"
              description="Advanced storage solutions"
              icon={<Package className="h-6 w-6" />}
              href="/features/storage"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PWA Benefits</CardTitle>
          <CardDescription>
            Why Progressive Web Apps are the future
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-4">
            <Smartphone className="h-6 w-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium">App-like Experience</h3>
              <p className="text-sm text-muted-foreground">
                PWAs provide a full-screen experience, can be installed on the
                home screen, and work offline like native apps.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Wifi className="h-6 w-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium">Network Independence</h3>
              <p className="text-sm text-muted-foreground">
                PWAs work offline or on low-quality networks, ensuring a
                consistent user experience.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Bell className="h-6 w-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium">Engagement</h3>
              <p className="text-sm text-muted-foreground">
                Push notifications help re-engage users with timely, relevant
                content.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Zap className="h-6 w-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium">Performance</h3>
              <p className="text-sm text-muted-foreground">
                Fast loading times and smooth interactions with service workers
                and caching.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Shield className="h-6 w-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium">Security</h3>
              <p className="text-sm text-muted-foreground">
                HTTPS by default and secure data handling with modern web
                standards.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Server className="h-6 w-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium">Cross-Platform</h3>
              <p className="text-sm text-muted-foreground">
                One codebase that works across all devices and platforms.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
