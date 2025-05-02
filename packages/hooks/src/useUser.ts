import { SupabaseClient } from '@supabase/supabase-js';
import useSWR from 'swr';

export function useUser(supabase: SupabaseClient) {
  const { data, error, isLoading } = useSWR('user', async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (!userData) {
      throw userError;
    }

    return userData.user;
  });

  return {
    user: data,
    error,
    isLoading,
  };
}
