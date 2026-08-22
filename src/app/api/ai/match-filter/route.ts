import { NextRequest, NextResponse } from 'next/server';
import type { UserMatchProfile } from '@/types/dna';
import { userMatchProfileSchema } from '@/lib/schemas';
import { rankProjectsWithAi } from '@/lib/geminiService';
import { dnaService } from '@/lib/dnaService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = userMatchProfileSchema.safeParse(
      body && typeof body === 'object' ? body.profile ?? {} : {}
    );

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid match profile payload' },
        { status: 400 }
      );
    }

    const profile: UserMatchProfile = parsed.data;

    // Always rank against the server-side data layer. Never trust a project
    // list supplied by the client — it is an unvalidated prompt-injection and
    // data-layer bypass vector.
    const candidateProjects = await dnaService.getProjects();

    const output = await rankProjectsWithAi(profile, candidateProjects);

    return NextResponse.json({
      success: true,
      data: output.results || output,
      summary: output.curated_summary || ''
    });
  } catch (error) {
    console.error('API /api/ai/match-filter error:', error);
    const message = error instanceof Error ? error.message : 'Failed to match projects';
    return NextResponse.json(
      {
        success: false,
        error: message
      },
      { status: 500 }
    );
  }
}
