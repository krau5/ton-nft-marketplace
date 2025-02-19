'use client';
import Image from 'next/image';
import type { NftMetadata } from '@/lib/nftMetadata';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';

type NftCardProps = {
  data: NftMetadata;
};

type AddressRowProps = {
  label: string;
  value: string;
};

type ImageContainerProps = {
  src: string;
  previewSrc: string;
  alt: string;
}

const AddressRow = ({ label, value }: AddressRowProps) => (
  <p className="truncate">
    <span className="font-semibold">{label}:</span> {value}
  </p>
);

const ImageContainer = ({ src, previewSrc, alt }: ImageContainerProps) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback((e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget.getBoundingClientRect();
    setDimensions({ width, height });
    setLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    if (currentSrc !== previewSrc) {
      setCurrentSrc(previewSrc);
    }
  }, [currentSrc, previewSrc]);

  useEffect(() => {
    if (loaded || currentSrc !== src) {
      return;
    }

    const timer = setTimeout(() => {
      setCurrentSrc(previewSrc);
    }, 5000);

    return () => clearTimeout(timer);
  }, [loaded, currentSrc, src, previewSrc]);

  return (
    <div className="relative w-full">
      <Image
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className="block w-full h-auto object-cover"
        width={dimensions.width}
        height={dimensions.height}
        priority
      />
    </div>
  );
};

export const NftCard = ({ data }: NftCardProps) => {
  const addresses = [
    { label: 'NFT Address', value: data.address },
    { label: 'Owner Address', value: data.ownerAddress },
    { label: 'Raw Address', value: data.rawAddress },
  ] as const;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
      <ImageContainer src={data.image} previewSrc={data.preview} alt={data.name} />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{data.name}</h2>
        <p className="text-gray-600 mb-4">{data.description}</p>
        <div className="space-y-2 text-sm">
          {addresses.map(({ label, value }) => (
            <AddressRow key={label} label={label} value={value} />
          ))}
        </div>
      </div>
    </div>
  );
};
