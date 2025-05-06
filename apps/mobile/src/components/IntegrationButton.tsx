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

interface IntegrationButtonProps {
  source: Source;
  integrationKey: string;
  discoveryEndpoint: string;
  clientId: string;
  scopes: string[];
  extraParams?: object;
  prompt?: string;
  imageSrc: any;
}

export function IntegrationButton({
  source,
  integrationKey,
  discoveryEndpoint,
  clientId,
  scopes,
  extraParams,
  prompt,
  imageSrc,
}: IntegrationButtonProps) {
  const [isLoading, setLoading] = useState(false);
  const sources = useSources();
  const { session } = useSession();
  const { fetchSources, onSourceChange } = useTasksActions();

  const authRequestOptions = useMemo(
    () => ({
      clientId,
      scopes,
      redirectUri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/callback`,
      state: generateState(),
      prompt,
      usePKCE: false,
      extraParams,
    }),
    [clientId, scopes, prompt, extraParams],
  );

  const discovery = { authorizationEndpoint: discoveryEndpoint };
  const [, response, promptAsync] = useAuthRequest(
    authRequestOptions,
    discovery,
  );

  useEffect(() => {
    const subscription = Linking.addEventListener('url', async (event) => {
      const code = new URL(event.url).searchParams.get('code');
      await connectIntegration(integrationKey, session?.access_token, code);
      await fetchSources();
      setLoading(false);
    });
    return () => subscription.remove();
  }, [session]);

  useEffect(() => {
    if (response?.type !== 'success' && Platform.OS !== 'android') {
      setLoading(false);
      return;
    }

    (async () => {
      const { code } = response.params;
      await connectIntegration(integrationKey, session?.access_token, code);
      await fetchSources();
      setLoading(false);
    })();
  }, [response]);

  const handlePress = async () => {
    setLoading(true);
    if (sources.includes(source)) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('integrations')
        .update({ [integrationKey]: null })
        .eq('user_id', user!.id);
      if (error) {
        console.error(`Error disconnecting ${source}:`, error);
      }
      onSourceChange(Source.Flowmo);
      await fetchSources();
      setLoading(false);
    } else {
      await promptAsync();
    }
  };

  const label = sources.includes(source)
    ? `Disconnect ${source}`
    : `Connect ${source}`;

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
      onPress={handlePress}
    >
      {isLoading ? (
        <ActivityIndicator style={{ width: 24, height: 24 }} color="white" />
      ) : (
        <Image
          source={imageSrc}
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
        {label}
      </Text>
    </Pressable>
  );
}
