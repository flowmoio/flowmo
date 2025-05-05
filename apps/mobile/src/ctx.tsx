import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AuthError, PostgrestError, Session } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Alert } from 'react-native';
import { useStatsActions } from './hooks/useStats';
import { useTasksActions } from './hooks/useTasks';
import { supabase } from './utils/supabase';

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<AuthError | null>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<AuthError | null>;
  signUp: (email: string, password: string) => Promise<AuthError | null>;
  deleteAccount: () => Promise<PostgrestError | null>;
  session: Session | string | null;
}>({
  signIn: () => new Promise(() => null),
  signInWithGoogle: () => new Promise(() => null),
  signInWithApple: () => new Promise(() => null),
  signOut: () => new Promise(() => null),
  signUp: () => new Promise(() => null),
  deleteAccount: () => new Promise(() => null),
  session: 'loading',
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | string | null>('loading');
  const { updateLogs } = useStatsActions();
  const { fetchSources, fetchLists, fetchTasks } = useTasksActions();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (event !== 'TOKEN_REFRESHED') {
        fetchSources();
        fetchLists();
        fetchTasks();
      }
    });

    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });

    updateLogs();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email, password) => {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          return error;
        },
        signInWithGoogle: async () => {
          try {
            await GoogleSignin.hasPlayServices();
            const { data: userInfo } = await GoogleSignin.signIn();

            if (userInfo?.idToken) {
              const { error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: userInfo.idToken,
              });
              if (error) {
                Alert.alert(error.message);
              }
            }
          } catch (error: any) {}
        },
        signInWithApple: async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });

            if (credential.identityToken) {
              const { error } = await supabase.auth.signInWithIdToken({
                provider: 'apple',
                token: credential.identityToken,
              });
              if (error) {
                Alert.alert(error.message);
              }
            } else {
              throw new Error('No identityToken.');
            }
          } catch (error) {}
        },
        signOut: async () => {
          const { error } = await supabase.auth.signOut({
            scope: 'local',
          });
          return error;
        },
        signUp: async (email, password) => {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                mobile: true,
              },
            },
          });
          return error;
        },
        deleteAccount: async () => {
          const { error } = await supabase.rpc('delete_account');

          if (!error) {
            setSession(null);
          }

          return error;
        },
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
