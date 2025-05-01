import { Link } from '@heroui/link';
import TabsWrapper from '@/components/Tabs';
import TasksTab from '@/components/TasksTab';
import TimerTab from '@/components/TimerTab/index';
import { createClient } from '@/utils/supabase/server';
import { HomeProvider } from './providers';

export default async function App() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 sm:gap-5">
      {!session && (
        <div className="mt-4 text-sm">
          <Link href="/signin" underline="always" className="text-sm">
            Sign in
          </Link>{' '}
          to save focus history and tasks.
        </div>
      )}
      <HomeProvider>
        <TabsWrapper>
          <TimerTab />
          <TasksTab />
        </TabsWrapper>
      </HomeProvider>
    </div>
  );
}
