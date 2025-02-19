'use client';
import { useState, useEffect, useCallback } from 'react';
import { NftGallery } from '@/components/NftGallery';
import { NftMetadata } from '@/lib';

export default function Home() {
  const [nfts, setNfts] = useState<NftMetadata[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchNFTs = useCallback(async (cursorParam?: string | null) => {
    setLoading(true);
    const url = cursorParam ? `/api/nfts?cursor=${cursorParam}` : '/api/nfts';
    const res = await fetch(url);
    const data = await res.json();
    setNfts((prev) => [...prev, ...data.items]);
    setCursor(data.nextCursor || null);
    setHasMore(data.hasMore);
    setLoading(false);
  }, []);

  const handleClick = useCallback(() => {
    fetchNFTs(cursor);
  }, [cursor, fetchNFTs]);

  useEffect(() => {
    fetchNFTs(null);
  }, [fetchNFTs]);

  return (
    <>
      <NftGallery items={nfts} />

      {hasMore && (
        <div className="w-full flex items-center justify-center mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
}
