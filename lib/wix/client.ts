/**
 * Server-to-server Wix Stores client used by the Meta product feed.
 *
 * Uses the Stores Catalog v1 REST endpoint with an account-level API key.
 * Why v1: TheFoilBuddy's site is on CATALOG_V1 (Wix returns 428 on v3
 * endpoints with `CATALOG_V1_SITE_CALLING_CATALOG_V3_API`). v1 is the
 * legacy-but-still-supported catalog model.
 */

const WIX_PRODUCTS_QUERY_URL =
  'https://www.wixapis.com/stores/v1/products/query';

const PAGE_LIMIT = 100;

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
  mainMedia?: WixMediaItem;
  items?: WixMediaItem[];
};

export type WixPriceData = {
  currency?: string;
  price?: number;
  discountedPrice?: number;
  formatted?: { price?: string; discountedPrice?: string };
};

export type WixStock = {
  trackInventory?: boolean;
  inStock?: boolean;
  inventoryStatus?:
    | 'IN_STOCK'
    | 'OUT_OF_STOCK'
    | 'PARTIALLY_OUT_OF_STOCK'
    | string;
  quantity?: number;
};

export type WixOptionChoice = {
  value?: string;
  description?: string;
  inStock?: boolean;
  visible?: boolean;
  media?: WixProductMedia;
};

export type WixProductOption = {
  optionType?: string;
  name?: string;
  choices?: WixOptionChoice[];
};

export type WixVariantInner = {
  priceData?: WixPriceData;
  sku?: string;
  visible?: boolean;
  weight?: number;
};

export type WixVariant = {
  id?: string;
  choices?: Record<string, string>;
  variant?: WixVariantInner;
  stock?: WixStock;
};

export type WixProduct = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  visible?: boolean;
  productType?: string;
  manageVariants?: boolean;
  brand?: string;
  sku?: string;
  priceData?: WixPriceData;
  stock?: WixStock;
  media?: WixProductMedia;
  productOptions?: WixProductOption[];
  variants?: WixVariant[];
  productPageUrl?: { base?: string; path?: string };
};

type QueryResponse = {
  products?: WixProduct[];
  totalResults?: number;
  metadata?: { items?: number; offset?: number };
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

function readEnv(): { apiKey: string; siteId: string; accountId: string } {
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

async function fetchPage(offset: number): Promise<QueryResponse> {
  const { apiKey, siteId, accountId } = readEnv();
  const res = await fetch(WIX_PRODUCTS_QUERY_URL, {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'wix-site-id': siteId,
      'wix-account-id': accountId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: { paging: { limit: PAGE_LIMIT, offset } },
      includeVariants: true,
    }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.text();
    throw new WixApiError(
      `Wix products/query returned ${res.status}`,
      res.status,
      body.slice(0, 500),
    );
  }
  return (await res.json()) as QueryResponse;
}

/**
 * Fetch every visible product from Wix Stores via offset pagination.
 * Hard cap at 50 pages (5000 products) as a safety guard.
 */
export async function fetchAllWixProducts(): Promise<WixProduct[]> {
  const all: WixProduct[] = [];
  for (let i = 0; i < 50; i++) {
    const page = await fetchPage(i * PAGE_LIMIT);
    const items = page.products ?? [];
    all.push(...items);
    if (items.length < PAGE_LIMIT) break;
  }
  return all.filter((p) => p.visible !== false);
}
