import { SupabaseClient } from '@supabase/supabase-js';
import useSWR from 'swr';

export function useShowPause(supabase: SupabaseClient) {
  const { data, error, isLoading, mutate } = useSWR(
    'show_pause',
    async () => {
      const { data: settingsData } = await supabase
        .from('settings')
        .select('show_pause')
        .single();

      return settingsData?.show_pause;
    },
    {
      fallbackData: false,
      keepPreviousData: true,
    },
  );

  async function updateShowPause(newShowPause: boolean) {
    await mutate(
      async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.error('User not found');
          return;
        }

        const { error } = await supabase
          .from('settings')
          .update({ show_pause: newShowPause })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating show_pause:', error);
        }
      },
      {
        optimisticData: newShowPause,
      },
    );
  }

  return {
    showPause: data,
    error,
    isLoading,
    updateShowPause,
  };
}
