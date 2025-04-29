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
import { AlertCircle, Volume2, Pause, Play, VolumeX } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface Voice extends SpeechSynthesisVoice {
  voiceURI: string;
}

const SpeechSynthesisExample = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [text, setText] = useState(
    "Hello! This is a demonstration of the Web Speech Synthesis API. You can type any text here and have it read aloud."
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Check if Speech Synthesis is supported
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
      loadVoices();
    }

    // Listen for voice changes
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const loadVoices = () => {
    const availableVoices = window.speechSynthesis.getVoices();
    setVoices(availableVoices);
    if (availableVoices.length > 0 && !selectedVoice) {
      setSelectedVoice(availableVoices[0].voiceURI);
    }
  };

  const speak = () => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const voice = voices.find((v) => v.voiceURI === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onpause = () => setIsPaused(true);
    utterance.onresume = () => setIsPaused(false);

    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    window.speechSynthesis.pause();
  };

  const resume = () => {
    window.speechSynthesis.resume();
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <>
      {!isSupported && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Supported</AlertTitle>
          <AlertDescription>
            The Speech Synthesis API is not supported in your browser.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Text to Speech</CardTitle>
          <CardDescription>
            Enter text and customize speech settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Text to Speak</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[100px]"
              placeholder="Enter text to convert to speech..."
            />
          </div>

          <div className="space-y-2 ">
            <Label htmlFor="voice">Voice</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent className="w-min">
                {voices.map((voice) => (
                  <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Speech Rate</Label>
            <Slider
              value={[rate]}
              onValueChange={([value]) => setRate(value)}
              min={0.5}
              max={2}
              step={0.1}
            />
            <div className="text-sm text-muted-foreground text-center">
              {rate.toFixed(1)}x
            </div>
          </div>

          <div className="space-y-2">
            <Label>Pitch</Label>
            <Slider
              value={[pitch]}
              onValueChange={([value]) => setPitch(value)}
              min={0.5}
              max={2}
              step={0.1}
            />
            <div className="text-sm text-muted-foreground text-center">
              {pitch.toFixed(1)}x
            </div>
          </div>

          <div className="space-y-2">
            <Label>Volume</Label>
            <Slider
              value={[volume]}
              onValueChange={([value]) => setVolume(value)}
              min={0}
              max={1}
              step={0.1}
            />
            <div className="text-sm text-muted-foreground text-center">
              {Math.round(volume * 100)}%
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Button
            onClick={isPaused ? resume : isSpeaking ? pause : speak}
            disabled={!isSupported}
            className="flex-1"
          >
            {isPaused ? (
              <>
                <Play className="mr-2 h-4 w-4" />
                Resume
              </>
            ) : isSpeaking ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                Speak
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            onClick={stop}
            disabled={!isSpeaking && !isPaused}
            className="flex-1"
          >
            <VolumeX className="mr-2 h-4 w-4" />
            Stop
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default SpeechSynthesisExample;
