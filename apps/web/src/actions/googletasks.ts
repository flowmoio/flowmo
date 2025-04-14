'use server';

import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function connect() {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.append('client_id', process.env.GOOGLE_CLIENT_ID);
  url.searchParams.append(
    'redirect_uri',
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/callback`,
  );
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('scope', 'https://www.googleapis.com/auth/tasks');
  url.searchParams.append('access_type', 'offline');
  url.searchParams.append('prompt', 'consent');

  const state = `${process.env.NEXT_PUBLIC_URL}/auth/googletasks/callback_${nanoid()}`;
  const cookieStore = await cookies();
  cookieStore.set('googletasks_state', state, { maxAge: 60 * 60 });
  url.searchParams.append('state', state);

  redirect(url.toString());
}

export async function disconnect() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('integrations')
    .update({ googletasks: null })
    .eq('user_id', user!.id);

  revalidatePath('/settings');
  return { error };
}
