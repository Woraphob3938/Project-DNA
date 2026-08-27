import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/apiAuth';
import { dnaExtractRequestSchema } from '@/lib/schemas';
import { extractDnaWithGemini } from '@/lib/geminiService';

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAuthenticatedUser();
    if (authError) return authError;

    const parsed = dnaExtractRequestSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: 'Text is required (1–20,000 characters)' }, { status: 400 });
    }

    const data = await extractDnaWithGemini(parsed.data.text);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API DNA Extract Error:', error);
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
