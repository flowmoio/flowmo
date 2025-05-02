import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useShowPause } from '@flowmo/hooks';
import notifee from '@notifee/react-native';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {
  isActivityRunning,
  startLiveActivity,
  updateLiveActivity,
} from '@/modules/activity-controller';
import TaskSelector from '@/src/components/TaskSelector';
import { Pressable, Text } from '@/src/components/Themed';
import { useActiveSource, useFocusingTask } from '@/src/hooks/useTasks';
import {
  useActions,
  useDisplayTime,
  useEndTime,
  useMode,
  useStartTime,
  useStatus,
  useTotalTime,
} from '@/src/hooks/useTimer';
import { formatTime } from '@/src/utils';
import { supabase } from '@/src/utils/supabase';

export default function TimerTab() {
  const startTime = useStartTime();
  const endTime = useEndTime();
  const totalTime = useTotalTime();
  const displayTime = useDisplayTime();
  const mode = useMode();
  const status = useStatus();
  const [isLoading, setIsLoading] = useState(false);
  const { start, stop, pause, resume } = useActions();

  const focusingTask = useFocusingTask();
  const activeSource = useActiveSource();
  const liveActivityRunning = isActivityRunning();
  const firstRender = useRef(true);

  const { showPause } = useShowPause(supabase);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (liveActivityRunning) {
      updateLiveActivity({
        status,
        mode,
        totalTime,
        startTime,
        endTime,
      });
      return;
    }

    startLiveActivity({
      status,
      mode,
      totalTime,
      startTime,
      endTime,
    });
  }, [status, mode, totalTime, startTime, endTime]);

  return (
    <>
      <View style={styles.container}>
        <AnimatedCircularProgress
          size={336}
          width={36}
          fill={
            mode === 'focus'
              ? 0
              : 100 * (displayTime / Math.floor(totalTime / 1000))
          }
          rotation={0}
          tintColor="#DBBFFF"
          backgroundColor="#3F3E55"
          lineCap="round"
        >
          {() => (
            <View style={styles.timerContent}>
              <Text style={styles.mode}>
                {mode === 'focus' ? 'Focus' : 'Break'}
              </Text>
              <Text style={styles.time}>{formatTime(displayTime)}</Text>
              {mode === 'focus' && <TaskSelector />}
            </View>
          )}
        </AnimatedCircularProgress>
        <View style={styles.buttonContainer}>
          {showPause &&
            mode === 'focus' &&
            (status === 'running' || status === 'paused') && (
              <Pressable
                scaleValue={0.9}
                isLoading={isLoading}
                color="#FFFFFF"
                haptics
                style={styles.button}
                onPress={async () => {
                  setIsLoading(true);
                  if (status === 'running') {
                    await pause(Platform.OS, focusingTask, activeSource);
                  } else {
                    await resume();
                  }
                  setIsLoading(false);
                }}
              >
                {status === 'running' ? (
                  <FontAwesome6 name="pause" size={22} color="white" />
                ) : (
                  <FontAwesome6 name="play" size={22} color="white" />
                )}
              </Pressable>
            )}
          <Pressable
            scaleValue={0.9}
            isLoading={isLoading}
            color="#FFFFFF"
            haptics
            style={styles.button}
            onPress={async () => {
              setIsLoading(true);
              if (status !== 'idle') {
                if (mode === 'break') {
                  const ids = await notifee.getTriggerNotificationIds();
                  notifee.cancelTriggerNotifications(ids);
                }

                await stop(Platform.OS, focusingTask, activeSource);
              } else {
                await start();
              }
              setIsLoading(false);
            }}
          >
            {status === 'idle' ? (
              <FontAwesome6 name="play" size={22} color="white" />
            ) : (
              <FontAwesome6 name="stop" size={22} color="white" />
            )}
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131221',
    gap: 20,
    paddingTop: 40,
  },
  timerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  mode: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 40,
  },
  button: {
    backgroundColor: '#3F3E55',
    width: 62,
    height: 62,
    borderRadius: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
