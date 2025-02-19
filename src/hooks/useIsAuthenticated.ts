'use client';
import { useIsConnectionRestored, useTonConnectUI } from '@tonconnect/ui-react';

export const useIsAuthenticated = () => {
  const isConnectionRestored = useIsConnectionRestored();
  const [tonConnectUI] = useTonConnectUI();

  return { isConnectionRestored, isAuthenticated: tonConnectUI?.connected ?? false  };
};
