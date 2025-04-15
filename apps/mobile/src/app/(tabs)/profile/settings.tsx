import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GoogleTasksButton } from '@/src/components/GoogleTasksButton';
import { MicrosoftToDoButton } from '@/src/components/MicrosoftToDoButton';
import { Text } from '@/src/components/Themed';
import { TickTickButton } from '@/src/components/TickTickButton';
import { TodoistButton } from '@/src/components/TodoistButton';

export default function Settings() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: true, title: 'Settings' });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: '#131221',
        paddingTop: 10,
        gap: 10,
        paddingHorizontal: 20,
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Text
        style={[
          styles.sectionTitle,
          {
            paddingBottom: 10,
          },
        ]}
      >
        Integrations
      </Text>
      <TodoistButton />
      <TickTickButton />
      <GoogleTasksButton />
      <MicrosoftToDoButton />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
