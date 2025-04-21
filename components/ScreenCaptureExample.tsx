"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ScreenCaptureExample() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startScreenCapture = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing screen:", error);
    }
  };

  const stopScreenCapture = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const startRecording = () => {
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecording(blob);
      };

      mediaRecorder.start();
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={startScreenCapture} disabled={!!stream}>
          Start Screen Capture
        </Button>
        <Button onClick={stopScreenCapture} disabled={!stream}>
          Stop Screen Capture
        </Button>
        <Button onClick={startRecording} disabled={!stream}>
          Start Recording
        </Button>
        <Button onClick={stopRecording} disabled={!stream}>
          Stop Recording
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
        {recording && (
          <Card className="p-4">
            <video
              src={URL.createObjectURL(recording)}
              controls
              className="w-full rounded-lg"
            />
          </Card>
        )}
      </div>
    </div>
  );
}
