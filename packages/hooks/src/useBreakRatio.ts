import { SupabaseClient } from '@supabase/supabase-js';
import useSWR from 'swr';

export function useBreakRatio(supabase: SupabaseClient) {
  const { data, error, isLoading, mutate } = useSWR(
    'break_ratio',
    async () => {
      const { data: settingsData } = await supabase
        .from('settings')
        .select('break_ratio')
        .single();

      return settingsData?.break_ratio;
    },
    {
      fallbackData: 5,
      keepPreviousData: true,
    },
  );

  async function updateBreakRatio(newBreakRatio: number) {
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
          .update({ break_ratio: newBreakRatio })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating break_ratio:', error);
        }
      },
      {
        optimisticData: newBreakRatio,
      },
    );
  }

  return {
    breakRatio: data,
    error,
    isLoading,
    updateBreakRatio,
  };
}
