'use client';

import { HeroUIProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { SWRConfig } from 'swr';

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      <HeroUIProvider navigate={router.push} className="w-full">
        {children}
      </HeroUIProvider>
    </SWRConfig>
  );
}
