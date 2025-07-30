"use client"
import React from 'react';

interface Device {
  id: string;
  name: string;
  status: 'on' | 'off';
}

interface SmartHomePanelProps {
  devices: Device[];
}

export const SmartHomePanel: React.FC<SmartHomePanelProps> = ({ devices }) => {
  return (
    <div className="glass-pane p-4 h-full">
      <h2 className="text-xl font-bold mb-4">Smart Home</h2>
      <div className="grid grid-cols-2 gap-4">
        {devices.map(device => (
          <div key={device.id} className="p-4 rounded-lg bg-background-light">
            <h3 className="font-semibold">{device.name}</h3>
            <p>Status: {device.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
