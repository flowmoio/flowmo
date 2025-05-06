import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/src/components/Themed';

interface TimeFormatterProps {
  minutes: number;
}

export default function TimeFormatter({ minutes }: TimeFormatterProps) {
  const hours = Math.floor(minutes / 60);
  const leftMinutes = Math.floor(minutes % 60);
  const seconds = Math.floor((minutes % 1) * 60);

  if (minutes < 1) {
    return (
      <View style={styles.timeFormatterContainer}>
        <Text style={styles.timeValue}>{seconds}</Text>
        <Text style={styles.timeUnit}>sec</Text>
      </View>
    );
  }

  return (
    <View style={styles.timeFormatterContainer}>
      {hours > 0 && (
        <View style={styles.timeSegment}>
          <Text style={styles.timeValue}>{hours}</Text>
          <Text style={styles.timeUnit}>hr</Text>
        </View>
      )}
      {leftMinutes > 0 && (
        <View style={styles.timeSegment}>
          <Text style={styles.timeValue}>{leftMinutes}</Text>
          <Text style={styles.timeUnit}>min</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  timeFormatterContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  timeSegment: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 8,
  },
  timeValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  timeUnit: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 2,
  },
});
