"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, Edit, Save, X, AlertCircle, Database } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface Note {
  id?: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export function IndexedDBExample() {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [dbStatus, setDbStatus] = useState<"loading" | "ready" | "error">("loading")
  const [error, setError] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState(false)

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = async () => {
      try {
        // Check if IndexedDB is supported
        if (!window.indexedDB) {
          throw new Error("Your browser doesn't support IndexedDB")
        }

        // Open database connection
        const request = indexedDB.open("NotesDatabase", 1)

        request.onerror = (event) => {
          console.error("Database error:", event)
          setDbStatus("error")
          setError("Failed to open database. This could be due to private browsing mode or storage permissions.")
        }

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result

          // Create object store if it doesn't exist
          if (!db.objectStoreNames.contains("notes")) {
            const store = db.createObjectStore("notes", { keyPath: "id", autoIncrement: true })
            store.createIndex("title", "title", { unique: false })
            store.createIndex("createdAt", "createdAt", { unique: false })
          }
        }

        request.onsuccess = () => {
          setDbStatus("ready")
          loadNotes()
        }
      } catch (err) {
        console.error("Error initializing database:", err)
        setDbStatus("error")
        setError(`Failed to initialize database: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    initDB()

    // Set up online/offline detection
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Load notes from IndexedDB
  const loadNotes = async () => {
    try {
      const db = await openDB()
      const transaction = db.transaction("notes", "readonly")
      const store = transaction.objectStore("notes")
      const request = store.getAll()

      request.onsuccess = () => {
        const loadedNotes = request.result
        // Convert date strings back to Date objects
        const processedNotes = loadedNotes.map((note) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }))
        setNotes(processedNotes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()))
      }

      request.onerror = (event) => {
        console.error("Error loading notes:", event)
        setError("Failed to load notes from database")
      }
    } catch (err) {
      console.error("Error in loadNotes:", err)
      setError(`Failed to load notes: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Helper function to open database
  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("NotesDatabase", 1)
      request.onerror = () => reject(new Error("Failed to open database"))
      request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result)
    })
  }

  // Add a new note
  const addNote = async () => {
    const newNote: Note = {
      title: "New Note",
      content: "Start writing here...",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    try {
      const db = await openDB()
      const transaction = db.transaction("notes", "readwrite")
      const store = transaction.objectStore("notes")
      const request = store.add(newNote)

      request.onsuccess = () => {
        const id = request.result as number
        const noteWithId = { ...newNote, id }
        setNotes((prev) => [noteWithId, ...prev])
        setCurrentNote(noteWithId)
        setIsEditing(true)
      }

      request.onerror = (event) => {
        console.error("Error adding note:", event)
        setError("Failed to add note to database")
      }
    } catch (err) {
      console.error("Error in addNote:", err)
      setError(`Failed to add note: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Update a note
  const updateNote = async (note: Note) => {
    if (!note.id) return

    try {
      const db = await openDB()
      const transaction = db.transaction("notes", "readwrite")
      const store = transaction.objectStore("notes")

      // Update the updatedAt timestamp
      const updatedNote = { ...note, updatedAt: new Date() }
      const request = store.put(updatedNote)

      request.onsuccess = () => {
        setNotes((prev) =>
          prev
            .map((n) => (n.id === note.id ? updatedNote : n))
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
        )
        setCurrentNote(updatedNote)
        setIsEditing(false)
      }

      request.onerror = (event) => {
        console.error("Error updating note:", event)
        setError("Failed to update note in database")
      }
    } catch (err) {
      console.error("Error in updateNote:", err)
      setError(`Failed to update note: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Delete a note
  const deleteNote = async (id: number) => {
    try {
      const db = await openDB()
      const transaction = db.transaction("notes", "readwrite")
      const store = transaction.objectStore("notes")
      const request = store.delete(id)

      request.onsuccess = () => {
        setNotes((prev) => prev.filter((note) => note.id !== id))
        if (currentNote?.id === id) {
          setCurrentNote(null)
          setIsEditing(false)
        }
      }

      request.onerror = (event) => {
        console.error("Error deleting note:", event)
        setError("Failed to delete note from database")
      }
    } catch (err) {
      console.error("Error in deleteNote:", err)
      setError(`Failed to delete note: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Handle note selection
  const selectNote = (note: Note) => {
    setCurrentNote(note)
    setIsEditing(false)
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (dbStatus === "loading") {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center">
          <Database className="h-12 w-12 text-primary animate-pulse mb-4" />
          <p className="text-muted-foreground">Initializing database...</p>
        </div>
      </div>
    )
  }

  if (dbStatus === "error") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Database Error</AlertTitle>
        <AlertDescription>
          {error ||
            "Failed to initialize IndexedDB. This could be due to private browsing mode or storage permissions."}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">Notes App with IndexedDB</h3>
          <p className="text-sm text-muted-foreground">Create, edit, and delete notes that persist offline</p>
        </div>
        <div className="flex items-center gap-2">
          {isOffline && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              Offline Mode
            </Badge>
          )}
          <Button onClick={addNote} className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Notes</h3>
          {notes.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-muted/20">
              <p className="text-muted-foreground">No notes yet. Create your first note!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {notes.map((note) => (
                <Card
                  key={note.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    currentNote?.id === note.id ? "border-primary" : ""
                  }`}
                  onClick={() => selectNote(note)}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base truncate">{note.title}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNote(note.id!)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">Updated: {formatDate(note.updatedAt)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          {currentNote ? (
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {isEditing ? (
                      <Input
                        value={currentNote.title}
                        onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                        className="text-lg font-bold"
                      />
                    ) : (
                      currentNote.title
                    )}
                  </CardTitle>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            // Revert changes
                            const originalNote = notes.find((n) => n.id === currentNote.id)
                            if (originalNote) {
                              setCurrentNote(originalNote)
                            }
                            setIsEditing(false)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button variant="default" size="icon" onClick={() => updateNote(currentNote)}>
                          <Save className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {isEditing ? (
                  <Textarea
                    value={currentNote.content}
                    onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                    className="min-h-[200px]"
                  />
                ) : (
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{currentNote.content}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
                <span>Created: {formatDate(currentNote.createdAt)}</span>
                <span>Updated: {formatDate(currentNote.updatedAt)}</span>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full border rounded-md bg-muted/20 p-8">
              <div className="text-center">
                <h3 className="font-medium mb-2">No Note Selected</h3>
                <p className="text-sm text-muted-foreground mb-4">Select a note from the list or create a new one</p>
                <Button onClick={addNote} className="flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Note
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md bg-muted p-4">
        <h4 className="text-sm font-medium mb-2">How it works:</h4>
        <p className="text-sm text-muted-foreground">
          This example demonstrates using IndexedDB to create a fully functional notes app that works offline. IndexedDB
          is a low-level API for client-side storage of significant amounts of structured data, including files and
          blobs. Unlike localStorage, it's asynchronous and can handle much larger amounts of data.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          The app creates an object store for notes, with indexes for efficient querying. All operations (create, read,
          update, delete) are performed directly on the database, allowing the app to work even when offline. Changes
          persist across browser sessions and page reloads.
        </p>
      </div>
    </div>
  )
}

