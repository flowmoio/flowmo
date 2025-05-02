import { SupabaseClient } from '@supabase/supabase-js';
import useSWR from 'swr';
import { useUser } from './useUser';

export function useBreakRatio(supabase: SupabaseClient) {
  const { user } = useUser(supabase);

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
      keepPreviousData: true,
    },
  );

  async function updateBreakRatio(
    newBreakRatio: number,
    onSuccess?: () => void,
  ) {
    await mutate(
      async () => {
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
        } else {
          onSuccess?.();
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
