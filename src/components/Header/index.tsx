'use client';
import { TonConnectButton } from '@tonconnect/ui-react';
import { usePathname } from 'next/navigation';
import { useIsAuthenticated } from '@/hooks';

export const Header = () => {
  const pathname = usePathname();
  const isLogin = pathname.includes('login');

  const { isConnectionRestored, isAuthenticated } = useIsAuthenticated();

  const showTonConnectButton = !isLogin && isConnectionRestored && isAuthenticated;

  return (
    <header className="flex items-center justify-between bg-white shadow py-6 px-4 sticky top-0 z-10 gap-2">
      <h1 className={`text-xl font-bold text-gray-900${isLogin ? ' text-center' : ''}`}>TON NFT Marketplace</h1>

      {showTonConnectButton && <TonConnectButton />}
    </header>
  );
};
