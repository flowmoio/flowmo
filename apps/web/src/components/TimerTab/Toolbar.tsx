'use client';

import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';
import { useTransition } from 'react';
import { Forward, Hide, Pause, Play, Show, Stop } from '@/components/Icons';
import { useActiveList, useFocusingTask } from '@/stores/useTasksStore';
import {
  useMode,
  useShowTime,
  useStatus,
  useTimerActions,
} from '@/stores/useTimerStore';

export default function Toolbar() {
  const showTime = useShowTime();
  const status = useStatus();
  const mode = useMode();

  const { startTimer, stopTimer, pauseTimer, resumeTimer, toggleShowTime } =
    useTimerActions();
  const [isStopLoading, startStopTransition] = useTransition();
  const [isPauseLoading, startPauseTransition] = useTransition();
  const [isSkipLoading, startSkipTransition] = useTransition();
  const focusingTask = useFocusingTask();
  const activeList = useActiveList();

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
            className="bg-secondary w-12 h-12"
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
          isLoading={isStopLoading}
          isDisabled={isPauseLoading}
          isIconOnly
          disableRipple
          aria-label={status === 'idle' ? 'Start' : 'Stop'}
          className="bg-secondary w-12 h-12"
          onPress={() => {
            startStopTransition(async () => {
              if (status !== 'idle') {
                await stopTimer(focusingTask, activeList);
              } else {
                await startTimer();
              }
            });
          }}
        >
          {status === 'idle' ? <Play /> : <Stop />}
        </Button>
      </Tooltip>
      {mode === 'focus' && (status === 'running' || status === 'paused') ? (
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
            isLoading={isPauseLoading}
            isDisabled={isStopLoading}
            isIconOnly
            disableRipple
            aria-label={status === 'running' ? 'Pause' : 'Resume'}
            className="bg-secondary w-12 h-12"
            onPress={() => {
              startPauseTransition(async () => {
                if (status === 'running') {
                  await pauseTimer(focusingTask, activeList);
                } else {
                  await resumeTimer();
                }
              });
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
            isLoading={isSkipLoading}
            isDisabled={isStopLoading || isPauseLoading}
            isIconOnly
            disableRipple
            aria-label="Skip break"
            className="bg-secondary w-12 h-12"
            onPress={() => {
              startSkipTransition(async () => {
                await stopTimer(focusingTask, activeList);
              });
            }}
          >
            <Forward />
          </Button>
        </Tooltip>
      )}
    </div>
  );
}
