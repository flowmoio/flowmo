'use server';

import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function connect() {
  const url = new URL('https://todoist.com/oauth/authorize');
  url.searchParams.append('client_id', process.env.TODOIST_CLIENT_ID);
  url.searchParams.append('scope', 'data:read_write');

  const state = `${process.env.NEXT_PUBLIC_URL}/auth/todoist/callback_${nanoid()}`;
  const cookieStore = await cookies();
  cookieStore.set('todoist_state', state, { maxAge: 60 * 60 });
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
    .update({ todoist: null })
    .eq('user_id', user!.id);

  revalidatePath('/settings');

  return { error };
}
