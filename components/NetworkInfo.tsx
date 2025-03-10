"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Wifi, WifiOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface NetworkInformation extends EventTarget {
  downlink: number
  effectiveType: "2g" | "3g" | "4g" | "slow-2g"
  rtt: number
  saveData: boolean
  type: "bluetooth" | "cellular" | "ethernet" | "none" | "wifi" | "wimax" | "other" | "unknown"
  onchange: ((this: NetworkInformation, ev: Event) => any) | null
}

declare global {
  interface Navigator {
    connection?: NetworkInformation
  }
}

export default function NetworkInfo() {
  const [isOnline, setIsOnline] = useState(true)
  const [connectionType, setConnectionType] = useState<string>("unknown")
  const [effectiveType, setEffectiveType] = useState<string>("unknown")
  const [downlink, setDownlink] = useState<number>(0)
  const [rtt, setRtt] = useState<number>(0)
  const [saveData, setSaveData] = useState<boolean>(false)
  const [isConnectionSupported, setIsConnectionSupported] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const updateNetworkInfo = () => {
    // Update online status
    setIsOnline(navigator.onLine)

    // Update connection information if available
    if (navigator.connection) {
      setIsConnectionSupported(true)
      setConnectionType(navigator.connection.type)
      setEffectiveType(navigator.connection.effectiveType)
      setDownlink(navigator.connection.downlink)
      setRtt(navigator.connection.rtt)
      setSaveData(navigator.connection.saveData)
    }

    setLastUpdated(new Date())
  }

  useEffect(() => {
    // Set initial values
    updateNetworkInfo()

    // Add event listeners for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Add event listener for connection changes if supported
    if (navigator.connection) {
      navigator.connection.addEventListener("change", updateNetworkInfo)
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)

      if (navigator.connection) {
        navigator.connection.removeEventListener("change", updateNetworkInfo)
      }
    }
  }, [])

  const getConnectionTypeIcon = () => {
    if (!isOnline) return <WifiOff className="h-5 w-5 text-red-500" />

    switch (connectionType) {
      case "wifi":
        return <Wifi className="h-5 w-5 text-green-500" />
      case "cellular":
        return <Wifi className="h-5 w-5 text-blue-500" />
      case "ethernet":
        return <Wifi className="h-5 w-5 text-purple-500" />
      default:
        return <Wifi className="h-5 w-5 text-gray-500" />
    }
  }

  const getConnectionQuality = () => {
    if (!isOnline) return 0

    switch (effectiveType) {
      case "4g":
        return 100
      case "3g":
        return 75
      case "2g":
        return 50
      case "slow-2g":
        return 25
      default:
        return 50
    }
  }

  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Network Information</h3>
        <Button variant="outline" size="sm" onClick={updateNetworkInfo}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>

      {!isConnectionSupported && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Limited Support</AlertTitle>
          <AlertDescription>
            Your browser has limited support for the Network Information API. Basic online/offline status is available,
            but detailed connection information is not.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Connection Status</h3>
              {getConnectionTypeIcon()}
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Status</span>
                  <Badge
                    variant={isOnline ? "success" : "destructive"}
                    className={isOnline ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </Badge>
                </div>
                <Progress value={isOnline ? 100 : 0} className={isOnline ? "bg-green-100" : "bg-red-100"} />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Connection Quality</span>
                  <span className="text-sm">{effectiveType.toUpperCase()}</span>
                </div>
                <Progress value={getConnectionQuality()} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Connection Details</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connection Type:</span>
                <span className="font-medium capitalize">{connectionType}</span>
              </div>

              {isConnectionSupported && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Effective Type:</span>
                    <span className="font-medium uppercase">{effectiveType}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Downlink Speed:</span>
                    <span className="font-medium">{downlink} Mbps</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Round Trip Time:</span>
                    <span className="font-medium">{rtt} ms</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Saver:</span>
                    <span className="font-medium">{saveData ? "Enabled" : "Disabled"}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">{formatLastUpdated()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

