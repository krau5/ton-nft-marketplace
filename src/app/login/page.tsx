'use client';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useIsAuthenticated } from '@/hooks';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function Login() {
  const { isConnectionRestored, isAuthenticated } = useIsAuthenticated();

  useEffect(() => {
    if (isConnectionRestored && isAuthenticated) {
      redirect('/');
    }
  }, [isAuthenticated, isConnectionRestored]);

  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <h1 className="text-2xl mb-4">Connect Your Wallet</h1>

      <TonConnectButton />
    </div>
  );
}
