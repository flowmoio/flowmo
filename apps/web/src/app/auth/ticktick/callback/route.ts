import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const cookieStore = await cookies();

  if (cookieStore.get('ticktick_state')?.value !== searchParams.get('state')) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const code = searchParams.get('code');
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/ticktick`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
      }),
    },
  );

  if (response.ok) {
    return NextResponse.redirect(
      `${origin}/settings?success=TickTick connected successfully! You can now select tasks from TickTick.`,
    );
  }

  return NextResponse.redirect(
    `${origin}/settings?error=Failed to connect TickTick.`,
  );
}
