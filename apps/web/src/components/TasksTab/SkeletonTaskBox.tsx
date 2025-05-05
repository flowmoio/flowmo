import { Checkbox } from '@heroui/checkbox';
import { Skeleton } from '@heroui/skeleton';

export default function SkeletonTaskBox() {
  return (
    <div className="flex h-16 flex-shrink-0 items-center border-b border-b-secondary p-4">
      <Checkbox
        isDisabled
        radius="full"
        size="lg"
        classNames={{
          wrapper: 'border border-primary flex-shrink-0 mr-4',
        }}
      />
      <Skeleton className="rounded-md dark:bg-secondary">
        <div className="w-48">text</div>
      </Skeleton>
    </div>
  );
}
