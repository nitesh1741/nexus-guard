import { NextResponse } from 'next/server';
import { processTriageData } from '@/services/triageService';

export async function POST(req: Request) {
  try {
    const { image, text } = await req.json();

    const jsonResponse = await processTriageData(image, text);

    return NextResponse.json(jsonResponse);
  } catch (error: unknown) {
    console.error('API Route Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('required') ? 400 : 500;
    return NextResponse.json(
      { error: message || 'An error occurred during generative triage.' },
      { status }
    );
  }
}
