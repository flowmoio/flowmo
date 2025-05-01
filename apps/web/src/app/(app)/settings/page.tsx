import { Metadata } from 'next';
import Account from '@/components/Settings/Account';
import Integrations from '@/components/Settings/Integrations';
import OptionsWrapper from '@/components/Settings/OptionsWrapper';

export const metadata: Metadata = {
  title: 'Settings | Flowmo',
};

export default async function Settings() {
  return (
    <div className="my-20 flex w-screen flex-col gap-10 px-10 sm:w-[70vw] md:w-[50vw] lg:w-[40vw]">
      <h1 className="flex items-center gap-3 text-3xl font-semibold">
        Settings
      </h1>
      <OptionsWrapper />
      <Integrations />
      <Account />
    </div>
  );
}
