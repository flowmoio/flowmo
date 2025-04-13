import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Pressable, Text } from '@/src/components/Themed';

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
      <Pressable
        scaleValue={0.98}
        style={{
          backgroundColor: '#3F3E55',
        }}
        onPress={() => {
          console.log('hi');
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Connect Todoist
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
