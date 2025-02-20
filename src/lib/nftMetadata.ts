import { NftItem, TonApiClient } from '@ton-api/client';
import { Address } from '@ton/core';
import { NftAddress } from './nftAddress';

export type NftMetadata = {
  address: string;
  rawAddress: string;
  ownerAddress: string;
  image: string;
  preview: string;
  name: string;
  description: string;
}

export type NftMetadataMap = Record<NftAddress, NftMetadata>;

interface INftMetadataService {
  /**
   * Fetches metadata for multiple NFTs by their addresses
   * @param addresses Array of NFT addresses to fetch metadata for
   * @returns Map of NFT addresses to their metadata
   */
  fetchByAddresses: (addresses: NftAddress[]) => Promise<NftMetadataMap>;
}

export class NftMetadataService implements INftMetadataService {
  private client: TonApiClient;

  constructor(apiKey?: string) {
    if (!apiKey) {
      throw new Error('apiKey is missing');
    }

    this.client = new TonApiClient({ baseUrl: 'https://tonapi.io', apiKey });
  }

  /**
   * Fetches metadata for multiple NFTs by their addresses
   * @param addresses Array of NFT addresses to fetch metadata for
   * @returns Map of NFT addresses to their metadata
   */
  async fetchByAddresses(addresses: NftAddress[]) {
    const parsedAddresses = this.parseAddresses(addresses);
    if (parsedAddresses.length === 0) {
      return {};
    }

    const { nftItems } = await this.client.nft.getNftItemsByAddresses({ accountIds: parsedAddresses });

    return this.mapItemsToMetadata(nftItems, addresses);
  }

  /**
   * Converts string addresses to TON Address objects
   * @param addresses Array of NFT address strings
   * @returns Array of parsed TON Address objects, skipping any invalid addresses
   */
  private parseAddresses(addresses: NftAddress[]): Address[] {
    return addresses.reduce<Address[]>((acc, value) => {
      try {
        const address = Address.parse(value);
        acc.push(address);
        return acc;
      } catch (e) {
        console.error(`failed to parse address: ${e}`);
        return acc;
      }
    }, []);
  }

  /**
   * Maps NFT items to their metadata format
   * @param items Array of NFT items from TON API
   * @param addresses Original NFT addresses for filtering
   * @returns Map of addresses to formatted metadata
   */
  private mapItemsToMetadata(items: NftItem[], addresses: NftAddress[]): NftMetadataMap {
    const itemMap = new Map(items.map((item) => {
      const metadata = this.formatMetadata(item);
      return [metadata.address, metadata];
    }));

    return addresses.reduce<NftMetadataMap>((acc, address) => {
      if (itemMap.has(address)) {
        acc[address] = itemMap.get(address)!;
      }
      return acc;
    }, {});
  }

  /**
   * Formats a single NFT item into metadata structure
   * @param data NFT item from TON API
   * @returns Formatted metadata object
   */
  private formatMetadata(data: NftItem): NftMetadata {
    return {
      address: data.address.toString(),
      rawAddress: data.address.toRawString(),
      ownerAddress: data.owner?.address.toString() ?? '',
      image: data.metadata.image,
      preview: data.previews?.find(preview => preview.resolution==='1500x1500')?.url ?? '',
      name: data.metadata.name,
      description: data.metadata.description,
    };
  }
}
