import {Client} from "@notionhq/client";
import {TableRowBlockObjectResponse} from "@notionhq/client/build/src/api-endpoints";

const pageSize = 1;

const isTableRow = (value: unknown): value is TableRowBlockObjectResponse =>
  Boolean(
    value && typeof value === 'object' && 'type' in value && value['type'] === 'table_row'
  )

class NotionService {
  private client: Client;

  constructor(auth?: string) {
    if (!auth) {
      throw new Error("auth token is missing")
    }

    this.client = new Client({ auth })
  }

  async fetchData(blockId?: string, cursor?: string) {
    if (!blockId) {
      throw new Error("blockId is missing")
    }

    const { results, has_more: hasMore, next_cursor: nextCursor } = await this.client.blocks.children.list({ block_id: blockId, page_size: pageSize, start_cursor: cursor })

    const entries = results
      .filter(isTableRow)
      .map((entry) => entry.table_row.cells.flat()[0].plain_text);

    return { entries, hasMore, nextCursor }
  }
}

export const notionService = new NotionService(process.env.NOTION_TOKEN);
