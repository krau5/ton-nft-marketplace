'use client';
import { PropsWithChildren } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const manifestUrl = 'https://api.jsonserve.com/HI1fYg';

export function Providers({  children }: PropsWithChildren) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}
