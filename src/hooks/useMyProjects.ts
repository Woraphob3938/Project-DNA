'use client';

import { useCallback, useEffect, useState } from 'react';
import { dnaService } from '@/lib/dnaService';

const STORAGE_KEY = 'project_dna_my_projects';

/** Ids of projects this visitor created (client-side ownership registry). */
export function getMyProjectIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/** Register a newly created project as owned by this visitor. */
export function addMyProjectId(id: string): void {
  if (typeof window === 'undefined') return;
  const ids = getMyProjectIds();
  if (!ids.includes(id)) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([id, ...ids]));
    } catch {
      // ignore storage failures
    }
  }
}

/** Forget a deleted project in the local ownership registry. */
export function removeMyProjectId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const ids = getMyProjectIds().filter(existing => existing !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore storage failures
  }
}

/**
 * Resolve ownership: server (`projects.owner_id`) first, localStorage as a
 * fallback when Supabase is unavailable or nobody is signed in.
 */
export async function resolveMyProjectIds(): Promise<string[]> {
  const owned = await dnaService.getOwnedProjectIds();
  if (owned.length > 0) return owned;
  return getMyProjectIds();
}

/**
 * Reactive view of the ownership registry.
 *
 * Resolution order:
 *   1. Server truth — projects.owner_id of the signed-in user (survives
 *      device changes and browser resets)
 *   2. Local registry — localStorage fallback for demo mode (Supabase not
 *      configured) or when the session check is unavailable
 *
 * `myIds` is `null` until resolution completes (SSR-safe).
 */
export function useMyProjectIds(): { myIds: string[] | null; reload: () => void } {
  const [myIds, setMyIds] = useState<string[] | null>(null);

  const reload = useCallback(() => {
    resolveMyProjectIds()
      .then(setMyIds)
      .catch(() => setMyIds(getMyProjectIds()));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { myIds, reload };
}