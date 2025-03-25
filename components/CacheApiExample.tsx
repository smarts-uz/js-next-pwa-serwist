"use client"

import { useState, useEffect } from "react"
import { Download, RefreshCw, Wifi, WifiOff, CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock articles for demonstration
const articles = [
  {
    id: 1,
    title: "Understanding the Cache API",
    summary: "The Cache API provides a mechanism for storing and retrieving network requests and responses...",
    content: `
      <h2>Understanding the Cache API</h2>
      <p>The Cache API provides a mechanism for storing and retrieving network requests and responses. It's designed to be used with Service Workers, allowing web applications to function offline.</p>
      <p>The Cache API is particularly useful for:</p>
      <ul>
        <li>Storing assets for offline use</li>
        <li>Improving performance by serving cached content</li>
        <li>Implementing custom caching strategies</li>
      </ul>
      <p>Unlike other storage mechanisms, the Cache API is specifically designed for HTTP requests and responses, making it ideal for caching API responses, HTML pages, and other network resources.</p>
      <h3>Basic Usage</h3>
      <p>The Cache API provides methods for opening caches, adding items to caches, and retrieving items from caches. It's promise-based, making it easy to use with async/await.</p>
      <p>Here's a simple example of caching a response:</p>
      <pre>
      cache.put(request, response);
      </pre>
      <p>And retrieving it later:</p>
      <pre>
      cache.match(request).then(response => {
        if (response) {
          // Use the cached response
        } else {
          // Fetch from network
        }
      });
      </pre>
    `,
    imageUrl: "/placeholder.svg?height=200&width=400&text=Cache+API+Article",
  },
  {
    id: 2,
    title: "Service Workers and Offline Web Apps",
    summary: "Service Workers act as proxy servers that sit between web applications, the browser, and the network...",
    content: `
      <h2>Service Workers and Offline Web Apps</h2>
      <p>Service Workers act as proxy servers that sit between web applications, the browser, and the network. They enable the creation of effective offline experiences, intercept network requests, and take appropriate action based on whether the network is available.</p>
      <p>Key features of Service Workers include:</p>
      <ul>
        <li>Running in the background, separate from the web page</li>
        <li>No access to the DOM</li>
        <li>Programmable network proxy</li>
        <li>Terminated when not in use and restarted when needed</li>
        <li>Extensive use of promises</li>
      </ul>
      <h3>The Service Worker Lifecycle</h3>
      <p>Service Workers have a distinct lifecycle that's separate from the web page:</p>
      <ol>
        <li><strong>Registration</strong>: The browser registers the Service Worker</li>
        <li><strong>Installation</strong>: The Service Worker is installed</li>
        <li><strong>Activation</strong>: The Service Worker is activated</li>
      </ol>
      <p>Once activated, a Service Worker will control all pages that fall under its scope, but only after those pages are loaded again.</p>
      <h3>Caching Strategies</h3>
      <p>There are several common caching strategies used with Service Workers:</p>
      <ul>
        <li><strong>Cache First</strong>: Check the cache first, fall back to network</li>
        <li><strong>Network First</strong>: Try the network first, fall back to cache</li>
        <li><strong>Stale While Revalidate</strong>: Serve from cache, then update cache from network</li>
        <li><strong>Cache Only</strong>: Serve only from cache</li>
        <li><strong>Network Only</strong>: Serve only from network</li>
      </ul>
    `,
    imageUrl: "/placeholder.svg?height=200&width=400&text=Service+Workers+Article",
  },
  {
    id: 3,
    title: "Implementing Offline-First Web Applications",
    summary:
      "Offline-first is a design approach that prioritizes the offline experience, ensuring applications work without an internet connection...",
    content: `
      <h2>Implementing Offline-First Web Applications</h2>
      <p>Offline-first is a design approach that prioritizes the offline experience, ensuring applications work without an internet connection. This approach acknowledges that network connectivity can be unreliable and builds applications that work regardless of connection status.</p>
      <p>Key principles of offline-first design:</p>
      <ul>
        <li>Store essential data locally</li>
        <li>Synchronize data when connection is available</li>
        <li>Provide clear feedback about connection status</li>
        <li>Gracefully handle offline scenarios</li>
      </ul>
      <h3>Technologies for Offline-First</h3>
      <p>Several technologies enable offline-first applications:</p>
      <ul>
        <li><strong>Service Workers</strong>: For intercepting network requests and serving cached responses</li>
        <li><strong>Cache API</strong>: For storing HTTP requests and responses</li>
        <li><strong>IndexedDB</strong>: For storing structured data</li>
        <li><strong>Background Sync API</strong>: For deferring actions until the user has stable connectivity</li>
      </ul>
      <h3>Handling Data Synchronization</h3>
      <p>One of the challenges of offline-first applications is data synchronization. When a user makes changes offline, those changes need to be synchronized with the server when connectivity is restored.</p>
      <p>Common approaches include:</p>
      <ul>
        <li>Queue-based synchronization</li>
        <li>Conflict resolution strategies</li>
        <li>Optimistic UI updates</li>
        <li>Event-based synchronization</li>
      </ul>
    `,
    imageUrl: "/placeholder.svg?height=200&width=400&text=Offline+First+Article",
  },
]

export function CacheAPIExample() {
  const [isOffline, setIsOffline] = useState(false)
  const [cacheStatus, setCacheStatus] = useState<"uncached" | "caching" | "cached">("uncached")
  const [cachingProgress, setCachingProgress] = useState(0)
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [serviceWorkerSupported, setServiceWorkerSupported] = useState(true)
  const [cacheApiSupported, setCacheApiSupported] = useState(true)

  // Check for Service Worker and Cache API support
  useEffect(() => {
    setServiceWorkerSupported("serviceWorker" in navigator)
    setCacheApiSupported("caches" in window)

    // Set up online/offline detection
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOffline(!navigator.onLine)

    // Check if content is already cached
    checkCacheStatus()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Check if articles are cached
  const checkCacheStatus = async () => {
    if (!cacheApiSupported) return

    try {
      const cache = await caches.open("articles-cache")
      const keys = await cache.keys()

      // Check if all article URLs are cached
      const allCached = articles.every((article) => keys.some((key) => key.url.includes(`article-${article.id}`)))

      setCacheStatus(allCached ? "cached" : "uncached")
    } catch (err) {
      console.error("Error checking cache status:", err)
      setError("Failed to check cache status")
    }
  }

  // Cache all articles
  const cacheArticles = async () => {
    if (!cacheApiSupported) {
      setError("Cache API is not supported in your browser")
      return
    }

    setCacheStatus("caching")
    setCachingProgress(0)
    setError(null)

    try {
      const cache = await caches.open("articles-cache")

      for (let i = 0; i < articles.length; i++) {
        const article = articles[i]

        // Create a response object with the article content
        const response = new Response(JSON.stringify(article), {
          headers: { "Content-Type": "application/json" },
        })

        // Cache the article
        await cache.put(`/api/article-${article.id}`, response)

        // Cache the article image
        if (article.imageUrl) {
          const imageResponse = await fetch(article.imageUrl)
          await cache.put(article.imageUrl, imageResponse)
        }

        // Update progress
        setCachingProgress(Math.round(((i + 1) / articles.length) * 100))
      }

      setCacheStatus("cached")
    } catch (err) {
      console.error("Error caching articles:", err)
      setError("Failed to cache articles")
      setCacheStatus("uncached")
    }
  }

  // Clear the cache
  const clearCache = async () => {
    if (!cacheApiSupported) return

    try {
      await caches.delete("articles-cache")
      setCacheStatus("uncached")
    } catch (err) {
      console.error("Error clearing cache:", err)
      setError("Failed to clear cache")
    }
  }

  // Get article from cache or memory
  const getArticle = async (id: number) => {
    setSelectedArticle(id)

    if (!cacheApiSupported || cacheStatus !== "cached" || !isOffline) {
      // If not using cache or online, just use the in-memory article
      return
    }

    try {
      const cache = await caches.open("articles-cache")
      const response = await cache.match(`/api/article-${id}`)

      if (!response) {
        setError(`Article ${id} not found in cache`)
        return
      }

      // No need to actually use the cached data in this demo
      // In a real app, you would parse the response and update the UI
      console.log("Retrieved article from cache:", await response.json())
    } catch (err) {
      console.error("Error retrieving article from cache:", err)
      setError("Failed to retrieve article from cache")
    }
  }

  if (!serviceWorkerSupported || !cacheApiSupported) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {!serviceWorkerSupported
            ? "Service Workers are not supported in your browser. This example requires Service Worker support."
            : "Cache API is not supported in your browser. This example requires Cache API support."}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">Offline Content with Cache API</h3>
          <p className="text-sm text-muted-foreground">Cache content for offline access using the Cache API</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`${
              isOffline ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="mr-1 h-3 w-3" />
                Offline
              </>
            ) : (
              <>
                <Wifi className="mr-1 h-3 w-3" />
                Online
              </>
            )}
          </Badge>

          {cacheStatus === "uncached" ? (
            <Button onClick={cacheArticles} disabled={cacheStatus === "caching"} className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Cache for Offline
            </Button>
          ) : cacheStatus === "cached" ? (
            <Button onClick={clearCache} variant="outline" className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear Cache
            </Button>
          ) : null}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {cacheStatus === "caching" && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Caching articles for offline use...</span>
            <span>{cachingProgress}%</span>
          </div>
          <Progress value={cachingProgress} />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Articles</h3>
          <div className="space-y-2">
            {articles.map((article) => (
              <Card
                key={article.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedArticle === article.id ? "border-primary" : ""
                }`}
                onClick={() => getArticle(article.id)}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">{article.summary}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <div className="flex items-center text-xs">
                    {isOffline && cacheStatus === "cached" ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Available Offline
                      </Badge>
                    ) : isOffline && cacheStatus !== "cached" ? (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <XCircle className="mr-1 h-3 w-3" />
                        Not Available Offline
                      </Badge>
                    ) : null}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div>
          {selectedArticle ? (
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle>{articles.find((a) => a.id === selectedArticle)?.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <img
                  src={articles.find((a) => a.id === selectedArticle)?.imageUrl || "/placeholder.svg"}
                  alt={articles.find((a) => a.id === selectedArticle)?.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: articles.find((a) => a.id === selectedArticle)?.content || "",
                  }}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full border rounded-md bg-muted/20 p-8">
              <div className="text-center">
                <h3 className="font-medium mb-2">No Article Selected</h3>
                <p className="text-sm text-muted-foreground">Select an article from the list to view its content</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md bg-muted p-4">
        <h4 className="text-sm font-medium mb-2">How it works:</h4>
        <p className="text-sm text-muted-foreground">
          This example demonstrates using the Cache API to store content for offline access. When you click "Cache for
          Offline", the application stores article content and images in the browser's cache. When you go offline
          (toggle the network status), you can still access the cached content.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          In a real application, this would be implemented with Service Workers to intercept network requests and serve
          cached responses when offline. The Cache API is specifically designed for storing HTTP requests and responses,
          making it ideal for offline web applications.
        </p>
        <pre className="bg-muted-foreground/10 p-2 rounded-md text-xs mt-2 overflow-x-auto">
          <code>{`// Service Worker code example
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Clone the response to cache it
            const responseToCache = response.clone();
            
            caches.open('articles-cache')
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
      })
  );
});`}</code>
        </pre>
      </div>
    </div>
  )
}

