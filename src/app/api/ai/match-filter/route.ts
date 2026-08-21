import { NextRequest, NextResponse } from 'next/server';
import { rankProjectsWithAi } from '@/lib/geminiService';
import { dnaService } from '@/lib/dnaService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, projects: providedProjects } = body;

    // Use provided projects or fetch from dnaService
    const candidateProjects = providedProjects && providedProjects.length > 0 
      ? providedProjects 
      : await dnaService.getProjects();

    const output = await rankProjectsWithAi(profile || {}, candidateProjects);

    return NextResponse.json({
      success: true,
      data: output.results || output,
      summary: output.curated_summary || ''
    });
  } catch (error: any) {
    console.error('API /api/ai/match-filter error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to match projects'
      },
      { status: 500 }
    );
  }
}
