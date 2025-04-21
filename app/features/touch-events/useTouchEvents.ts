import { useState, useCallback } from "react";

interface TouchEvents {
  scale: number;
  bind: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
}

export function useTouchEvents(): TouchEvents {
  const [scale, setScale] = useState(1);
  const [initialDistance, setInitialDistance] = useState(0);

  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setInitialDistance(getDistance(e.touches[0], e.touches[1]));
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const scaleFactor = currentDistance / initialDistance;
        // Add smaller steps for smoother zooming
        const newScale = scale * (1 + (scaleFactor - 1) * 0.5);
        setScale(Math.min(Math.max(newScale, 0.25), 1.25));
      }
    },
    [scale, initialDistance],
  );

  const handleTouchEnd = useCallback(() => {
    setInitialDistance(0);
  }, []);

  const bind = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return { scale, bind };
}
