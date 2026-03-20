import { NextResponse } from 'next/server';
import { processTriageData } from '@/services/triageService';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload format' }, { status: 400 });
    }

    if (!body?.image || !body?.text) {
      return NextResponse.json({ error: 'Missing required fields: image and text' }, { status: 400 });
    }

    const { image, text } = body;

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
