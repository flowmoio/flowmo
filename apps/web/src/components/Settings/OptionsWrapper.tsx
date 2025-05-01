import Options from '@/components/Settings/Options';
import { createClient } from '@/utils/supabase/server';

export default async function OptionsWrapper() {
  const supabase = await createClient();
  const { data: settingsData } = await supabase
    .from('settings')
    .select('break_ratio')
    .single();
  const breakRatio = settingsData?.break_ratio ?? 5;

  return <Options defaultBreakRatio={breakRatio} />;
}
