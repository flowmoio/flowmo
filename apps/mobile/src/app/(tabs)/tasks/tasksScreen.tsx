import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { convertMarkdownToText } from '@flowmo/utils/markdown';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Pressable, Text } from '@/src/components/Themed';
import {
  useIsLoadingTasks,
  useTasks,
  useTasksActions,
} from '@/src/hooks/useTasks';
import { hapticsImpact } from '@/src/utils';

export default function TasksScreen() {
  const tasks = useTasks();
  const isLoadingTasks = useIsLoadingTasks();
  const { completeTask, addTask } = useTasksActions();
  const [newTaskName, setNewTaskName] = useState('');
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { listName } = params;

  useEffect(() => {
    navigation.setOptions({
      title: listName,
    });
  }, [navigation, listName]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
      style={{ flex: 1, backgroundColor: '#131221', paddingHorizontal: 20 }}
    >
      {isLoadingTasks ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator />
        </View>
      ) : tasks.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16 }}>
            All tasks completed!
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#3F3E55',
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 16,
                gap: 10,
              }}
            >
              <BouncyCheckbox
                size={25}
                fillColor="#DBBFFF"
                disableText
                iconStyle={{ borderColor: '#DBBFFF' }}
                innerIconStyle={{ borderWidth: 1 }}
                textStyle={{ color: '#FFFFFF' }}
                onPress={async () => {
                  hapticsImpact();
                  await completeTask(item);
                }}
                isChecked={item.completed}
              />
              <Text style={{ fontSize: 16 }}>
                {convertMarkdownToText(item.name)}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          style={{ flex: 1 }}
        />
      )}
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <TextInput
          style={{
            flex: 1,
            height: 40,
            backgroundColor: '#3F3E55',
            borderRadius: 20,
            paddingHorizontal: 10,
            marginRight: 10,
            color: '#FFFFFF',
          }}
          value={newTaskName}
          onChangeText={setNewTaskName}
          onSubmitEditing={() => {
            if (newTaskName.trim()) {
              addTask(newTaskName.trim());
              setNewTaskName('');
            }
          }}
          blurOnSubmit={false}
          placeholder="Add a new task"
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        <Pressable
          style={[
            {
              backgroundColor: '#DBBFFF',
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            },
            !newTaskName.trim() && { opacity: 0.5 },
          ]}
          onPress={() => {
            if (newTaskName.trim()) {
              addTask(newTaskName.trim());
              setNewTaskName('');
            }
          }}
          disabled={!newTaskName.trim()}
        >
          <FontAwesome6 name="arrow-up" size={18} color="#131221" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
