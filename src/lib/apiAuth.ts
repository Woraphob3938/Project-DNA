import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';

export type AuthClientFactory = (
  cookieStore: Awaited<ReturnType<typeof cookies>>
) => ReturnType<typeof createClient>;

export async function requireAuthenticatedUser(
  getClient: AuthClientFactory = createClient,
  getCookieStore: () => ReturnType<typeof cookies> = cookies
): Promise<NextResponse | null> {
  const client = getClient(await getCookieStore());
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }

  return null;
}
