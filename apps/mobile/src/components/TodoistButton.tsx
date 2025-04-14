import { Source } from '@flowmo/task-sources';
import { useAuthRequest } from 'expo-auth-session';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Pressable, Text } from '@/src/components/Themed';
import { useSession } from '@/src/ctx';
import { useSources, useTasksActions } from '@/src/hooks/useTasks';
import { supabase } from '@/src/utils/supabase';
import { generateState } from '../utils';

const discovery = {
  authorizationEndpoint: 'https://todoist.com/oauth/authorize',
};

export function TodoistButton() {
  const [isLoading, setLoading] = useState(false);
  const sources = useSources();
  const { session } = useSession();
  const { fetchSources, onSourceChange } = useTasksActions();

  const authRequestOptions = useMemo(
    () => ({
      clientId: process.env.EXPO_PUBLIC_TODOIST_CLIENT_ID!,
      scopes: ['data:read_write'],
      redirectUri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/callback`,
      state: generateState(),
    }),
    [],
  );

  const [, response, promptAsync] = useAuthRequest(
    authRequestOptions,
    discovery,
  );

  useEffect(() => {
    if (response?.type !== 'success') {
      setLoading(false);
      return;
    }

    (async () => {
      const { code } = response.params;
      await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/todoist`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        },
      );
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
        if (sources.includes(Source.Todoist)) {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const { error } = await supabase
            .from('integrations')
            .update({ todoist: null })
            .eq('user_id', user!.id);
          if (error) {
            console.error('Error disconnecting Todoist:', error);
          }
          onSourceChange(Source.Flowmo);
          await fetchSources();
          setLoading(false);
        } else {
          await promptAsync();
        }
      }}
    >
      {isLoading ? (
        <ActivityIndicator style={{ width: 24, height: 24 }} />
      ) : (
        <Image
          source={require('../../assets/images/todoist.png')}
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
        {sources.includes(Source.Todoist)
          ? 'Disconnect Todoist'
          : 'Connect Todoist'}
      </Text>
    </Pressable>
  );
}
