'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function MediaCaptureExample() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context?.drawImage(video, 0, 0)
      setPhoto(canvas.toDataURL('image/jpeg'))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={startCamera} disabled={!!stream}>
          Start Camera
        </Button>
        <Button onClick={stopCamera} disabled={!stream}>
          Stop Camera
        </Button>
        <Button onClick={takePhoto} disabled={!stream}>
          Take Photo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
        </Card>
        {photo && (
          <Card className="p-4">
            <img src={photo} alt="Captured photo" className="w-full rounded-lg" />
          </Card>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
} 