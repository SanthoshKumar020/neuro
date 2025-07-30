"use client"
import { useState } from "react";

export const useVoiceControl = (onCommand: (command: string) => void) => {
  const [isListening, setIsListening] = useState(false);

  const startRecognition = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => {
      setIsListening(true);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      onCommand(result);
    };
    recognition.start();
  };

  return { isListening, startRecognition };
};
