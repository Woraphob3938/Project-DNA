import { z } from 'zod';

/**
 * Request validation for the AI endpoints. All client-supplied payloads are
 * untrusted — these schemas cap sizes and reject unknown shapes before the
 * data ever reaches a prompt or the data layer.
 */

export const userMatchProfileSchema = z.object({
  query: z.string().max(2000).optional(),
  interest_areas: z.array(z.string().max(200)).max(50).optional(),
  current_skills: z.array(z.string().max(200)).max(50).optional(),
  target_goal: z.enum(['extend_code', 'use_dataset', 'solve_community', 'general_inspiration']).optional(),
  preferred_faculty_id: z.string().max(100).optional()
}).strict();

export const dnaExtractRequestSchema = z.object({
  text: z.string().min(1, 'Text is required').max(20000)
});

export const gapAnalyzeRequestSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  projectTitle: z.string().min(1).max(300).optional(),
  techStack: z.array(z.string().max(100)).max(50).optional(),
  tech_stack: z.array(z.string().max(100)).max(50).optional(),
  problem: z.string().max(5000).optional(),
  problem_statement: z.string().max(5000).optional()
});