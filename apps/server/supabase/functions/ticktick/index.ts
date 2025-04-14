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

  const url = 'https://ticktick.com/oauth/token';
  const body = new URLSearchParams();
  body.append('client_id', Deno.env.get('TICKTICK_CLIENT_ID'));
  body.append('client_secret', Deno.env.get('TICKTICK_CLIENT_SECRET'));
  body.append('code', code);
  body.append('grant_type', 'authorization_code');
  body.append('redirect_uri', Deno.env.get('TICKTICK_REDIRECT_URI'));

  const response = await fetch(url, { method: 'POST', body });
  const { access_token: accessToken } = await response.json();

  const { error } = await supabase
    .from('integrations')
    .update({ ticktick: accessToken })
    .eq('user_id', user.id);

  if (error) {
    return new Response('Failed to update access token', { status: 500 });
  }

  return new Response(null, {
    status: 200,
  });
});
