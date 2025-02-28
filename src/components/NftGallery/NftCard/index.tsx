'use client';
import type { NftMetadata } from '@/lib';
import { ImageContainer } from './ImageContainer';

type NftCardProps = {
  data: NftMetadata;
};

type AddressRowProps = {
  label: string;
  value: string;
};

const formatAddress = (value: string): string => {
  if (value.length <= 7) {
    return value;
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
};

const AddressRow = ({ label, value }: AddressRowProps) => (
  <p className="truncate">
    <span className="font-semibold">{label}:</span> {formatAddress(value)}
  </p>
);

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
