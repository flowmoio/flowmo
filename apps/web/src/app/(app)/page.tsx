import SigninHint from '@/components/SigninHint';
import TabsWrapper from '@/components/Tabs';
import TasksTab from '@/components/TasksTab';
import TimerTab from '@/components/TimerTab/index';
import { HomeProvider } from './providers';

export default async function App() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 sm:gap-5">
      <SigninHint />
      <HomeProvider>
        <TabsWrapper>
          <TimerTab />
          <TasksTab />
        </TabsWrapper>
      </HomeProvider>
    </div>
  );
}
