"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Save, Trash, RefreshCw } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface StorageItem {
  key: string
  value: string
  size: number
}

export default function LocalStorageManager() {
  const [items, setItems] = useState<StorageItem[]>([])
  const [key, setKey] = useState("")
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(() => {
    if (typeof window !== "undefined") {
      return "localStorage" in window
    }
    return false
  })
  const [totalUsage, setTotalUsage] = useState(0)
  const [availableSpace, setAvailableSpace] = useState(0)

  const loadItems = () => {
    if (!isSupported) return

    try {
      const storageItems: StorageItem[] = []
      let total = 0

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) as string
        const value = localStorage.getItem(key) as string
        const size = new Blob([value]).size

        storageItems.push({ key, value, size })
        total += size
      }

      setItems(storageItems)
      setTotalUsage(total)

      // Estimate available space (5MB is typical limit)
      setAvailableSpace(5 * 1024 * 1024 - total)
    } catch (err) {
      console.error("Error loading localStorage items:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to load localStorage items")
      }
    }
  }

  const handleSave = () => {
    setError(null)
    setSuccess(null)

    if (!key) {
      setError("Please enter a key")
      return
    }

    try {
      localStorage.setItem(key, value)
      setSuccess(`Item "${key}" saved successfully`)
      setKey("")
      setValue("")
      loadItems()
    } catch (err) {
      console.error("Error saving to localStorage:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to save to localStorage. You may have exceeded the storage limit.")
      }
    }
  }

  const handleDelete = (key: string) => {
    setError(null)
    setSuccess(null)

    try {
      localStorage.removeItem(key)
      setSuccess(`Item "${key}" deleted successfully`)
      loadItems()
    } catch (err) {
      console.error("Error deleting from localStorage:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to delete from localStorage")
      }
    }
  }

  const handleClearAll = () => {
    setError(null)
    setSuccess(null)

    if (confirm("Are you sure you want to clear all localStorage items?")) {
      try {
        localStorage.clear()
        setSuccess("All items cleared successfully")
        loadItems()
      } catch (err) {
        console.error("Error clearing localStorage:", err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Failed to clear localStorage")
        }
      }
    }
  }

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    }
  }

  useEffect(() => {
    loadItems()
  }, [isSupported])

  if (!isSupported) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Supported</AlertTitle>
        <AlertDescription>localStorage is not supported in your browser.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="key">Key</Label>
          <Input id="key" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter storage key" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Value</Label>
          <Textarea
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter storage value"
            rows={4}
          />
        </div>

        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Item
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Stored Items</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadItems}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          {items.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleClearAll}>
              <Trash className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="text-sm flex flex-wrap gap-x-4 gap-y-2">
        <div>
          <span className="text-muted-foreground">Items:</span> <Badge variant="outline">{items.length}</Badge>
        </div>
        <div>
          <span className="text-muted-foreground">Used:</span> <Badge variant="outline">{formatSize(totalUsage)}</Badge>
        </div>
        <div>
          <span className="text-muted-foreground">Available:</span>{" "}
          <Badge variant="outline">{formatSize(availableSpace)}</Badge>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.key}>
                  <TableCell className="font-medium">{item.key}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {item.value.length > 50 ? `${item.value.substring(0, 50)}...` : item.value}
                  </TableCell>
                  <TableCell>{formatSize(item.size)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.key)} className="h-8 w-8 p-0">
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md bg-muted/50">
          <p className="text-muted-foreground">No items in localStorage</p>
        </div>
      )}
    </div>
  )
}

