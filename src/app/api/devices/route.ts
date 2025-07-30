import { NextResponse } from 'next/server';
import { getDevices } from '../../../lib/smart-home';

export async function GET() {
  const devices = await getDevices();
  return NextResponse.json(devices);
}
