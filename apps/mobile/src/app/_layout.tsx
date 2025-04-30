import { usePathname, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SessionProvider, useSession } from '@/src/ctx';
import BottomSheetComponent from '../components/BottomSheetComponent';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Text } from '../components/Themed';
import { BottomSheetProvider } from '../context/BottomSheetContext';

function RootStack() {
  const { session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session === 'loading') return;

    if (pathname.startsWith('/modal')) return;

    if (session && pathname === '/auth') {
      router.replace('/(tabs)');
    } else if (!session && pathname !== '/auth') {
      router.replace('/auth');
    }
  }, [session, pathname, router]);

  if (session === 'loading') {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#131221',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#131221' },
      }}
    >
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="modal"
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#131221' },
          headerTitle: '',
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Text
                style={{
                  color: '#DBBFFF',
                  fontSize: 16,
                }}
              >
                Close
              </Text>
            </Pressable>
          ),
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}

export default function Layout() {
  return (
    <SessionProvider>
      <KeyboardProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetProvider>
          <RootStack />
          <BottomSheetComponent />
        </BottomSheetProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </SessionProvider>
  );
}
