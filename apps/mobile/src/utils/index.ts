import * as Crypto from 'expo-crypto';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const formatTime = (time: number) => {
  const t = Math.floor(time);
  const hours = Math.floor(t / 3600);
  const minutes = Math.floor((t % 3600) / 60);
  const seconds = t % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

export const hapticsImpact = () => {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

export function generateState() {
  const randomBytes = Crypto.getRandomBytes(16);
  const randomHex = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return 'com.m4xshen.mobile://profile/settings_' + randomHex;
}

export async function connectIntegration(
  source: string,
  accessToken: string,
  code: string,
) {
  await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/${source}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    },
  );
}
