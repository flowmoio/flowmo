'use server';

import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function connect() {
  const url = new URL('https://ticktick.com/oauth/authorize');
  url.searchParams.append('client_id', process.env.TICKTICK_CLIENT_ID);
  url.searchParams.append('scope', 'tasks:write tasks:read');
  url.searchParams.append('response_type', 'code');

  const state = `${process.env.NEXT_PUBLIC_URL}/auth/ticktick/callback_${nanoid()}`;
  const cookieStore = await cookies();
  cookieStore.set('ticktick_state', state, { maxAge: 60 * 60 });
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
    .update({ ticktick: null })
    .eq('user_id', user!.id);

  revalidatePath('/settings');

  return { error };
}
