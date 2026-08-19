import { NextRequest, NextResponse } from 'next/server';
import { generateGapAnalysis } from '@/lib/geminiService';

export async function POST(req: NextRequest) {
  try {
    const { title, techStack, problem } = await req.json();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const gaps = await generateGapAnalysis(title, techStack || [], problem || '');
    return NextResponse.json({ success: true, gaps });
  } catch (error: any) {
    console.error('API Gap Analyze Error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
