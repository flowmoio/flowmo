import { Stack } from 'expo-router';

export const hideTabBar = true;

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: '#131221' },
        headerTintColor: '#DBBFFF',
        headerTitleStyle: { color: '#FFFFFF' },
      }}
    />
  );
}
