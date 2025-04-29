// Import React and the AudioPlayer component
import React from "react";
import AudioPlayer from "./components/AudioPlayer";

const AudioPlayerPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Audio Player</h1>
      <AudioPlayer />
    </div>
  );
};

export default AudioPlayerPage;
