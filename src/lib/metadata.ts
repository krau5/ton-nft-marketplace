import {Address as NftAddress} from "@/lib/address";
import {NftItem, TonApiClient} from "@ton-api/client";
import {Address} from "@ton/core";

type Metadata = {
  address: string;
  rawAddress: string;
  ownerAddress: string;
  image: string;
  name: string;
  description: string;
}

type NftMetadata = Record<NftAddress, Metadata>

interface INftMetadataService {
  fetchByAddresses:(value: NftAddress[]) => Promise<NftMetadata>;
}

class NftMetadataService implements INftMetadataService {
  private client: TonApiClient;

  constructor(apiKey?: string) {
    if (!apiKey) {
      throw new Error("apiKey is missing");
    }

    this.client = new TonApiClient({
      baseUrl: 'https://tonapi.io',
      apiKey
    });
  }

  formatMetadata(data: NftItem): Metadata {
    console.log(data.address.toString())
    return {
      address: data.address.toString(),
      rawAddress: data.address.toRawString(),
      ownerAddress: data.owner?.address.toString() ?? '',
      image: data.metadata.image,
      name: data.metadata.name,
      description: data.metadata.description,
    }
  }

  async fetchByAddresses(addresses: NftAddress[]) {
    const formattedAddresses = addresses.reduce<Address[]>((acc, value) => {
      try {
        const address = Address.parse(value);
        acc.push(address)
        return acc
      } catch (e) {
        console.error(`failed to parse address: ${e}`);
        return acc
      }
    }, [])

    const result: NftMetadata = {}
    const {nftItems} = await this.client.nft.getNftItemsByAddresses({ accountIds: formattedAddresses})


    for (const entry of nftItems) {
      const metadata = this.formatMetadata(entry)
      if (addresses.includes(metadata.address)) {
        result[metadata.address] = this.formatMetadata(entry)
      }
    }

    return result;
  }
}

export const nftMetadataService = new NftMetadataService(process.env.TON_API_KEY)
