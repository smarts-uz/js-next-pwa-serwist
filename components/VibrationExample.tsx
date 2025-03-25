'use client'

import React, { useState, useEffect } from 'react';

const VibrationExample: React.FC = () => {
    const [isVibrationSupported, setIsVibrationSupported] = useState(false);

    useEffect(() => {
        // Check if the Vibration API is supported
        setIsVibrationSupported('vibrate' in navigator);
    }, []);

    const vibrate = () => {
        if (isVibrationSupported) {
            navigator.vibrate(200);
        }
    };

    const vibratePattern = () => {
        if (isVibrationSupported) {
            navigator.vibrate([100, 50, 100, 50, 100]);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Vibration API Examples</h1>
            <p className="mb-2">Vibration API is <span className='font-bold'>{isVibrationSupported ? 'available' : 'not available'}</span> on this device.</p>
            <button onClick={vibrate} className="bg-blue-500 text-white p-2 rounded mr-2">Vibrate for 200ms</button>
            <button onClick={vibratePattern} className="bg-green-500 text-white p-2 rounded">Vibrate Pattern</button>
        </div>
    );
};

export default VibrationExample;
