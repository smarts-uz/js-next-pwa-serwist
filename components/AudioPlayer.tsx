'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Square, Volume2, VolumeX, BookOpen, Info, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

/**
 * AudioPlayer Component
 * 
 * A modern audio player with the following features:
 * - Play/Pause/Stop controls
 * - Volume control
 * - Progress bar
 * - Media Session API support
 * - Responsive design
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement MDN Audio Element}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaSession_API MDN Media Session API}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API MDN Web Audio API}
 * 
 * @example
 * ```tsx
 * <AudioPlayer />
 * ```
 * 
 * @remarks
 * Browser Support:
 * - HTMLAudioElement: All modern browsers
 * - MediaSession API: Chrome 57+, Firefox 71+, Safari 15.4+, Edge 79+
 * - Web Audio API: Chrome 14+, Firefox 25+, Safari 6+, Edge 12+
 * 
 * Use Cases:
 * - Podcast players
 * - Music streaming interfaces
 * - Audio book readers
 * - Sound effect players
 * - Voice message playback
 * - Educational content delivery
 * 
 * Implementation Details:
 * - Uses HTML5 Audio API for core functionality
 * - Implements MediaSession API for system-level controls
 * - Supports keyboard shortcuts through MediaSession
 * - Handles audio loading and buffering
 * - Provides visual feedback for playback state
 */
const AudioPlayer: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        // Check browser support
        setIsSupported('HTMLAudioElement' in window);
        
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: 'Pop Sound',
                artist: 'Your Artist',
                album: 'Your Album',
            });

            navigator.mediaSession.setActionHandler('play', play);
            navigator.mediaSession.setActionHandler('pause', pause);
        }
    }, []);

    const play = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    const handleVolumeChange = (value: number[]) => {
        const newVolume = value[0];
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const handleProgressChange = (value: number[]) => {
        if (audioRef.current) {
            const newTime = value[0] * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
        }
    };

    const updateProgress = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime / audioRef.current.duration);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? volume : 0;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Audio Player</CardTitle>
                            <CardDescription>Play audio with media controls</CardDescription>
                        </div>
                        <Link 
                            href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement" 
                            target="_blank"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <BookOpen className="h-4 w-4" />
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isSupported && (
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                Your browser doesn't support the required audio features. Please update to a modern browser.
                            </AlertDescription>
                        </Alert>
                    )}
                    
                    <audio ref={audioRef} src="/pop.mp3" preload="auto" onTimeUpdate={updateProgress} />
                    
                    <div className="flex items-center justify-center space-x-2">
                        <Button variant="outline" size="icon" onClick={isPlaying ? pause : play}>
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="icon" onClick={stop}>
                            <Square className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" onClick={toggleMute}>
                                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </Button>
                            <Slider
                                value={[volume]}
                                onValueChange={handleVolumeChange}
                                max={1}
                                step={0.01}
                                className="w-full"
                            />
                        </div>
                        <Slider
                            value={[progress]}
                            onValueChange={handleProgressChange}
                            max={1}
                            step={0.01}
                            className="w-full"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Documentation</CardTitle>
                    <CardDescription>Learn about the Audio Player features and capabilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Collapsible>
                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                                <Info className="h-4 w-4" />
                                <span>Browser Support</span>
                            </div>
                            <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2 space-y-2">
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <span>HTMLAudioElement</span>
                                    <Badge variant="outline">All modern browsers</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>MediaSession API</span>
                                    <Badge variant="outline">Chrome 57+, Firefox 71+</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Web Audio API</span>
                                    <Badge variant="outline">Chrome 14+, Firefox 25+</Badge>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    <Collapsible>
                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                                <BookOpen className="h-4 w-4" />
                                <span>Use Cases</span>
                            </div>
                            <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2">
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Podcast players</li>
                                <li>Music streaming interfaces</li>
                                <li>Audio book readers</li>
                                <li>Sound effect players</li>
                                <li>Voice message playback</li>
                                <li>Educational content delivery</li>
                            </ul>
                        </CollapsibleContent>
                    </Collapsible>

                    <Collapsible>
                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                                <Info className="h-4 w-4" />
                                <span>Implementation Details</span>
                            </div>
                            <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2">
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Uses HTML5 Audio API for core functionality</li>
                                <li>Implements MediaSession API for system-level controls</li>
                                <li>Supports keyboard shortcuts through MediaSession</li>
                                <li>Handles audio loading and buffering</li>
                                <li>Provides visual feedback for playback state</li>
                            </ul>
                        </CollapsibleContent>
                    </Collapsible>
                </CardContent>
            </Card>
        </div>
    );
};

export default AudioPlayer;
