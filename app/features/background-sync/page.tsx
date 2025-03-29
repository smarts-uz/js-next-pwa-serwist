import type { Metadata } from "next";
import { ArrowRight, CloudDownload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BackgroundSyncExample } from "@/components/BackgroundSyncExample";

export const metadata: Metadata = {
  title: "Background Sync | Modern Web Features",
  description: "Learn how to implement background sync for offline-first web applications",
};

export default function BackgroundSyncPage() {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 lg:py-12 max-w-[1400px]">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="space-y-4 w-full md:w-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Background Sync
          </h1>
          <p className="max-w-[700px] text-sm sm:text-base text-muted-foreground">
            Queue tasks for background synchronization when offline and automatically sync when back online
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button asChild className="text-sm sm:text-base w-full md:w-auto">
            <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Background_Sync_API" target="_blank">
              MDN Documentation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 lg:mt-12 space-y-4 sm:space-y-6 lg:space-y-8">
        <section className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Implementation Example</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              This example demonstrates how to implement background sync for offline-first web applications.
              Tasks are queued when offline and automatically synchronized when the connection is restored.
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CloudDownload className="h-5 w-5 text-primary" />
                <CardTitle>Task Queue</CardTitle>
              </div>
              <CardDescription>
                Add tasks while offline and watch them sync automatically when back online
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BackgroundSyncExample />
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">How It Works</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              The Background Sync API allows web applications to queue tasks for background synchronization
              when offline and automatically sync when the connection is restored.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Service Worker</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                  <li>Registers a background sync queue</li>
                  <li>Handles fetch events for task sync</li>
                  <li>Queues failed requests for retry</li>
                  <li>Notifies clients of successful syncs</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Client Side</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                  <li>Manages task state and UI</li>
                  <li>Handles online/offline status</li>
                  <li>Listens for sync messages</li>
                  <li>Updates UI based on sync status</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
} 