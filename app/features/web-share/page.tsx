import React from 'react';
import WebShareExample from '@/components/WebShareExample';

const WebSharePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Web Share API Feature</h1>
      <WebShareExample />
    </div>
  );
};

export default WebSharePage;
