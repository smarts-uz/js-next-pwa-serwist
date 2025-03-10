"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getPendingSyncRequests } from "@/lib/db"

export default function SyncStatus() {
  const [pendingItems, setPendingItems] = useState(0)
  const [syncSupported, setSyncSupported] = useState(true)

  useEffect(() => {
    // Check if background sync is supported
    const isSyncSupported = "serviceWorker" in navigator && "SyncManager" in window
    setSyncSupported(isSyncSupported)

    // Get initial pending items count
    const updatePendingCount = async () => {
      const count = await getPendingSyncRequests()
      setPendingItems(count)
    }

    updatePendingCount()

    // Set up listener for changes in IndexedDB
    const channel = new BroadcastChannel("sync-updates")
    channel.onmessage = (event) => {
      if (event.data.type === "sync-updated") {
        updatePendingCount()
      }
    }

    return () => {
      channel.close()
    }
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center">
            <RefreshCw className="mr-2 h-5 w-5" />
            <span>Background Sync</span>
          </div>
          {pendingItems > 0 && (
            <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
              {pendingItems} pending
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!syncSupported ? (
          <div className="flex items-center text-amber-600">
            <AlertCircle className="mr-2 h-4 w-4" />
            <p className="text-sm">Background sync is not supported in your browser.</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {pendingItems === 0
              ? "All data is synced with the server."
              : `${pendingItems} item(s) waiting to be synced when you're back online.`}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

