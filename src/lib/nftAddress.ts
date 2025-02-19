import {Client} from "@notionhq/client";
import {TableRowBlockObjectResponse} from "@notionhq/client/build/src/api-endpoints";

export type NftAddress = string;

type NftAddressServiceResponse = {
  addresses: NftAddress[];
  newAddresses: NftAddress[];
  hasMore: boolean;
}

interface INftAddressService {
  fetch: (blockId?: string) => Promise<NftAddressServiceResponse>
  get: () => NftAddress[]
}

const isTableRow = (value: unknown): value is TableRowBlockObjectResponse =>
  Boolean(
    value && typeof value === 'object' && 'type' in value && value['type'] === 'table_row'
  )

class NftAddressService implements INftAddressService {
  private readonly client: Client;
  private readonly addresses: NftAddress[];

  private cursor?: string;
  private hasMore: boolean = true;
  private readonly pageSize: number;

  constructor(auth?: string, pageSize: number = 1) {
    if (!auth) {
      throw new Error("auth token is missing")
    }

    this.client = new Client({ auth })
    this.addresses = [];
    this.pageSize = pageSize
  }

  /**
   * Fetches addresses from a Notion table.
   * @param blockId - The ID of the Notion block containing the table.
   * @returns An object containing all addresses, the newly fetched addresses and hasMore flag.
   */
  async fetch(blockId?: string) {
    if (!this.hasMore) {
      return { addresses: [], newAddresses: [], hasMore: false };
    }

    if (!blockId) {
      throw new Error("blockId is missing")
    }

    const { results, has_more: hasMore, next_cursor: nextCursor } = await this.client.blocks.children.list({ block_id: blockId, page_size: this.pageSize + 1, start_cursor: this.cursor })

    const newAddresses = results
      .slice(this.cursor ? 0 : 1)
      .filter(isTableRow)
      .map((entry) => entry.table_row.cells.flat()[0].plain_text);

    this.addresses.push(...newAddresses);
    this.hasMore = hasMore;
    if (hasMore && nextCursor) {
      this.cursor = nextCursor;
    }

    return { addresses: this.addresses, newAddresses, hasMore }
  }

  /**
   * Retrieves all fetched addresses.
   * @returns An array of addresses.
   */
  get(): NftAddress[] {
    return this.addresses
  }
}

export const nftAddressService = new NftAddressService(process.env.NOTION_TOKEN);
