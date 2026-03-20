import { NextResponse } from 'next/server';
import { processTriageData } from '@/services/triageService';

/** Common security/cache headers for all triage API responses. */
const RESPONSE_HEADERS = {
  'Cache-Control': 'no-store, no-cache',
  'X-Content-Type-Options': 'nosniff',
};

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload format' },
        { status: 400, headers: RESPONSE_HEADERS }
      );
    }

    if (!body?.image && !body?.text) {
      return NextResponse.json(
        { error: 'Missing required fields: please provide at least an image or text' },
        { status: 400, headers: RESPONSE_HEADERS }
      );
    }

    const { image, text } = body;
    const jsonResponse = await processTriageData(image || '', text || '');

    return NextResponse.json(jsonResponse, { headers: RESPONSE_HEADERS });
  } catch (err: unknown) {
    console.error('API Route Error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    const status = message.includes('required') ? 400 : 500;
    return NextResponse.json(
      { error: message || 'An error occurred during generative triage.' },
      { status, headers: RESPONSE_HEADERS }
    );
  }
}
