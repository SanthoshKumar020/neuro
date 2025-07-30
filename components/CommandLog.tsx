"use client"
import React from 'react';
interface CommandLogProps {
  logs: { type: 'user' | 'ai'; text: string }[];
}

export const CommandLog: React.FC<CommandLogProps> = ({ logs }) => {
  return (
    <div className="glass-pane p-4 h-full flex flex-col-reverse">
      <div className="overflow-y-auto">
        {logs.map((log, index) => (
          <div key={index} className={`mb-2 ${log.type === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${log.type === 'user' ? 'bg-accent-blue text-white' : 'bg-background-light'}`}>
              {log.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
