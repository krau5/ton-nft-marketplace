'use client';
import { PropsWithChildren } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const manifestUrl = 'https://api.jsonserve.com/WGXKUo';

export function Providers({  children }: PropsWithChildren) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}
