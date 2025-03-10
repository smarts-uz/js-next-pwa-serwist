"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, WifiOff } from "lucide-react"

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    // Add event listeners
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <Card className={isOnline ? "border-green-500" : "border-red-500"}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          {isOnline ? (
            <>
              <Wifi className="mr-2 h-5 w-5 text-green-500" />
              <span>Online</span>
            </>
          ) : (
            <>
              <WifiOff className="mr-2 h-5 w-5 text-red-500" />
              <span>Offline</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {isOnline
            ? "You are connected to the internet. All features are available."
            : "You are currently offline. Some features may be limited, but you can still use the app."}
        </p>
      </CardContent>
    </Card>
  )
}

