'use client';

import { TonConnectButton } from '@/components/TonConnectButton';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();
  const isLogin = pathname.includes('login');

  return (
    <header className="flex items-center justify-between bg-white shadow py-6 px-4 sticky top-0 z-10 gap-2">
      <h1 className={`text-xl font-bold text-gray-900${isLogin ? ' text-center' : ''}`}>TON NFT Marketplace</h1>

      {!isLogin && <TonConnectButton />}
    </header>
  );
};
