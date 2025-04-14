import { Source } from '@flowmo/task-sources';
import { useAuthRequest } from 'expo-auth-session';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import { Pressable, Text } from '@/src/components/Themed';
import { useSession } from '@/src/ctx';
import { useSources, useTasksActions } from '@/src/hooks/useTasks';
import { supabase } from '@/src/utils/supabase';
import { connectIntegration, generateState } from '../utils';

const discovery = {
  authorizationEndpoint: 'https://ticktick.com/oauth/authorize',
};

export function TickTickButton() {
  const [isLoading, setLoading] = useState(false);
  const sources = useSources();
  const { session } = useSession();
  const { fetchSources, onSourceChange } = useTasksActions();

  const authRequestOptions = useMemo(
    () => ({
      clientId: process.env.EXPO_PUBLIC_TICKTICK_CLIENT_ID!,
      scopes: ['tasks:write', 'tasks:read'],
      redirectUri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/callback`,
      state: generateState(),
    }),
    [],
  );

  const [, response, promptAsync] = useAuthRequest(
    authRequestOptions,
    discovery,
  );

  // android
  useEffect(() => {
    const subscription = Linking.addEventListener('url', async (event) => {
      const code = new URL(event.url).searchParams.get('code');
      await connectIntegration('ticktick', session?.access_token, code);
      await fetchSources();
      setLoading(false);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (response?.type !== 'success' && Platform.OS !== 'android') {
      setLoading(false);
      return;
    }

    (async () => {
      const { code } = response.params;
      await connectIntegration('ticktick', session?.access_token, code);
      await fetchSources();
      setLoading(false);
    })();
  }, [response]);

  return (
    <Pressable
      scaleValue={0.98}
      style={{
        backgroundColor: '#3F3E55',
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
      }}
      onPress={async () => {
        setLoading(true);
        if (sources.includes(Source.TickTick)) {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const { error } = await supabase
            .from('integrations')
            .update({ ticktick: null })
            .eq('user_id', user!.id);
          if (error) {
            console.error('Error disconnecting TickTick:', error);
          }
          onSourceChange(Source.Flowmo);
          await fetchSources();
          setLoading(false);
        } else {
          await promptAsync({
            showInRecents: true,
          });
        }
      }}
    >
      {isLoading ? (
        <ActivityIndicator style={{ width: 24, height: 24 }} />
      ) : (
        <Image
          source={require('../../assets/images/ticktick.png')}
          style={{ width: 24, height: 24, alignSelf: 'center' }}
          contentFit="contain"
        />
      )}
      <Text
        style={{
          textAlign: 'center',
          fontWeight: '600',
          fontSize: 16,
        }}
      >
        {sources.includes(Source.TickTick)
          ? 'Disconnect TickTick'
          : 'Connect TickTick'}
      </Text>
    </Pressable>
  );
}
