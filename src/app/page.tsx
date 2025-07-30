"use client"
import React, { useState, useEffect } from 'react';
import { Orb } from '../../components/Orb';
import { CommandLog } from '../../components/CommandLog';
import { useVoiceControl } from '../../components/VoiceControl';
import { SmartHomePanel } from '../../components/SmartHomePanel';
import { VideoGenerationPanel } from '../../components/VideoGenerationPanel';

type Log = {
  type: 'user' | 'ai';
  text: string;
};

interface Device {
  id: string;
  name: string;
  status: 'on' | 'off';
}

export default function Home() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoTopic, setVideoTopic] = useState("");

  useEffect(() => {
    const fetchDevices = async () => {
      const res = await fetch('/api/devices');
      const data = await res.json();
      setDevices(data);
    };
    fetchDevices();
  }, []);

  const handleCommand = async (command: string) => {
    setLogs(prev => [...prev, { type: 'user', text: command }]);

    if (command.toLowerCase().includes('create video')) {
      const topic = command.split('create video about ')[1] || 'a random topic';
      setVideoTopic(topic);
      setIsGeneratingVideo(true);
      setTimeout(() => setIsGeneratingVideo(false), 5000); // Simulate generation time
    }

    const res = await fetch("/api/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command }),
    });

    if (!res.body) return;

    if (res.headers.get("Content-Type")?.includes("application/json")) {
      const result = await res.json();
      setLogs(prev => [...prev, { type: 'ai', text: result.reply }]);
      if (result.device) {
        setDevices(prev => prev.map(d => d.id === result.device.id ? result.device : d));
      }
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";
    setLogs(prev => [...prev, { type: 'ai', text: "" }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const json = line.substring(6);
          if (json === '[DONE]') {
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices[0]?.delta?.content || "";
            fullResponse += content;

            setLogs(prev => {
              const newLogs = [...prev];
              newLogs[newLogs.length - 1].text = fullResponse;
              return newLogs;
            });
          } catch (e) {
            console.error("Error parsing stream JSON", e);
          }
        }
      }
    }
  };

  const { isListening, startRecognition } = useVoiceControl(handleCommand);

  return (
    <main className="p-8 grid grid-cols-3 gap-8 h-screen">
      <div className="col-span-2 space-y-8">
        <SmartHomePanel devices={devices} />
        <VideoGenerationPanel isGenerating={isGeneratingVideo} topic={videoTopic} />
      </div>
      <div className="col-span-1">
        <CommandLog logs={logs} />
      </div>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <Orb isListening={isListening} onClick={startRecognition} />
      </div>
    </main>
  );
}
