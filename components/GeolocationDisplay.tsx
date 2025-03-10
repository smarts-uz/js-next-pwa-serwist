"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, MapPin, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface GeolocationPosition {
  coords: {
    latitude: number
    longitude: number
    accuracy: number
    altitude: number | null
    altitudeAccuracy: number | null
    heading: number | null
    speed: number | null
  }
  timestamp: number
}

export default function GeolocationDisplay() {
  const [position, setPosition] = useState<GeolocationPosition | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(() => {
    if (typeof window !== "undefined") {
      return "geolocation" in navigator
    }
    return false
  })
  const [watchId, setWatchId] = useState<number | null>(null)
  const [isWatching, setIsWatching] = useState(false)

  const getLocation = () => {
    if (!isSupported) return

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition(position as GeolocationPosition)
        setLoading(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        setError(getGeolocationErrorMessage(error.code))
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  const startWatchingLocation = () => {
    if (!isSupported || isWatching) return

    setError(null)
    setIsWatching(true)

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setPosition(position as GeolocationPosition)
        setLoading(false)
      },
      (error) => {
        console.error("Geolocation watch error:", error)
        setError(getGeolocationErrorMessage(error.code))
        setLoading(false)
        stopWatchingLocation()
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )

    setWatchId(id)
  }

  const stopWatchingLocation = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
      setIsWatching(false)
    }
  }

  const getGeolocationErrorMessage = (code: number): string => {
    switch (code) {
      case 1:
        return "Permission denied. Please allow location access."
      case 2:
        return "Position unavailable. The network is down or satellites cannot be reached."
      case 3:
        return "Timeout. The request to get user location timed out."
      default:
        return "An unknown error occurred."
    }
  }

  useEffect(() => {
    // Clean up watch on unmount
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  if (!isSupported) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Supported</AlertTitle>
        <AlertDescription>Geolocation is not supported in your browser.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap gap-2">
        <Button onClick={getLocation} disabled={loading}>
          <MapPin className="mr-2 h-4 w-4" />
          Get Current Location
        </Button>

        {!isWatching ? (
          <Button onClick={startWatchingLocation} variant="outline" disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Watch Location
          </Button>
        ) : (
          <Button
            onClick={stopWatchingLocation}
            variant="outline"
            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
          >
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Stop Watching
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : position ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Coordinates</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Latitude:</span>{" "}
                  <span className="font-mono">{position.coords.latitude.toFixed(6)}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Longitude:</span>{" "}
                  <span className="font-mono">{position.coords.longitude.toFixed(6)}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Accuracy:</span>{" "}
                  <span className="font-mono">{position.coords.accuracy.toFixed(2)} meters</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Additional Data</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Altitude:</span>{" "}
                  <span className="font-mono">
                    {position.coords.altitude !== null
                      ? `${position.coords.altitude.toFixed(2)} meters`
                      : "Not available"}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">Heading:</span>{" "}
                  <span className="font-mono">
                    {position.coords.heading !== null ? `${position.coords.heading.toFixed(2)}°` : "Not available"}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">Speed:</span>{" "}
                  <span className="font-mono">
                    {position.coords.speed !== null ? `${position.coords.speed.toFixed(2)} m/s` : "Not available"}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <a
              href={`https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center"
            >
              <MapPin className="h-3 w-3 mr-1" />
              View on Google Maps
            </a>
          </div>
        </div>
      ) : null}
    </div>
  )
}

