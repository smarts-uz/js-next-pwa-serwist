'use client';
import { useState } from 'react';

const MediaCapturePage = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const startCapture = async (mediaType: 'video' | 'audio') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        [mediaType]: true,
      });
      setMediaStream(stream);
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>Media Capture</h1>
      <p className='text-muted-foreground'>
        Capture audio or video from your device.
      </p>

      <div className='flex gap-2'>
        <button onClick={() => startCapture('video')} className='btn'>Capture Video</button>
        <button onClick={() => startCapture('audio')} className='btn'>Capture Audio</button>
      </div>

      {mediaStream && (
        <video autoPlay controls className='w-full' ref={video => { if (video) video.srcObject = mediaStream; }} />
      )}
    </div>
  );
};

export default MediaCapturePage;
