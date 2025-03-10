"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { saveDataForSync } from "@/lib/db"
import { submitData } from "@/app/actions"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type FormData = {
  title: string
  content: string
}

export default function DataForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  // Update online status when it changes
  useState(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  })

  const onSubmit = async (data: FormData) => {
    try {
      if (isOnline) {
        // If online, submit directly
        await submitData(data)
        setStatus("success")
        setMessage("Data submitted successfully!")
      } else {
        // If offline, save to IndexedDB for later sync
        await saveDataForSync(data)
        setStatus("success")
        setMessage("Data saved for sync when you go back online.")
      }
      reset()
    } catch (error) {
      console.error("Error submitting data:", error)
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Failed to submit data")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {status === "success" && (
        <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title", { required: "Title is required" })} placeholder="Enter a title" />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          {...register("content", { required: "Content is required" })}
          placeholder="Enter your content"
          rows={4}
        />
        {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : isOnline ? "Submit" : "Save for Later"}
      </Button>

      {!isOnline && (
        <p className="text-sm text-amber-600">
          You're offline. Your data will be saved locally and synced when you're back online.
        </p>
      )}
    </form>
  )
}

