'use client';

import { useBreakRatio } from '@flowmo/hooks';
import { NumberInput } from '@heroui/number-input';
import { toast } from 'sonner';
import supabase from '@/utils/supabase/client';

export default function Options() {
  const { breakRatio, updateBreakRatio } = useBreakRatio(supabase);

  return (
    <div className="flex flex-col gap-3">
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
    </div>
  );
}
