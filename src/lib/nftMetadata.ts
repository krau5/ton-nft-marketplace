import {NftAddress} from "@/lib/nftAddress";
import {NftItem, TonApiClient} from "@ton-api/client";
import {Address} from "@ton/core";

type NftMetadata = {
  address: string;
  rawAddress: string;
  ownerAddress: string;
  image: string;
  name: string;
  description: string;
}

type NftMetadataMap = Record<NftAddress, NftMetadata>;

interface INftMetadataService {
  /**
   * Fetches metadata for multiple NFTs by their addresses
   * @param addresses Array of NFT addresses to fetch metadata for
   * @returns Map of NFT addresses to their metadata
   */
  fetchByAddresses: (addresses: NftAddress[]) => Promise<NftMetadataMap>;
}

class NftMetadataService implements INftMetadataService {
  private client: TonApiClient;

  constructor(apiKey?: string) {
    if (!apiKey) {
      throw new Error("apiKey is missing");
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
    const {nftItems} = await this.client.nft.getNftItemsByAddresses({ accountIds: parsedAddresses })

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
        acc.push(address)
        return acc
      } catch (e) {
        console.error(`failed to parse address: ${e}`);
        return acc
      }
    }, [])
  }

  /**
   * Maps NFT items to their metadata format
   * @param items Array of NFT items from TON API
   * @param addresses Original NFT addresses for filtering
   * @returns Map of addresses to formatted metadata
   */
  private mapItemsToMetadata(items: NftItem[], addresses: NftAddress[]): NftMetadataMap {
    return items.reduce<NftMetadataMap>((acc, item) => {
      const metadata = this.formatMetadata(item);
      if (addresses.includes(metadata.address)) {
        acc[metadata.address] = metadata;
      }
      return acc;
    }, {})
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
      name: data.metadata.name,
      description: data.metadata.description,
    }
  }
}

export const nftMetadataService = new NftMetadataService(process.env.TON_API_KEY)
