'use client';

import { Avatar } from '@heroui/avatar';
import { Divider } from '@heroui/divider';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { signOut } from '@/actions/auth';
import { User as UserIcon } from '../Icons';

export default function UserDropdown({ user }: { user: User | undefined }) {
  return (
    <Dropdown
      classNames={{
        content: 'bg-midground',
      }}
    >
      <DropdownTrigger>
        <Avatar
          as="button"
          color="secondary"
          size="sm"
          isBordered
          showFallback
          src={user?.user_metadata?.avatar_url}
          fallback={<UserIcon />}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="user info menu">
        {user ? (
          <DropdownItem
            key="info"
            textValue="info"
            className="pointer-events-none data-[focus=true]:bg-transparent data-[hover=true]:bg-transparent data-[focus=true]:outline-none"
          >
            <div className="text-xs text-foreground-500">Signed in as</div>
            <div>{user.email}</div>
            <Divider className="mt-3" />
          </DropdownItem>
        ) : null}
        <DropdownItem
          key="x"
          as={Link}
          href="https://x.com/flowmoio"
          target="_blank"
          className="data-[focus=true]:bg-secondary data-[hover=true]:bg-secondary"
        >
          What&apos;s New
        </DropdownItem>
        {user ? (
          <DropdownItem
            key="signout"
            className="data-[focus=true]:bg-secondary data-[hover=true]:bg-secondary"
            onPress={async () => {
              await signOut();
            }}
          >
            Sign out
          </DropdownItem>
        ) : (
          <DropdownItem
            key="signin"
            className="data-[focus=true]:bg-secondary data-[hover=true]:bg-secondary"
            as={Link}
            href="/signin"
          >
            Sign In
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
