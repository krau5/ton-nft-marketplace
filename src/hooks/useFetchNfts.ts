import { useCallback, useEffect, useState } from 'react';
import { NftMetadata } from '@/lib';

type FetchNFTsResponse = {
  items: NftMetadata[];
  nextCursor: string | null;
  hasMore: boolean;
}

export const useFetchNfts = () => {
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

      setNfts((prevNfts) => {
        const allNfts = [...prevNfts, ...data.items];

        return [...new Set(allNfts)];
      });

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
