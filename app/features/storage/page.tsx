import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Database,
  HardDrive,
  Clock,
  Shield,
  Zap,
  Server,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StorageComparison } from "@/components/StorageComparison";
import { LocalStorageExample } from "@/components/LocalStorageComparison";
import { IndexedDBExample } from "@/components/IndexedDBExample";
import { CacheAPIExample } from "@/components/CacheApiExample";
import { FileSystemExample } from "@/components/FileSystemExample";

export const metadata: Metadata = {
  title: "Web Storage API | Modern Web Features",
  description:
    "Comprehensive guide to Web Storage APIs including localStorage, sessionStorage, IndexedDB, and Cache API",
};

export default function StorageAPIPage() {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 lg:py-12 max-w-[1400px]">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="space-y-4 w-full md:w-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Web Storage APIs
          </h1>
          <p className="max-w-[700px] text-sm sm:text-base text-muted-foreground">
            A comprehensive guide to storing and managing data in web
            applications
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button asChild className="text-sm sm:text-base w-full md:w-auto">
            <Link
              href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API"
              target="_blank"
            >
              MDN Documentation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 lg:mt-12 space-y-4 sm:space-y-6 lg:space-y-8">
        <section className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Introduction to Web Storage
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Web Storage APIs provide mechanisms for storing data in the
              browser, enabling web applications to work offline, improve
              performance, and enhance user experience. This guide covers the
              main storage options available to web developers.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6">
            <Card className="h-full flex-1 min-w-72">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-primary" />
                  <CardTitle>localStorage</CardTitle>
                </div>
                <CardDescription>
                  Persistent key-value storage that survives browser restarts
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="h-full flex-1 min-w-72">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle>sessionStorage</CardTitle>
                </div>
                <CardDescription>
                  Temporary storage that lasts for the duration of the page
                  session
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="h-full flex-1 min-w-72">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle>IndexedDB</CardTitle>
                </div>
                <CardDescription>
                  Client-side database for storing significant amounts of
                  structured data
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="h-full flex-1 min-w-72">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  <CardTitle>Cache API</CardTitle>
                </div>
                <CardDescription>
                  Storage for network request and response pairs, ideal for
                  offline access
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Storage API Comparison
            </h2>
            <p className="text-muted-foreground">
              Different storage mechanisms are suited for different use cases.
              This comparison helps you choose the right storage option for your
              application needs.
            </p>
          </div>

          <StorageComparison />
        </section>

        <section className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Implementation Examples
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Explore practical examples of how to use different storage APIs in
              real-world scenarios.
            </p>
          </div>

          <Tabs defaultValue="local-storage" className="w-full">
            <TabsList className="flex flex-wrap w-full text-sm sm:text-base">
              <TabsTrigger
                value="local-storage"
                className="flex-1 min-w-[120px]"
              >
                localStorage
              </TabsTrigger>
              <TabsTrigger value="indexed-db" className="flex-1 min-w-[120px]">
                IndexedDB
              </TabsTrigger>
              <TabsTrigger value="cache-api" className="flex-1 min-w-[120px]">
                Cache API
              </TabsTrigger>
              <TabsTrigger value="file-system" className="flex-1 min-w-[120px]">
                File System
              </TabsTrigger>
            </TabsList>
            <TabsContent value="local-storage" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Preferences with localStorage</CardTitle>
                  <CardDescription>
                    Store and retrieve user preferences using the localStorage
                    API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LocalStorageExample />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="indexed-db" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Offline-Capable Notes App with IndexedDB
                  </CardTitle>
                  <CardDescription>
                    Create, read, update, and delete notes that work offline
                    using IndexedDB
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <IndexedDBExample />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="cache-api" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Offline Content with Cache API</CardTitle>
                  <CardDescription>
                    Cache API and Service Workers for offline access to content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CacheAPIExample />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="file-system" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    File Management with File System Access API
                  </CardTitle>
                  <CardDescription>
                    Read, write, and manage files on the user's device
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileSystemExample />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Best Practices
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Follow these guidelines to implement storage effectively in your
              applications.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6">
            <Card className="h-full flex-1 min-w-72 max-w-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg sm:text-xl">
                    Performance Optimization
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                  <li>
                    Store only what you need; avoid storing large objects in
                    localStorage
                  </li>
                  <li>
                    Use IndexedDB for large datasets instead of localStorage
                  </li>
                  <li>
                    Implement pagination when retrieving large datasets from
                    IndexedDB
                  </li>
                  <li>
                    Use structured cloning for complex objects in IndexedDB
                  </li>
                  <li>Batch database operations for better performance</li>
                  <li>
                    Consider using web workers for database operations to avoid
                    blocking the main thread
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="h-full flex-1 min-w-72 max-w-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg sm:text-xl">
                    Security Considerations
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                  <li>
                    Never store sensitive information like passwords or tokens
                    in localStorage
                  </li>
                  <li>
                    Be aware that all client-side storage is accessible to
                    JavaScript on your domain
                  </li>
                  <li>
                    Implement proper input validation to prevent XSS attacks
                  </li>
                  <li>Consider encrypting sensitive data before storing it</li>
                  <li>Implement proper access controls for your application</li>
                  <li>
                    Be mindful of storage quotas and handle quota exceeded
                    errors
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Error Handling and Edge Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="flex-1 min-w-72 max-w-full">
                  <h3 className="text-base sm:text-lg font-medium mb-2">
                    Common Errors
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
                    <li>Storage quota exceeded</li>
                    <li>Private browsing mode limitations</li>
                    <li>Concurrent access issues</li>
                    <li>Browser compatibility differences</li>
                    <li>Data corruption or schema migration issues</li>
                  </ul>
                </div>
                <div className="flex-1 min-w-72 max-w-full">
                  <h3 className="text-base sm:text-lg font-medium mb-2">
                    Handling Strategies
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
                    <li>
                      Implement try/catch blocks around storage operations
                    </li>
                    <li>Check for storage availability before using it</li>
                    <li>
                      Provide fallback mechanisms when storage is unavailable
                    </li>
                    <li>Implement data versioning for schema migrations</li>
                    <li>Use feature detection instead of browser detection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
