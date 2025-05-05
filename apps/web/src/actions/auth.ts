'use server';

import { Provider } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function signInWithPassword(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/signin?error=${error.message}`);
  }
  redirect('/');
}

export async function signInWithOAuth(origin: string, provider: Provider) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }

  if (error) {
    redirect(`/signin?error=${error.message}`);
  }
}

export async function sendPasswordReset(formData: FormData) {
  const email = formData.get('email') as string;
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    redirect(`/forgot-password?error=${error.message}`);
  }
  redirect("/signin?success=You've been emailed a password reset link!");
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/settings/account?error=${error.message}`);
  }
  redirect('/?success=Password updated successfully!');
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(`/signup?error=${error.message}`);
  }
  redirect(
    '/signin?success=Sign up successfully! Check your email to verify your account.',
  );
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({
    scope: 'local',
  });

  if (error) {
    console.error('Error signing out:', error);
  }
  redirect('/');
}
