"use client"
import React from 'react';
import { VoiceCommand } from '../../components/VoiceCommand';


export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Neura Control Center</h1>
      <VoiceCommand />
    </main>
  );
}
