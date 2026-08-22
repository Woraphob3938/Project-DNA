'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

/**
 * Client-side auth gate for gated actions (เพิ่มโปรเจกต์ / ดาวน์โหลด / บันทึก).
 *
 * `isAuthenticated` is tri-state:
 *   true  → signed in
 *   false → signed out
 *   null  → session check still in flight (treated as allowed so we never
 *           bounce a signed-in user to /login because of a slow check)
 */
export function useAuthGate() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    // getSession reads the local session synchronously from storage — fast,
    // and enough for gating UI actions (the middleware re-verifies on any
    // protected navigation anyway).
    createClient()
      .auth.getSession()
      .then(({ data }) => {
        if (active) setIsAuthenticated(Boolean(data.session?.user));
      })
      .catch(() => {
        if (active) setIsAuthenticated(false);
      });

    return () => {
      active = false;
    };
  }, []);

  /**
   * Returns `true` when the action may proceed. When the visitor is signed
   * out, redirects to /login (carrying `nextPath` so login can return them)
   * and returns `false`.
   */
  const requireLogin = useCallback(
    (nextPath = '/') => {
      if (isAuthenticated === false) {
        router.push(`/login?next=${encodeURIComponent(nextPath)}`);
        return false;
      }
      return true;
    },
    [isAuthenticated, router]
  );

  return { isAuthenticated, requireLogin };
}