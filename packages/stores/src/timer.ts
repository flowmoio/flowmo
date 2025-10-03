import { Source } from '@flowmo/task-sources';
import { Task } from '@flowmo/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createStore as createStatsStore } from './stats';

type OnBreakStart = (totalTime: number) => Promise<void>;

interface State {
  startTime: number;
  endTime: number;
  totalTime: number;
  displayTime: number;
  mode: 'focus' | 'break';
  showTime: boolean;
  status: 'idle' | 'running' | 'paused';
}

interface Action {
  start: (callback?: () => Promise<void>) => Promise<void>;
  stop: (
    platform?: string,
    focusingTask?: Task | null,
    activeSource?: Source,
  ) => Promise<void>;
  pause: (
    platform?: string,
    focusingTask?: Task | null,
    activeSource?: Source,
  ) => Promise<void>;
  resume: () => Promise<void>;
  log: (
    platform: string,
    focusingTask?: Task | null,
    activeSource?: Source,
  ) => Promise<void>;
  tick: (callback?: () => void) => void;
  toggleShowTime: () => void;
}

interface Store extends State {
  actions: Action;
}

async function getBreakRatio(supabase: SupabaseClient) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return 5;
  }

  const { data } = await supabase
    .from('settings')
    .select('break_ratio')
    .single();
  return data?.break_ratio || 5;
}

async function getAutoStartBreak(supabase: SupabaseClient) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return false;
  }

  const { data } = await supabase
    .from('settings')
    .select('auto_start_break')
    .single();
  return data?.auto_start_break || false;
}

export const createStore = (
  supabase: SupabaseClient,
  statsStore: ReturnType<typeof createStatsStore>,
  onBreakStart?: OnBreakStart,
) =>
  create<Store>((set, get) => ({
    startTime: 0,
    endTime: 0,
    totalTime: 0,
    displayTime: 0,
    mode: 'focus',
    showTime: true,
    status: 'idle',
    actions: {
      start: async () => {
        const { mode, totalTime } = get();

        if (mode === 'break' && onBreakStart) {
          await onBreakStart(totalTime);
        }

        set((state) => ({
          startTime: Date.now(),
          endTime:
            state.mode === 'break'
              ? Date.now() + state.totalTime
              : state.endTime,
          status: 'running',
        }));
      },
      stop: async (platform, focusingTask, activeSource) => {
        const breakRatio = await getBreakRatio(supabase);
        const autoStartBreak = await getAutoStartBreak(supabase);
        const currentMode = get().mode;

        if (get().status === 'paused') {
          const totalTime = Math.round(get().totalTime / breakRatio);
          set((state) => ({
            totalTime,
            displayTime: Math.floor(totalTime / 1000),
            mode: state.mode === 'focus' ? 'break' : 'focus',
            status: 'idle',
          }));
          return;
        }

        if (get().mode !== 'break' && platform) {
          get().actions.log(platform, focusingTask, activeSource);
        }

        set((state) => {
          const totalTime =
            state.mode === 'focus'
              ? Math.round(
                  (state.totalTime + Date.now() - state.startTime) / breakRatio,
                )
              : 0;
          return {
            endTime: Date.now(),
            totalTime,
            displayTime: Math.floor(totalTime / 1000),
            mode: state.mode === 'focus' ? 'break' : 'focus',
            status: 'idle',
          };
        });

        if (currentMode === 'focus' && autoStartBreak && get().totalTime > 0) {
          await get().actions.start();
        }
      },
      pause: async (platform, focusingTask, activeSource) => {
        if (get().mode !== 'break' && platform) {
          await get().actions.log(platform, focusingTask, activeSource);
        }

        set((state) => {
          const totalTime = state.totalTime + Date.now() - state.startTime;
          return {
            status: 'paused',
            totalTime,
          };
        });
      },
      resume: async () => {
        set(() => ({
          status: 'running',
          startTime: Date.now(),
        }));
      },
      log: async (platform, focusingTask, activeSource) => {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          return;
        }

        const start_time = new Date(get().startTime).toISOString();
        const end_time = new Date(Date.now()).toISOString();

        if (!focusingTask) {
          await supabase.from('logs').insert([
            {
              start_time,
              end_time,
              platform,
            },
          ]);
          await statsStore.getState().actions.updateLogs();
          return;
        }

        const hasId = activeSource === Source.Flowmo;
        await supabase.from('logs').insert([
          {
            start_time,
            end_time,
            task_id: hasId ? parseInt(focusingTask.id, 10) : null,
            task_name: hasId ? null : focusingTask.name,
            platform,
          },
        ]);
        await statsStore.getState().actions.updateLogs();
      },
      tick: (callback) => {
        set((state) => {
          if (state.status !== 'running') {
            return {};
          }

          const time =
            state.mode === 'focus'
              ? state.totalTime + Date.now() - state.startTime
              : state.endTime - Date.now();

          if (state.mode === 'break' && time <= 0) {
            state.actions.stop();
            if (callback) callback();

            return {
              status: 'idle',
              displayTime: 0,
            };
          }

          return {
            displayTime: Math.floor(time / 1000),
          };
        });
      },
      toggleShowTime: () => set((state) => ({ showTime: !state.showTime })),
    },
  }));

export const createHooks = (useStore: ReturnType<typeof createStore>) => ({
  useStartTime: () => useStore((state) => state.startTime),
  useEndTime: () => useStore((state) => state.endTime),
  useTotalTime: () => useStore((state) => state.totalTime),
  useDisplayTime: () => useStore((state) => state.displayTime),
  useMode: () => useStore((state) => state.mode),
  useShowTime: () =>
    useStore((state) => state.showTime || state.status === 'idle'),
  useStatus: () => useStore((state) => state.status),
  useActions: () => useStore((state) => state.actions),
});
