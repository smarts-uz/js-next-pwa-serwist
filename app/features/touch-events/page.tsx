"use client";

import { useTouchEvents } from "@/app/features/touch-events/useTouchEvents";
import { useEffect, useState } from "react";

export default function TouchEventsFeature() {
  const { scale, bind } = useTouchEvents();
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported("ontouchstart" in window);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Multi Touch Demo</h1>

      {!isSupported && (
        <div className="bg-yellow-900 border-l-4 rounded border-yellow-500 text-yellow-200 p-4 mb-4">
          <p>This feature requires a touch-enabled device.</p>
        </div>
      )}

      <div className="mb-4">
        <p className="text-lg">Scale: {scale.toFixed(2)}x</p>
      </div>

      <div
        {...bind}
        className="w-full h-96 bg-gray-100 rounded-lg relative overflow-hidden flex items-center justify-center"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          transition: "transform 0.05s ease-out",
        }}
      >
        <div className="text-center">
          <div className="animate-bounce mb-4">
            <svg
              className="w-12 h-12 mx-auto text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
          </div>
          <p className="text-xl mb-2 text-neutral-900">Pinch to zoom</p>
          <p className="text-sm text-gray-600">
            Use two fingers to zoom in/out
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <h3 className="font-semibold">Touch Events Use Cases:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Mobile games and interactive apps</li>
            <li>• Drawing and painting applications</li>
            <li>• Gesture-based navigation</li>
            <li>• Multi-touch zoom and pan interfaces</li>
            <li>• Touch-based form inputs and controls</li>
            <li>• Interactive maps and visualizations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
