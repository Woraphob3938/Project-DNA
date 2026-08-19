import { NextRequest, NextResponse } from 'next/server';
import { extractDnaWithGemini } from '@/lib/geminiService';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const data = await extractDnaWithGemini(text);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('API DNA Extract Error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
