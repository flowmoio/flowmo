'use client';

import { Button } from '@heroui/button';
import { NumberInput } from '@heroui/number-input';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { updateOptions } from '@/actions/settings';

export default function Options({
  defaultBreakRatio,
}: {
  defaultBreakRatio: number;
}) {
  const [breakRatio, setBreakRatio] = useState(defaultBreakRatio);
  const [isLoading, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Options</h2>
      </div>
      <NumberInput
        label="Break Ratio"
        description="Your break time will be your focus time divided by this number."
        radius="sm"
        minValue={1}
        value={breakRatio}
        onValueChange={setBreakRatio}
        classNames={{
          inputWrapper:
            'bg-secondary max-w-xs data-[hover=true]:bg-secondary data-[focus=true]:!bg-secondary',
        }}
      />
      <div className="flex">
        <Button
          color="primary"
          radius="sm"
          className="ml-auto mt-2"
          isDisabled={breakRatio === defaultBreakRatio}
          isLoading={isLoading}
          disableRipple
          onPress={() => {
            startTransition(async () => {
              const { error } = await updateOptions(breakRatio);

              if (error) {
                toast.error(error.message);
              } else {
                toast.success('Settings updated successfully!');
              }
            });
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
