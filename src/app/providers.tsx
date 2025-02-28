'use client';
import { PropsWithChildren } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const manifestUrl = 'https://pastebin.com/raw/V3Dd53y3';

export function Providers({  children }: PropsWithChildren) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}
