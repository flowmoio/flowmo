'use client';

import { useBreakRatio } from '@flowmo/hooks';
import { useShowPause } from '@flowmo/hooks';
import { useAutoStartBreak } from '@flowmo/hooks';
import { NumberInput } from '@heroui/number-input';
import { Switch } from '@heroui/switch';
import { toast } from 'sonner';
import supabase from '@/utils/supabase/client';

export default function Options() {
  const { breakRatio, updateBreakRatio } = useBreakRatio(supabase);
  const { showPause, updateShowPause } = useShowPause(supabase);
  const { autoStartBreak, updateAutoStartBreak } = useAutoStartBreak(supabase);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Options</h2>
      </div>
      <div className="flex items-center gap-5">
        <NumberInput
          label="Break Ratio"
          labelPlacement="outside"
          placeholder=" "
          description="Your break time will be your focus time divided by this number."
          radius="sm"
          minValue={1}
          value={breakRatio}
          isWheelDisabled
          onValueChange={(value) => {
            updateBreakRatio(value, () => {
              toast.success('Break ratio updated successfully!');
            });
          }}
          classNames={{
            inputWrapper:
              'bg-secondary max-w-xs data-[hover=true]:bg-secondary data-[focus=true]:!bg-secondary',
          }}
        />
      </div>
      <Switch
        size="sm"
        isSelected={showPause}
        onValueChange={(selected) => {
          updateShowPause(selected, () => {
            toast.success('Show pause setting updated!');
          });
        }}
      >
        Show pause button
      </Switch>
      <Switch
        size="sm"
        isSelected={autoStartBreak}
        onValueChange={(selected) => {
          updateAutoStartBreak(selected, () => {
            toast.success('Auto start break setting updated!');
          });
        }}
      >
        Auto start break session
      </Switch>
    </div>
  );
}
