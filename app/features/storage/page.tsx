import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Database, HardDrive, Clock, Shield, Zap, Server } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StorageComparison } from "@/components/StorageComparison"
import { LocalStorageExample } from "@/components/LocalStorageComparison"
import { IndexedDBExample } from "@/components/IndexedDBExample"
import { CacheAPIExample } from "@/components/CacheApiExample"
import { FileSystemExample } from "@/components/FileSystemExample"

export const metadata: Metadata = {
  title: "Web Storage API | Modern Web Features",
  description:
    "Comprehensive guide to Web Storage APIs including localStorage, sessionStorage, IndexedDB, and Cache API",
}

export default function StorageAPIPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Web Storage APIs</h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            A comprehensive guide to storing and managing data in web applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API" target="_blank">
              MDN Documentation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-12 grid gap-8">
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Introduction to Web Storage</h2>
            <p className="text-muted-foreground">
              Web Storage APIs provide mechanisms for storing data in the browser, enabling web applications to work
              offline, improve performance, and enhance user experience. This guide covers the main storage options
              available to web developers.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-primary" />
                  <CardTitle>localStorage</CardTitle>
                </div>
                <CardDescription>Persistent key-value storage that survives browser restarts</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle>sessionStorage</CardTitle>
                </div>
                <CardDescription>Temporary storage that lasts for the duration of the page session</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle>IndexedDB</CardTitle>
                </div>
                <CardDescription>
                  Client-side database for storing significant amounts of structured data
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  <CardTitle>Cache API</CardTitle>
                </div>
                <CardDescription>
                  Storage for network request and response pairs, ideal for offline access
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="space-y-6 pt-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Storage API Comparison</h2>
            <p className="text-muted-foreground">
              Different storage mechanisms are suited for different use cases. This comparison helps you choose the
              right storage option for your application needs.
            </p>
          </div>

          <StorageComparison />
        </section>

        <section className="space-y-6 pt-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Implementation Examples</h2>
            <p className="text-muted-foreground">
              Explore practical examples of how to use different storage APIs in real-world scenarios.
            </p>
          </div>

          <Tabs defaultValue="local-storage" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="local-storage">localStorage</TabsTrigger>
              <TabsTrigger value="indexed-db">IndexedDB</TabsTrigger>
              <TabsTrigger value="cache-api">Cache API</TabsTrigger>
              <TabsTrigger value="file-system">File System</TabsTrigger>
            </TabsList>
            <TabsContent value="local-storage" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Preferences with localStorage</CardTitle>
                  <CardDescription>Store and retrieve user preferences using the localStorage API</CardDescription>
                </CardHeader>
                <CardContent>
                  <LocalStorageExample />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="indexed-db" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Offline-Capable Notes App with IndexedDB</CardTitle>
                  <CardDescription>
                    Create, read, update, and delete notes that work offline using IndexedDB
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
                  <CardDescription>Cache API and Service Workers for offline access to content</CardDescription>
                </CardHeader>
                <CardContent>
                  <CacheAPIExample />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="file-system" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>File Management with File System Access API</CardTitle>
                  <CardDescription>Read, write, and manage files on the user's device</CardDescription>
                </CardHeader>
                <CardContent>
                  <FileSystemExample />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-6 pt-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Best Practices</h2>
            <p className="text-muted-foreground">
              Follow these guidelines to implement storage effectively in your applications.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle>Performance Optimization</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Store only what you need; avoid storing large objects in localStorage</li>
                  <li>Use IndexedDB for large datasets instead of localStorage</li>
                  <li>Implement pagination when retrieving large datasets from IndexedDB</li>
                  <li>Use structured cloning for complex objects in IndexedDB</li>
                  <li>Batch database operations for better performance</li>
                  <li>Consider using web workers for database operations to avoid blocking the main thread</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Security Considerations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Never store sensitive information like passwords or tokens in localStorage</li>
                  <li>Be aware that all client-side storage is accessible to JavaScript on your domain</li>
                  <li>Implement proper input validation to prevent XSS attacks</li>
                  <li>Consider encrypting sensitive data before storing it</li>
                  <li>Implement proper access controls for your application</li>
                  <li>Be mindful of storage quotas and handle quota exceeded errors</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Error Handling and Edge Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-2">Common Errors</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Storage quota exceeded</li>
                    <li>Private browsing mode limitations</li>
                    <li>Concurrent access issues</li>
                    <li>Browser compatibility differences</li>
                    <li>Data corruption or schema migration issues</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Handling Strategies</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Implement try/catch blocks around storage operations</li>
                    <li>Check for storage availability before using it</li>
                    <li>Provide fallback mechanisms when storage is unavailable</li>
                    <li>Implement data versioning for schema migrations</li>
                    <li>Use feature detection instead of browser detection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6 pt-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Browser Support</h2>
            <p className="text-muted-foreground">
              Storage APIs have varying levels of support across browsers. Here's what you need to know.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-2">Widely Supported</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>localStorage and sessionStorage (all modern browsers)</li>
                    <li>IndexedDB (all modern browsers)</li>
                    <li>Cache API (all modern browsers)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Limited Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>File System Access API (Chrome, Edge, Opera)</li>
                    <li>Storage Manager API (Chrome, Firefox, Edge)</li>
                    <li>Persistent Storage (varies by browser)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

