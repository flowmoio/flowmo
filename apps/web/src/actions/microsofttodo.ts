'use server';

import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function connect() {
  const url = new URL(
    'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  );

  url.searchParams.append('client_id', process.env.MICROSOFT_CLIENT_ID);
  url.searchParams.append(
    'redirect_uri',
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/callback`,
  );
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('scope', 'offline_access Tasks.ReadWrite');
  url.searchParams.append('response_mode', 'query');

  const state = `${process.env.NEXT_PUBLIC_URL}/auth/microsofttodo/callback_${nanoid()}`;
  const cookieStore = await cookies();
  cookieStore.set('microsofttodo_state', state, { maxAge: 60 * 60 });
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
    .update({ microsofttodo: null })
    .eq('user_id', user!.id);

  revalidatePath('/settings');
  return { error };
}
