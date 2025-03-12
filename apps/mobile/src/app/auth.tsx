import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, View } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { Pressable, Text } from '@/src/components/Themed';
import { useSession } from '@/src/ctx';

export default function Auth() {
  const { signInWithApple, signInWithGoogle } = useSession();
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);

  return (
    <View
      style={{
        backgroundColor: '#131221',
        justifyContent: 'center',
        height: '100%',
        paddingHorizontal: 50,
        gap: 36,
      }}
    >
      <Image
        source={require('../../assets/images/icon.png')}
        style={{ width: 100, height: 100, alignSelf: 'center' }}
        contentFit="contain"
      />
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          alignSelf: 'center',
          width: 200,
        }}
      >
        Enter flow state and stay focused.
      </Text>
      <View style={{ flexDirection: 'column', gap: 10 }}>
        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
            }
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
            }
            cornerRadius={8}
            style={{ height: 40 }}
            onPress={async () => await signInWithApple()}
          />
        )}
        <Pressable
          isLoading={googleLoading}
          scaleValue={0.98}
          style={{
            backgroundColor: '#ffffff',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            gap: 6,
          }}
          onPress={async () => {
            setGoogleLoading(true);
            try {
              await signInWithGoogle();
            } finally {
              setGoogleLoading(false);
            }
          }}
        >
          <FontAwesome6 name="google" size={12} color="black" />
          <Text style={{ fontSize: 15.5, fontWeight: '500', color: '#000000' }}>
            Continue with Google
          </Text>
        </Pressable>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            asChild
            style={{
              backgroundColor: '#ffffff',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              gap: 6,
            }}
          >
            <Pressable scaleValue={0.98}>
              <FontAwesome6 name="envelope" size={16} color="black" />
              <Text
                style={{ fontSize: 15.5, fontWeight: '500', color: '#000000' }}
              >
                Continue with Email
              </Text>
            </Pressable>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 8,
              padding: 8,
            }}
          >
            <DropdownMenu.Item
              key="signin-email"
              textValue="Sign in with Email"
              onSelect={() => router.push('/modal?mode=signin')}
            >
              <Text style={{ color: '#000000', fontSize: 15 }}>
                Sign in with Email
              </Text>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              key="signup-email"
              textValue="Sign up with Email"
              onSelect={() => router.push('/modal?mode=signup')}
            >
              <Text style={{ color: '#000000', fontSize: 15 }}>
                Sign up with Email
              </Text>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </View>
    </View>
  );
}
