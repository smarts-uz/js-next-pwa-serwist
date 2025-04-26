"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Mic, MicOff, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type PermissionStatus = "granted" | "denied" | "prompt";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: () => void;
  onend: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const SpeechRecognitionPage = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [isContinuous, setIsContinuous] = useState(false);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>("prompt");

  useEffect(() => {
    // Check if Speech Recognition is supported
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);

        // Request microphone permission
        if (navigator.permissions && navigator.permissions.query) {
          navigator.permissions
            .query({ name: "microphone" as PermissionName })
            .then((permissionStatus) => {
              setPermissionStatus(permissionStatus.state as PermissionStatus);
              permissionStatus.onchange = () => {
                setPermissionStatus(permissionStatus.state as PermissionStatus);
              };
            })
            .catch((error) => {
              console.error("Error checking microphone permission:", error);
            });
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = isContinuous;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const results = event.results;
          const lastResult = results[results.length - 1];
          const transcript = lastResult[0].transcript;
          const confidence = lastResult[0].confidence;

          if (lastResult.isFinal) {
            setTranscript((prev) => prev + (prev ? " " : "") + transcript);
          } else {
            setInterimTranscript(transcript);
          }
          setConfidence(confidence);
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [selectedLanguage, isContinuous]);

  const startListening = async () => {
    if (permissionStatus === "denied") {
      // If permission was denied, try to request it again
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        setPermissionStatus("granted");
      } catch (error) {
        console.error("Error requesting microphone permission:", error);
        return;
      }
    }

    if (recognition) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const clearTranscript = () => {
    setTranscript("");
    setInterimTranscript("");
    setConfidence(0);
  };

  const languages = [
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "it-IT", name: "Italian" },
    { code: "pt-BR", name: "Portuguese (Brazil)" },
    { code: "ja-JP", name: "Japanese" },
    { code: "ko-KR", name: "Korean" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
  ];

  return (
    <>
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Speech Recognition API
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Convert speech to text with real-time transcription
        </p>
      </div>

      {!isSupported && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Supported</AlertTitle>
          <AlertDescription>
            The Speech Recognition API is not supported in your browser.
          </AlertDescription>
        </Alert>
      )}

      {permissionStatus === "denied" && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Microphone Access Denied</AlertTitle>
          <AlertDescription>
            Please enable microphone access in your browser settings to use
            speech recognition.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Speech Recognition</CardTitle>
            <CardDescription>
              Real-time speech-to-text conversion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Recognition Mode</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant={isContinuous ? "default" : "outline"}
                  onClick={() => setIsContinuous(false)}
                  className="flex-1"
                >
                  Single Utterance
                </Button>
                <Button
                  variant={isContinuous ? "outline" : "default"}
                  onClick={() => setIsContinuous(true)}
                  className="flex-1"
                >
                  Continuous
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Transcription</Label>
              <div className="relative">
                <Textarea
                  value={
                    transcript +
                    (interimTranscript ? ` ${interimTranscript}` : "")
                  }
                  readOnly
                  className="min-h-[200px]"
                  placeholder="Your speech will appear here..."
                />
                {confidence > 0 && (
                  <Badge variant="secondary" className="absolute top-2 right-2">
                    Confidence: {Math.round(confidence * 100)}%
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={!isSupported || permissionStatus === "denied"}
              className="flex-1"
            >
              {isListening ? (
                <>
                  <MicOff className="mr-2 h-4 w-4" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Listening
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={clearTranscript}
              disabled={!transcript && !interimTranscript}
              className="flex-1"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>
              Understanding the Speech Recognition API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  What is the Speech Recognition API?
                </h3>
                <p className="text-sm text-muted-foreground">
                  The Speech Recognition API enables web applications to convert
                  spoken language into text. It provides real-time transcription
                  with support for multiple languages and continuous recognition
                  modes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Key Features</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                  <li>Real-time speech-to-text conversion</li>
                  <li>Multiple language support</li>
                  <li>Continuous and single utterance modes</li>
                  <li>Confidence scoring</li>
                  <li>Interim results</li>
                  <li>Error handling</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Browser Support</h3>
                <p className="text-sm text-muted-foreground">
                  The Speech Recognition API is supported in most modern
                  browsers. Some browsers may require HTTPS and explicit user
                  permission.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Best Practices</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                  <li>Check for API support</li>
                  <li>Request microphone permissions</li>
                  <li>Handle recognition errors</li>
                  <li>Provide visual feedback</li>
                  <li>Consider user privacy</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Example Use Cases</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                  <li>Voice commands</li>
                  <li>Dictation tools</li>
                  <li>Voice search</li>
                  <li>Accessibility features</li>
                  <li>Language learning apps</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SpeechRecognitionPage;
