"use client"
import React from 'react';

interface OrbProps {
  isListening: boolean;
  isProcessing: boolean;
  onClick: () => void;
}

export const Orb: React.FC<OrbProps> = ({ isListening, isProcessing, onClick }) => {
  return (
    <div
      className={`orb w-40 h-40 rounded-full flex items-center justify-center bg-accent-blue ${isListening ? 'orb-listening' : isProcessing ? 'orb-processing' : 'orb-idle'}`}
      onClick={onClick}
    >
      <span className="text-white text-lg font-semibold">
        {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Speak'}
      </span>
    </div>
  );
};
