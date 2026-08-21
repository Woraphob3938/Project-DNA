import { NextRequest, NextResponse } from 'next/server';
import { generateGapAnalysis } from '@/lib/geminiService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const projectTitle = body.title || body.projectTitle;
    const techStack = body.techStack || body.tech_stack || [];
    const problem = body.problem || body.problem_statement || '';

    if (!projectTitle) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const gaps = await generateGapAnalysis(projectTitle, techStack, problem);
    return NextResponse.json({ success: true, data: gaps, gaps });
  } catch (error: any) {
    console.error('API Gap Analyze Error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
