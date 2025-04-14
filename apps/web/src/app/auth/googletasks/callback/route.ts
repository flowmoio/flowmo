import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(
      `${origin}/settings?error=Missing authorization code.`,
    );
  }

  const cookieStore = await cookies();

  if (
    cookieStore.get('googletasks_state')?.value !== searchParams.get('state')
  ) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/googletasks`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    },
  );

  if (response.ok) {
    return NextResponse.redirect(
      `${origin}/settings?success=Google Tasks connected successfully!`,
    );
  }

  return NextResponse.redirect(
    `${origin}/settings?error=Failed to connect Google Tasks.`,
  );
}
