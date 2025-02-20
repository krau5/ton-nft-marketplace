import { Client } from '@notionhq/client';
import { TableRowBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export type NftAddress = string;

export type NftAddressServiceResponse = {
  addresses: NftAddress[];
  hasMore: boolean;
  nextCursor?: string | null;
};

interface INftAddressService {
  fetch: (blockId?: string, cursor?: string) => Promise<NftAddressServiceResponse>
}

const isTableRow = (value: unknown): value is TableRowBlockObjectResponse =>
  Boolean(
    value &&
    typeof value === 'object' &&
    'type' in value &&
    value['type'] === 'table_row'
  );

export class NftAddressService implements INftAddressService {
  private readonly client: Client;
  private readonly pageSize: number;

  constructor(auth?: string, pageSize: number = 5) {
    if (!auth) {
      throw new Error('auth token is missing');
    }
    this.client = new Client({ auth });
    this.pageSize = pageSize;
  }

  /**
   * Fetches one page of addresses.
   * Removes the header row on the initial (cursor undefined) request.
   */
  async fetch(
    blockId?: string,
    cursor?: string
  ): Promise<NftAddressServiceResponse> {
    if (!blockId) {
      throw new Error('blockId is missing');
    }

    const { results, has_more: hasMore, next_cursor: nextCursor } =
      await this.client.blocks.children.list({
        block_id: blockId,
        page_size: this.pageSize + (cursor ? 0 : 1),
        start_cursor: cursor,
      });

    let addresses: NftAddress[] = results.filter(isTableRow).map((entry) =>
      entry.table_row.cells.flat()[0].plain_text
    );

    if (!cursor && addresses.length !== 0) {
      addresses.shift();
    }

    addresses = [...new Set(addresses)];

    return { addresses, hasMore, nextCursor };
  }
}
