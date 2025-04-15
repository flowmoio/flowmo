import { useQuery } from '@supabase-cache-helpers/postgrest-swr';
import supabase from '@/utils/supabase/client';

export default function useLogs() {
  const { data, isLoading } = useQuery(supabase.from('logs').select('*'), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    logs: data ?? [],
    isLoading,
  };
}
