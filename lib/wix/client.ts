/**
 * Server-to-server Wix Stores client used by the Meta product feed.
 *
 * We hit the REST Catalog v3 endpoint directly with an API key (not the
 * OAuth Headless visitor flow used in `lib/wix-server.ts`), because the feed
 * runs unattended and must not be tied to a visitor session.
 */

const WIX_PRODUCTS_SEARCH_URL =
  'https://www.wixapis.com/stores/v3/products-search/search';

const PAGE_LIMIT = 100;

export type WixMoney = {
  amount: string;
  currency?: string;
  formattedAmount?: string;
};

export type WixImage = {
  url?: string;
  altText?: string;
  width?: number;
  height?: number;
};

export type WixMediaItem = {
  image?: WixImage;
};

export type WixProductMedia = {
  main?: WixMediaItem;
  itemsInfo?: { items?: WixMediaItem[] };
};

export type WixOptionChoice = {
  name?: string;
  choiceType?: string;
  colorCode?: string;
};

export type WixProductOption = {
  name?: string;
  optionRenderType?: string;
  choicesSettings?: { choices?: WixOptionChoice[] };
};

export type WixVariantChoice = {
  optionChoiceNames?: { optionName?: string; choiceName?: string };
};

export type WixVariantPrice = {
  actualPrice?: WixMoney;
  compareAtPrice?: WixMoney;
};

export type WixVariantInventory = {
  inStock?: boolean;
  preorderEnabled?: boolean;
  availableForPreorder?: boolean;
};

export type WixVariant = {
  id?: string;
  sku?: string;
  visible?: boolean;
  price?: WixVariantPrice;
  choices?: WixVariantChoice[];
  media?: WixProductMedia;
  inventoryStatus?: WixVariantInventory;
};

export type WixInventory = {
  availabilityStatus?:
    | 'IN_STOCK'
    | 'OUT_OF_STOCK'
    | 'PARTIALLY_OUT_OF_STOCK'
    | 'UNKNOWN_AVAILABILITY_STATUS';
  preorderStatus?: string;
};

export type WixPriceRange = {
  minValue?: WixMoney;
  maxValue?: WixMoney;
};

export type WixBrand = { name?: string };

export type WixProduct = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  plainDescription?: string;
  visible?: boolean;
  brand?: WixBrand;
  currency?: string;
  media?: WixProductMedia;
  options?: WixProductOption[];
  variantsInfo?: { variants?: WixVariant[] };
  inventory?: WixInventory;
  actualPriceRange?: WixPriceRange;
  compareAtPriceRange?: WixPriceRange;
};

type SearchResponse = {
  products?: WixProduct[];
  pagingMetadata?: {
    cursors?: { next?: string };
    hasNext?: boolean;
  };
};

export class WixApiError extends Error {
  status: number;
  body: string;
  constructor(message: string, status: number, body: string) {
    super(message);
    this.name = 'WixApiError';
    this.status = status;
    this.body = body;
  }
}

function readEnv(): {
  apiKey: string;
  siteId: string;
  accountId: string;
} {
  const apiKey = process.env.WIX_API_KEY;
  const siteId = process.env.WIX_SITE_ID;
  const accountId = process.env.WIX_ACCOUNT_ID;
  if (!apiKey || !siteId || !accountId) {
    throw new Error(
      'Missing Wix env vars — WIX_API_KEY, WIX_SITE_ID and WIX_ACCOUNT_ID are all required',
    );
  }
  return { apiKey, siteId, accountId };
}

async function fetchPage(cursor?: string): Promise<SearchResponse> {
  const { apiKey, siteId, accountId } = readEnv();

  // Catalog v3 search payload. cursorPaging.cursor is undefined on the first
  // page; only `limit` is passed. On subsequent pages we send the cursor and
  // omit `limit` per the v3 spec.
  const search: Record<string, unknown> = cursor
    ? { cursorPaging: { cursor } }
    : { cursorPaging: { limit: PAGE_LIMIT } };

  const res = await fetch(WIX_PRODUCTS_SEARCH_URL, {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'wix-site-id': siteId,
      'wix-account-id': accountId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ search }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text();
    throw new WixApiError(
      `Wix products-search returned ${res.status}`,
      res.status,
      body.slice(0, 500),
    );
  }

  return (await res.json()) as SearchResponse;
}

/**
 * Fetch every product from Wix Stores via cursor pagination.
 * Returns only visible products. Stops at 50 pages (5000 products) as a
 * safety guard against infinite pagination loops.
 */
export async function fetchAllWixProducts(): Promise<WixProduct[]> {
  const all: WixProduct[] = [];
  let cursor: string | undefined;
  for (let i = 0; i < 50; i++) {
    const page = await fetchPage(cursor);
    if (page.products) all.push(...page.products);
    const next = page.pagingMetadata?.cursors?.next;
    if (!next || page.pagingMetadata?.hasNext === false) break;
    cursor = next;
  }
  return all.filter((p) => p.visible !== false);
}
