'use client';

import { useShowPause } from '@flowmo/hooks';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { Forward, Hide, Pause, Play, Show, Stop } from '@/components/Icons';
import { useActiveSource, useFocusingTask } from '@/hooks/useTasks';
import { useActions, useMode, useShowTime, useStatus } from '@/hooks/useTimer';
import supabase from '@/utils/supabase/client';

export default function Toolbar() {
  const showTime = useShowTime();
  const status = useStatus();
  const mode = useMode();
  const { start, stop, pause, resume, toggleShowTime } = useActions();
  const { showPause } = useShowPause(supabase);
  const focusingTask = useFocusingTask();
  const activeSource = useActiveSource();

  return (
    <div className="flex items-center justify-center gap-5">
      {status !== 'idle' && (
        <Tooltip
          radius="sm"
          content={showTime ? 'Hide time' : 'Show time'}
          delay={1000}
          className="bg-secondary"
        >
          <Button
            type="button"
            radius="lg"
            variant="flat"
            isIconOnly
            disableRipple
            aria-label={showTime ? 'Hide time' : 'Show time'}
            className="h-12 w-12 bg-secondary"
            onPress={toggleShowTime}
          >
            {showTime ? <Hide /> : <Show />}
          </Button>
        </Tooltip>
      )}
      <Tooltip
        radius="sm"
        content={
          status === 'idle' ? `Start ${mode} session` : `Stop ${mode} session`
        }
        delay={1000}
        className="bg-secondary"
      >
        <Button
          id="start-stop-button"
          type="button"
          radius="lg"
          variant="flat"
          isIconOnly
          disableRipple
          aria-label={status === 'idle' ? 'Start' : 'Stop'}
          className="h-12 w-12 bg-secondary"
          onPress={() => {
            if (status !== 'idle') {
              stop('web', focusingTask, activeSource);
            } else {
              start();
            }
          }}
        >
          {status === 'idle' ? <Play /> : <Stop />}
        </Button>
      </Tooltip>
      {showPause &&
      mode === 'focus' &&
      (status === 'running' || status === 'paused') ? (
        <Tooltip
          radius="sm"
          content={status === 'running' ? 'Pause' : 'Resume'}
          delay={1000}
          className="bg-secondary"
        >
          <Button
            type="button"
            variant="flat"
            radius="lg"
            isIconOnly
            disableRipple
            aria-label={status === 'running' ? 'Pause' : 'Resume'}
            className="h-12 w-12 bg-secondary"
            onPress={() => {
              if (status === 'running') {
                pause('web', focusingTask, activeSource);
              } else {
                resume();
              }
            }}
          >
            {status === 'running' ? <Pause /> : <Play />}
          </Button>
        </Tooltip>
      ) : null}
      {mode === 'break' && status !== 'running' && (
        <Tooltip
          radius="sm"
          content="Skip break session"
          delay={1000}
          className="bg-secondary"
        >
          <Button
            type="button"
            variant="flat"
            radius="lg"
            isIconOnly
            disableRipple
            aria-label="Skip break"
            className="h-12 w-12 bg-secondary"
            onPress={() => {
              stop('web', focusingTask, activeSource);
            }}
          >
            <Forward />
          </Button>
        </Tooltip>
      )}
    </div>
  );
}
