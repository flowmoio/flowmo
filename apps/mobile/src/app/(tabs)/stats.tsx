import { LogsWithTasks } from '@flowmo/types';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScheduleChart from '@/src/components/ScheduleChart';
import { Text } from '@/src/components/Themed';
import TimeFormatter from '@/src/components/TimeFormatter';
import { useLogs, useStartDate, useStatsActions } from '@/src/hooks/useStats';

function calculateFocusTime(sessions: LogsWithTasks[]): {
  totalFocusTime: number;
  longestFocusTime: number;
} {
  let totalFocusTime = 0; // in minutes
  let longestFocusTime = 0; // in minutes

  for (const session of sessions) {
    const start = new Date(session.start_time);
    const end = new Date(session.end_time);
    const duration = (end.getTime() - start.getTime()) / 60000;

    totalFocusTime += duration;

    if (duration > longestFocusTime) {
      longestFocusTime = duration;
    }
  }

  return {
    totalFocusTime,
    longestFocusTime,
  };
}

const screenWidth = Dimensions.get('window').width;

export default function Stats() {
  const insets = useSafeAreaInsets();
  const selectedDate = useStartDate();
  const logs = useLogs();
  const { totalFocusTime, longestFocusTime } = calculateFocusTime(logs ?? []);
  const { setDate } = useStatsActions();
  const getWeekDaysFor = (offset: number) => {
    const baseDate = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() - 6 + offset * 7 + i);
      return date;
    });
  };

  const weeks = Array.from({ length: 52 }, (_, i) => i - 51);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#131221',
        paddingTop: insets.top + 10,
        gap: 20,
      }}
    >
      <View>
        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekHeaderContainer}
          data={weeks}
          initialScrollIndex={51}
          getItemLayout={(_, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          keyExtractor={(item) => item.toString()}
          onMomentumScrollEnd={({ nativeEvent }) => {
            const newIndex = Math.round(nativeEvent.contentOffset.x / screenWidth);
            const newOffset = weeks[newIndex];
            const days = getWeekDaysFor(newOffset);
            const lastDay = days[days.length - 1];
            setDate(lastDay);
          }}
          renderItem={({ item: offset }) => (
            <View style={styles.weekPage}>
              {getWeekDaysFor(offset).map((day) => (
                <Pressable
                  key={day.toISOString()}
                  style={[
                    styles.dayButton,
                    selectedDate === day.toDateString() && {
                      backgroundColor: '#DBBFFF',
                    },
                  ]}
                  onPress={() => setDate(day)}
                >
                  <View style={styles.dayTextContainer}>
                    <Text
                      style={[
                        styles.weekdayText,
                        selectedDate === day.toDateString() && {
                          color: '#000',
                        },
                      ]}
                    >
                      {day.toLocaleDateString(undefined, { weekday: 'short' })}
                    </Text>
                    <Text
                      style={[
                        styles.dateText,
                        selectedDate === day.toDateString() && {
                          color: '#000',
                        },
                      ]}
                    >
                      {day.getDate()}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        />
      </View>
      <View style={styles.statsContainer}>
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <Text>Total Focus</Text>
          <TimeFormatter minutes={totalFocusTime} />
        </View>
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <Text>Longest Focus</Text>
          <TimeFormatter minutes={longestFocusTime} />
        </View>
      </View>
      <ScheduleChart />
    </View>
  );
}

const styles = StyleSheet.create({
  dayButton: {
    backgroundColor: '#3F3E55',
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  dayTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  weekHeaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekPage: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: screenWidth,
  },
  statsContainer: {
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'row',
    gap: 42,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
});
