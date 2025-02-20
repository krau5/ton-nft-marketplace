import { NftMetadata } from '@/lib';
import { NftCard } from './NftCard';

type Props = {
  items: NftMetadata[];
}

export const NftGallery = ({ items }: Props) => (
  <div className="flex flex-col items-center px-4 py-6 w-full gap-4">
    {items.map((item) => (
      <NftCard data={item} key={item.address} />
    ))}
  </div>
);

