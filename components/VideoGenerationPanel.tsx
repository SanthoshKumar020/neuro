"use client"
import React, { useState, useEffect } from 'react';

interface VideoGenerationPanelProps {
  isGenerating: boolean;
  topic: string;
}

export const VideoGenerationPanel: React.FC<VideoGenerationPanelProps> = ({ isGenerating, topic }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <div className="glass-pane p-4 h-full">
      <h2 className="text-xl font-bold mb-4">Video Generation</h2>
      <p className="mb-2">Creating a video about: {topic}</p>
      <div className="w-full bg-background-light rounded-full h-4">
        <div
          className="bg-accent-blue h-4 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-right">{progress}%</p>
    </div>
  );
};
