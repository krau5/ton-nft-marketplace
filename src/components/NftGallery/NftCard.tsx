'use client';
import Image from 'next/image';
import type { NftMetadata } from '@/lib/nftMetadata';
import { SyntheticEvent, useCallback, useState } from 'react';

type NftCardProps = {
  data: NftMetadata;
};

type AddressRowProps = {
  label: string;
  value: string;
};

const AddressRow = ({ label, value }: AddressRowProps) => (
  <p className="truncate">
    <span className="font-semibold">{label}:</span> {value}
  </p>
);

const ImageContainer = ({ src, alt }: { src: string; alt: string }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleLoad = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = event.currentTarget.getBoundingClientRect();
    setDimensions({ width, height });
  }, []);

  return (
    <div className="relative w-full">
      <Image
        src={src}
        alt={alt}
        className="w-full h-auto"
        width={dimensions.width}
        height={dimensions.height}
        onLoad={handleLoad}
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
      <ImageContainer src={data.image} alt={data.name} />
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
