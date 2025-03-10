import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NetworkStatus from "@/components/NetworkStatus";
import SyncStatus from "@/components/SyncStatus";
import NotificationToggle from "@/components/NotificationToggle";
import DataForm from "@/components/DataForm";
import CacheStatus from "@/components/CacheStatus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Next.js PWA Example
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <NetworkStatus />
        <SyncStatus />
      </div>

      <Tabs defaultValue="features" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">PWA Features</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>PWA Features</CardTitle>
              <CardDescription>
                Explore the capabilities of this Progressive Web App
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Suspense fallback={<div>Loading cache status...</div>}>
                <CacheStatus />
              </Suspense>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Precached Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Essential assets are precached for offline use</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Preload Navigation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Resources are prefetched for faster navigation</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Offline Data Management</CardTitle>
              <CardDescription>
                Submit data even when offline - it will sync when you're back
                online
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>
                Subscribe to receive timely updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationToggle />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
