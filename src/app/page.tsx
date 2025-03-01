'use client';
import { useCallback, useEffect } from 'react';
import { NftGallery } from '@/components/NftGallery';
import { redirect } from 'next/navigation';
import { useFetchNfts, useIsAuthenticated, useScrollEnd } from '@/hooks';
import { Loader } from '@/components/Loader';

export default function Home() {
  const { isConnectionRestored, isAuthenticated } = useIsAuthenticated();
  const { nfts, hasMore, loading, loadMore } = useFetchNfts();

  const handleScrollEnd = useCallback(() => {
    if (hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loadMore, loading]);

  useScrollEnd(handleScrollEnd);

  useEffect(() => {
    if (isConnectionRestored && !isAuthenticated) {
      redirect('/login');
    }
  }, [isAuthenticated, isConnectionRestored]);

  if (!isConnectionRestored) {
    return null;
  }

  return (
    <>
      <NftGallery items={nfts} />

      {loading && (
        <div className="flex justify-center items-center w-full mb-6">
          <Loader />
        </div>
      )}
    </>
  );
}
