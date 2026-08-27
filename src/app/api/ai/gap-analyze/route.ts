import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/apiAuth';
import { gapAnalyzeRequestSchema } from '@/lib/schemas';
import { generateGapAnalysis } from '@/lib/geminiService';

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAuthenticatedUser();
    if (authError) return authError;

    const parsed = gapAnalyzeRequestSchema.safeParse(await req.json().catch(() => null));
    const title = parsed.success ? parsed.data.title || parsed.data.projectTitle : undefined;

    if (!parsed.success || !title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const techStack = parsed.data.techStack ?? parsed.data.tech_stack ?? [];
    const problem = parsed.data.problem ?? parsed.data.problem_statement ?? '';

    const gaps = await generateGapAnalysis(title, techStack, problem);
    return NextResponse.json({ success: true, data: gaps, gaps });
  } catch (error) {
    console.error('API Gap Analyze Error:', error);
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
