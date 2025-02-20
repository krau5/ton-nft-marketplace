'use client';
import { useCallback, useEffect, useState } from 'react';
import { NftGallery } from '@/components/NftGallery';
import { NftMetadata } from '@/lib';
import { redirect } from 'next/navigation';
import { useIsAuthenticated } from '@/hooks';

interface FetchNFTsResponse {
  items: NftMetadata[];
  nextCursor: string | null;
  hasMore: boolean;
}

type LoadMoreButtonProps = {
  loading: boolean;
  onClick: () => void;
}

const useGetData = () => {
  const [nfts, setNfts] = useState<NftMetadata[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchNFTs = useCallback(async (cursorParam?: string | null) => {
    setLoading(true);

    try {
      const url = new URL('/api/nfts', window.location.origin);
      if (cursorParam) {
        url.searchParams.set('cursor', cursorParam);
      }

      const res = await fetch(url.toString());
      const data: FetchNFTsResponse = await res.json();

      setNfts(prev => [...prev, ...data.items]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to fetch NFTs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    fetchNFTs(cursor);
  }, [cursor, fetchNFTs]);

  useEffect(() => {
    fetchNFTs(null);
  }, [fetchNFTs]);

  return {
    nfts,
    hasMore,
    loading,
    loadMore,
  };
};

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
  const { nfts, hasMore, loading, loadMore } = useGetData();

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
