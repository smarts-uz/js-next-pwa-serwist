'use client';
import { useState } from 'react';

const TransitionsPage = () => {
  const [transitionType, setTransitionType] = useState<string>('slide');

  const handleTransition = (type: string) => {
    if (!document.startViewTransition) {
      setTransitionType(type);
      return;
    }

    document.startViewTransition(() => {
      setTransitionType(type);
    });
  };

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>View Transitions</h1>
      <p className='text-muted-foreground'>
        Explore different types of view transitions.
      </p>

      <div className='flex gap-2'>
        <button onClick={() => handleTransition('slide')}>Slide</button>
        <button onClick={() => handleTransition('fade')}>Fade</button>
        <button onClick={() => handleTransition('flip')}>Flip</button>
      </div>

      <div className={`transition-content ${transitionType}`}>
        <p>Current Transition: {transitionType}</p>
      </div>
    </div>
  );
};

export default TransitionsPage;
