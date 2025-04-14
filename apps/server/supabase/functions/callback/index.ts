import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

Deno.serve((req: Request) => {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!state || !state.includes('_')) {
    return new Response('Invalid state parameter', { status: 400 });
  }

  const [redirectTo] = state.split('_');
  const location = `${redirectTo}?state=${state}&code=${code}`;

  return new Response(null, {
    status: 302,
    headers: { Location: location },
  });
});
