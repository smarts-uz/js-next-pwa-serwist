'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, MicOff, Square, Circle } from 'lucide-react'

export function AudioCaptureExample() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [recording, setRecording] = useState<Blob | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const startAudioCapture = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      })
      
      setStream(mediaStream)
      if (audioRef.current) {
        audioRef.current.srcObject = mediaStream
      }

      // Set up audio analysis
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      const source = audioContext.createMediaStreamSource(mediaStream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = 0.8
      source.connect(analyser)
      analyserRef.current = analyser

      // Start analyzing audio levels
      const dataArray = new Float32Array(analyser.frequencyBinCount)
      const updateAudioLevel = () => {
        analyser.getFloatTimeDomainData(dataArray)
        let sum = 0
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i]
        }
        const rms = Math.sqrt(sum / dataArray.length)
        setAudioLevel(Math.min(rms * 3, 1))
        if (stream) {
          requestAnimationFrame(updateAudioLevel)
        }
      }
      updateAudioLevel()
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setError('Failed to access microphone. Please check permissions.')
    }
  }

  const stopAudioCapture = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      if (audioRef.current) {
        audioRef.current.srcObject = null
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
      setAudioLevel(0)
    }
  }

  const startRecording = () => {
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setRecording(blob)
        setIsRecording(false)
      }

      mediaRecorder.start()
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={stream ? stopAudioCapture : startAudioCapture} 
          variant={stream ? "secondary" : "default"}
        >
          {stream ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
          {stream ? "Stop Microphone" : "Start Microphone"}
        </Button>
        <Button 
          onClick={isRecording ? stopRecording : startRecording} 
          disabled={!stream || (isRecording === false && recording !== null)}
          variant={isRecording ? "destructive" : "default"}
        >
          {isRecording ? <Square className="h-4 w-4 mr-2" /> : <Circle className="h-4 w-4 mr-2" />}
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="space-y-4">
            <audio
              ref={audioRef}
              autoPlay
              muted
              className="w-full"
            />
            {stream && (
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-100"
                    style={{ width: `${audioLevel * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Audio Level: {Math.round(audioLevel * 100)}%
                </p>
              </div>
            )}
          </div>
        </Card>
        {recording && (
          <Card className="p-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Recorded Audio</h3>
              <audio
                src={URL.createObjectURL(recording)}
                controls
                className="w-full"
              />
              <Button
                onClick={() => setRecording(null)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Clear Recording
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
} 