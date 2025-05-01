'use client';

import { Button } from '@heroui/button';
import { Kbd } from '@heroui/kbd';
import { Tooltip } from '@heroui/tooltip';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import useShouldOpenLinkInNewTab from '@/hooks/useShouldOpenLinkInNewTab';

export default function SidebarTab({
  children,
  tabPathname,
  tabName,
  hotkey,
}: {
  children: ReactNode;
  tabPathname: string;
  tabName: string;
  hotkey: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const shouldOpenLinkInNewTab = useShouldOpenLinkInNewTab();

  const handleNavigation = () => {
    if (shouldOpenLinkInNewTab) {
      window.open(tabPathname, '_blank');
    } else {
      router.push(tabPathname);
    }
  };

  useHotkeys(hotkey, handleNavigation);

  return (
    <Tooltip
      color="secondary"
      content={
        <div className="flex items-center gap-1">
          {tabName} <Kbd className="bg-midground">{hotkey}</Kbd>
        </div>
      }
      placement="right"
      offset={15}
      delay={1000}
      radius="sm"
    >
      <Button
        as={Link}
        href={tabPathname}
        target={shouldOpenLinkInNewTab ? '_blank' : undefined}
        disableRipple
        isIconOnly
        color="secondary"
        radius="sm"
        aria-label={tabName}
        className={`fill-white hover:bg-secondary ${
          pathname === tabPathname ? 'bg-secondary' : 'bg-transparent'
        }`}
      >
        {children}
      </Button>
    </Tooltip>
  );
}
