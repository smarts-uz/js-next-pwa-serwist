// Import React and the VibrationExample component
import React from 'react';
import VibrationExample from '@/components/VibrationExample';

const VibrationPage: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Vibration API Examples</h1>
            <VibrationExample />
        </div>
    );
};

export default VibrationPage;
