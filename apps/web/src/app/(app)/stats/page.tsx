import { Metadata } from 'next';
import StatsCard from '@/components/Stats/StatsCard';
import TaskTime from '@/components/Stats/TaskTime';
import YearlyStats from '@/components/Stats/YearlyStats';

export const metadata: Metadata = {
  title: 'Stats | Flowmo',
};

export default async function Stats() {
  return (
    <div className="flex w-full flex-col gap-5 overflow-y-auto p-5 sm:min-h-screen lg:items-center lg:justify-center">
      <div className="flex w-full flex-col gap-5 lg:h-[70vh] lg:flex-row lg:justify-center">
        <div className="lg:w-2/3">
          <StatsCard />
        </div>
        <div className="lg:w-1/3">
          <TaskTime />
        </div>
      </div>
      <YearlyStats />
    </div>
  );
}
