import { NextRequest, NextResponse } from 'next/server';
import { askGPT } from '../../../../lib/gpt';
import { handleDeviceCommand } from '../../../../lib/smart-home';
import { generateVideo } from '../../../../lib/video-pipeline';

export async function POST(req: NextRequest) {
  const { command } = await req.json();

  // Attempt to handle as a smart home command first
  const deviceResult = await handleDeviceCommand(command);
  if (deviceResult && deviceResult.success) {
    return NextResponse.json({
      reply: `Okay, I've turned the ${deviceResult.device.name} ${deviceResult.device.status}.`,
      device: deviceResult.device,
    });
  }

  if (command.includes("create video")) {
    await generateVideo("emotional story about hope");
    return NextResponse.json({ reply: "Video is being generated." });
  }

  const stream = await askGPT(command, true);
  return new NextResponse(stream as ReadableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}

