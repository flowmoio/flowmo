import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req: Request) => {
  const { code } = await req.json();

  if (!code) {
    return new Response('Invalid request', { status: 400 });
  }

  const authHeader = req.headers.get('Authorization');
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY'),
    { global: { headers: { Authorization: authHeader } } },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Invalid user token', { status: 401 });
  }

  const url = new URL('https://todoist.com/oauth/access_token');
  url.searchParams.append('client_id', Deno.env.get('TODOIST_CLIENT_ID')!);
  url.searchParams.append(
    'client_secret',
    Deno.env.get('TODOIST_CLIENT_SECRET')!,
  );
  url.searchParams.append('code', code);

  const response = await fetch(url, { method: 'POST' });
  const { access_token: accessToken } = await response.json();

  const { error } = await supabase
    .from('integrations')
    .update({ todoist: accessToken })
    .eq('user_id', user.id);

  if (error) {
    return new Response('Failed to update access token', { status: 500 });
  }

  return new Response(null, {
    status: 200,
  });
});
