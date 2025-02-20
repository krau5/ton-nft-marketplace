'use client';
import { useIsConnectionRestored, useTonWallet } from '@tonconnect/ui-react';

export const useIsAuthenticated = () => {
  const isConnectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();

  return { isConnectionRestored, isAuthenticated: wallet !== null  };
};
