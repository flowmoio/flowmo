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

  const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

  const body = new URLSearchParams({
    client_id: Deno.env.get('MICROSOFT_CLIENT_ID')!,
    client_secret: Deno.env.get('MICROSOFT_CLIENT_SECRET')!,
    code,
    grant_type: 'authorization_code',
    redirect_uri: Deno.env.get('MICROSOFT_REDIRECT_URI')!,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  const { access_token: accessToken, refresh_token: refreshToken } =
    await response.json();

  if (accessToken === undefined || refreshToken === undefined) {
    return new Response('Failed to get access token', { status: 500 });
  }

  const { error } = await supabase
    .from('integrations')
    .update({
      microsofttodo: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    })
    .eq('user_id', user.id);

  if (error) {
    return new Response('Failed to update access token', { status: 500 });
  }

  return new Response(null, { status: 200 });
});
