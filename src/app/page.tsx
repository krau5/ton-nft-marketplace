'use client';
import { useEffect } from 'react';
import { NftGallery } from '@/components/NftGallery';
import { redirect } from 'next/navigation';
import { useFetchNfts, useIsAuthenticated } from '@/hooks';

type LoadMoreButtonProps = {
  loading: boolean;
  onClick: () => void;
}

const LoadMoreButton = ({
  loading,
  onClick
}: LoadMoreButtonProps) => (
  <div className="w-full flex items-center justify-center mb-4">
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
    >
      {loading ? 'Loading...' : 'Load More'}
    </button>
  </div>
);

export default function Home() {
  const { isConnectionRestored, isAuthenticated } = useIsAuthenticated();
  const { nfts, hasMore, loading, loadMore } = useFetchNfts();

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
      {hasMore && <LoadMoreButton loading={loading} onClick={loadMore} />}
    </>
  );
}
