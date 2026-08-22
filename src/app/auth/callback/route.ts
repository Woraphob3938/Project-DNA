import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

// Only university emails may pass Google sign-in
const ALLOWED_KU_DOMAINS = ['student.ku.ac.th', 'ku.ac.th', 'ku.th'];

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  const email = data.user.email ?? '';
  const domain = email.split('@')[1]?.toLowerCase().trim() ?? '';

  if (!ALLOWED_KU_DOMAINS.includes(domain)) {
    // Not a KU account — kill the session immediately
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login?error=domain`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
