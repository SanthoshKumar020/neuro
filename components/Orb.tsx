"use client"
import React from 'react';

interface OrbProps {
  isListening: boolean;
  onClick: () => void;
}

export const Orb: React.FC<OrbProps> = ({ isListening, onClick }) => {
  return (
    <div
      className={`orb w-40 h-40 rounded-full flex items-center justify-center bg-accent-blue ${isListening ? 'orb-listening' : 'orb-idle'}`}
      onClick={onClick}
    >
      <span className="text-white text-lg font-semibold">
        {isListening ? 'Listening...' : 'Speak'}
      </span>
    </div>
  );
};
