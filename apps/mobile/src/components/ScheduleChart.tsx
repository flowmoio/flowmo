import { LogsWithTasks } from '@flowmo/types';
import { convertMarkdownToText } from '@flowmo/utils/markdown';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLogs } from '../hooks/useStats';

const HOUR_HEIGHT = 120;

const getLogPosition = (log: LogsWithTasks) => {
  const startTime = new Date(log.start_time);
  const endTime = new Date(log.end_time);
  const startPercentage =
    ((startTime.getHours() + startTime.getMinutes() / 60) / 24) * 100;
  const endPercentage =
    ((endTime.getHours() + endTime.getMinutes() / 60) / 24) * 100;
  return {
    start: `${startPercentage}%`,
    height: `${endPercentage - startPercentage}%`,
  };
};

export default function ScheduleChart() {
  const logs = useLogs() ?? [];
  const hours = Array.from({ length: 25 }, (_, i) => i);

  const offsetY =
    logs.length > 0
      ? (parseFloat(
          getLogPosition(
            logs.reduce(
              (earliest, log) =>
                new Date(log.start_time) < new Date(earliest.start_time)
                  ? log
                  : earliest,
              logs[0],
            ),
          ).start,
        ) /
          100) *
        (24 * HOUR_HEIGHT)
      : 8 * HOUR_HEIGHT;

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentOffset={{ x: 0, y: offsetY }}
    >
      <View style={styles.chart}>
        {hours.map((hour) => (
          <View key={hour} style={styles.hourRow}>
            <Text
              style={styles.hourText}
            >{`${hour.toString().padStart(2, '0')}:00`}</Text>
            <View style={styles.hourLine} />
          </View>
        ))}
        {logs.map((log) => {
          const duration =
            (new Date(log.end_time).getTime() -
              new Date(log.start_time).getTime()) /
            60000;

          return (
            <View
              key={log.id}
              style={[
                styles.logItem,
                {
                  top: getLogPosition(log).start,
                  height: getLogPosition(log).height,
                },
              ]}
            >
              {duration >= 10 && (
                <>
                  <Text>
                    {convertMarkdownToText(
                      log.task_name ?? log.tasks?.name ?? 'Focus',
                    )}
                  </Text>
                  <Text>
                    <Time time={duration} />
                  </Text>
                </>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chart: {
    position: 'relative',
    height: 24 * HOUR_HEIGHT,
    marginVertical: 20,
  },
  hourRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: HOUR_HEIGHT,
  },
  hourText: {
    width: 50,
    fontSize: 12,
    fontWeight: 600,
    bottom: 6,
    color: '#FFFFFF',
  },
  hourLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#3F3E55',
  },
  logItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 50,
    right: 0,
    borderRadius: 8,
    backgroundColor: '#DBBFFF',
  },
});

function Time({ time }: { time: number }) {
  return (
    <>
      {Math.floor(time / 60) > 0 ? (
        <Text>{Math.floor(time / 60)} hr </Text>
      ) : null}
      {time % 60 > 0 ? <Text>{Math.floor(time % 60)} min</Text> : null}
    </>
  );
}
