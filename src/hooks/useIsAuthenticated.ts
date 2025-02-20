'use client';
import { useIsConnectionRestored, useTonWallet } from '@tonconnect/ui-react';

export const useIsAuthenticated = () => {
  const isConnectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();

  console.log(isConnectionRestored, wallet !== null);

  return { isConnectionRestored, isAuthenticated: wallet !== null  };
};
