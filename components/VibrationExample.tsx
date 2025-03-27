'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Play, Square, Zap } from "lucide-react";

const VibrationExample: React.FC = () => {
    const [isVibrationSupported, setIsVibrationSupported] = useState(false);
    const [duration, setDuration] = useState(200);
    const [pattern, setPattern] = useState([100, 50, 100, 50, 100]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Check if the Vibration API is supported
        setIsVibrationSupported('vibrate' in navigator);
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
                navigator.vibrate(0);
            }
        };
    }, [intervalId]);

    const vibrate = () => {
        if (isVibrationSupported) {
            navigator.vibrate(duration);
        }
    };

    const vibratePattern = () => {
        if (isVibrationSupported) {
            navigator.vibrate(pattern);
        }
    };

    const togglePattern = () => {
        if (isPlaying) {
            clearInterval(intervalId!);
            navigator.vibrate(0);
            setIsPlaying(false);
        } else {
            const id = setInterval(vibratePattern, 2000);
            setIntervalId(id);
            setIsPlaying(true);
        }
    };

    const updatePattern = (index: number, value: string) => {
        const newPattern = [...pattern];
        newPattern[index] = parseInt(value) || 0;
        setPattern(newPattern);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Badge variant={isVibrationSupported ? "default" : "destructive"}>
                    {isVibrationSupported ? 'Supported' : 'Not Supported'}
                </Badge>
            </div>

            <Card className="p-4">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Duration (ms)</Label>
                        <div className="flex gap-4 items-center">
                            <Slider
                                value={[duration]}
                                onValueChange={(value) => setDuration(value[0])}
                                min={0}
                                max={1000}
                                step={10}
                                className="flex-1"
                            />
                            <Input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                                className="w-24"
                            />
                        </div>
                    </div>

                    <Button onClick={vibrate} className="w-full">
                        <Zap className="mr-2 h-4 w-4" />
                        Vibrate ({duration}ms)
                    </Button>
                </div>
            </Card>

            <Card className="p-4">
                <div className="space-y-4">
                    <Label>Pattern (ms)</Label>
                    <div className="flex gap-2 flex-wrap">
                        {pattern.map((value, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={value}
                                    onChange={(e) => updatePattern(index, e.target.value)}
                                    className="w-20"
                                />
                                <span className="text-sm text-muted-foreground">ms</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={vibratePattern} className="flex-1">
                            <Play className="mr-2 h-4 w-4" />
                            Play Pattern
                        </Button>
                        <Button onClick={togglePattern} variant={isPlaying ? "destructive" : "default"}>
                            {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default VibrationExample;
