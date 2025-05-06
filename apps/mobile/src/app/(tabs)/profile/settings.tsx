import { useBreakRatio, useShowPause } from '@flowmo/hooks';
import { Source } from '@flowmo/task-sources';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Switch, View } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { IntegrationButton } from '@/src/components/IntegrationButton';
import { Text } from '@/src/components/Themed';
import { supabase } from '@/src/utils/supabase';

export default function Settings() {
  const navigation = useNavigation();
  const { showPause, updateShowPause } = useShowPause(supabase);
  const { breakRatio, updateBreakRatio } = useBreakRatio(supabase);

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
      <IntegrationButton
        source={Source.Todoist}
        integrationKey="todoist"
        discoveryEndpoint="https://todoist.com/oauth/authorize"
        clientId={process.env.EXPO_PUBLIC_TODOIST_CLIENT_ID!}
        scopes={['data:read_write']}
        imageSrc={require('../../../../assets/images/todoist.png')}
      />
      <IntegrationButton
        source={Source.TickTick}
        integrationKey="ticktick"
        discoveryEndpoint="https://ticktick.com/oauth/authorize"
        clientId={process.env.EXPO_PUBLIC_TICKTICK_CLIENT_ID!}
        scopes={['tasks:write', 'tasks:read']}
        imageSrc={require('../../../../assets/images/ticktick.png')}
      />
      <IntegrationButton
        source={Source.GoogleTasks}
        integrationKey="googletasks"
        discoveryEndpoint="https://accounts.google.com/o/oauth2/v2/auth"
        clientId={process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!}
        scopes={['https://www.googleapis.com/auth/tasks']}
        prompt="consent"
        extraParams={{ access_type: 'offline' }}
        imageSrc={require('../../../../assets/images/googletasks.png')}
      />
      <IntegrationButton
        source={Source.MicrosoftToDo}
        integrationKey="microsofttodo"
        discoveryEndpoint="https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
        clientId={process.env.EXPO_PUBLIC_MICROSOFT_CLIENT_ID!}
        scopes={['offline_access', 'Tasks.ReadWrite']}
        extraParams={{ response_mode: 'query' }}
        imageSrc={require('../../../../assets/images/microsofttodo.png')}
      />
      <Text style={[styles.sectionTitle, { paddingBottom: 10, marginTop: 20 }]}>
        Options
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Text style={{ fontSize: 15.5, fontWeight: 600 }}>Break ratio:</Text>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <View>
              {breakRatio ? (
                <View
                  style={{
                    backgroundColor: '#3F3E55',
                    width: 32,
                    height: 38,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    {breakRatio}
                  </Text>
                </View>
              ) : (
                <ActivityIndicator
                  color="white"
                  style={{
                    width: 32,
                    height: 38,
                  }}
                />
              )}
            </View>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 8,
              padding: 8,
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <DropdownMenu.Item
                key={`ratio-${num}`}
                textValue={num.toString()}
                onSelect={async () => {
                  await updateBreakRatio(num);
                }}
              >
                <Text>{num}</Text>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          marginTop: 10,
        }}
      >
        <Text style={{ fontSize: 15.5, fontWeight: 600 }}>
          Show pause button:
        </Text>
        <Switch
          value={showPause}
          trackColor={{ true: '#DBBFFF' }}
          onValueChange={updateShowPause}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
