import { NextResponse } from 'next/server';
import { NftAddressService, NftMetadataService } from '@/lib';

const blockId = process.env.NOTION_NFT_TABLE_ID;
const notionAuth = process.env.NOTION_TOKEN;
const tonapiAuth = process.env.TON_API_KEY;

const nftAddressService = new NftAddressService(notionAuth);
const nftMetadataService = new NftMetadataService(tonapiAuth);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor') || undefined;

    const { addresses, hasMore, nextCursor } = await nftAddressService.fetch(
      blockId,
      cursor
    );

    const metadataMap = await nftMetadataService.fetchByAddresses(addresses);
    const items = Object.values(metadataMap);

    return NextResponse.json({ items, hasMore, nextCursor });
  } catch (e) {
    console.error('failed to retrieve nfts:', e);
    return NextResponse.json(
      { error: 'Failed to fetch NFTs' },
      { status: 500 }
    );
  }
}

export const revalidate = 600;
