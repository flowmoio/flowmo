import { SupabaseClient } from '@supabase/supabase-js';
import useSWR from 'swr';
import { useUser } from './useUser';

export function useAutoStartBreak(supabase: SupabaseClient) {
  const { user } = useUser(supabase);

  const { data, error, isLoading, mutate } = useSWR(
    'auto_start_break',
    async () => {
      const { data: settingsData } = await supabase
        .from('settings')
        .select('auto_start_break')
        .single();

      return settingsData?.auto_start_break;
    },
    {
      fallbackData: false,
      keepPreviousData: true,
      revalidateOnFocus: true,
    },
  );

  async function updateAutoStartBreak(
    newAutoStartBreak: boolean,
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
          .update({ auto_start_break: newAutoStartBreak })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating auto_start_break:', error);
        } else {
          onSuccess?.();
        }
      },
      {
        optimisticData: newAutoStartBreak,
      },
    );
  }

  return {
    autoStartBreak: data,
    error,
    isLoading,
    updateAutoStartBreak,
  };
}