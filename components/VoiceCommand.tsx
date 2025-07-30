"use client"
import { useState } from "react";

export const VoiceCommand = () => {
  const [text, setText] = useState("");

  const startRecognition = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setText(result);
      handleCommand(result);
    };
    recognition.start();
  };

  const handleCommand = async (command: string) => {
    const res = await fetch("/api/command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command }),
    });
    const result = await res.json();
    alert(result.reply);
  };

  return (
    <div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={startRecognition}>
        🎙 Speak
      </button>
      <p className="mt-4">You said: {text}</p>
    </div>
  );
};

