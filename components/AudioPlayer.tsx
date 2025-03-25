'use client'
import React, { useEffect, useRef, useState } from 'react';

const AudioPlayer: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
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

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const newTime = (e.target.value as unknown as number) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
        }
    };

    const updateProgress = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime / audioRef.current.duration);
        }
    };

    return (
        <div className="p-4">
            <audio ref={audioRef} src="/pop.mp3" preload="auto" onTimeUpdate={updateProgress} />
            <div className="flex items-center space-x-2">
                <button onClick={isPlaying ? pause : play} className="bg-blue-500 text-white p-2 rounded">
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={stop} className="bg-red-500 text-white p-2 rounded">Stop</button>
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="flex-1" />
            </div>
            <input type="range" min="0" max="1" step="0.01" value={progress} onChange={handleProgressChange} className="w-full mt-2" />
        </div>
    );
};

export default AudioPlayer;
