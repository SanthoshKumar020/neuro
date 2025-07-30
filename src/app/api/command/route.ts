import { NextRequest, NextResponse } from 'next/server';
import { askGPT } from '../../../../lib/gpt';
import { controlDevice } from '../../../../lib/smart-home';
import { generateVideo } from '../../../../lib/video-pipeline';

export async function POST(req: NextRequest) {
  const { command } = await req.json();

  if (command.includes("create video")) {
    await generateVideo("emotional story about hope");
    return NextResponse.json({ reply: "Video is being generated." });
  }

  if (command.includes("turn off light")) {
    await controlDevice("light", "off");
    return NextResponse.json({ reply: "Light turned off." });
  }

  const response = await askGPT(command);
  return NextResponse.json({ reply: response });
}

