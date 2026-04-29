import type {
  WixImage,
  WixProduct,
  WixProductMedia,
  WixVariant,
} from '@/lib/wix/client';

const TITLE_MAX = 150;
const DESCRIPTION_MAX = 5000;
const ADDITIONAL_IMAGE_MAX = 10;
const DEFAULT_BRAND = 'The Foil Buddy';

type BuildOptions = {
  siteUrl: string;
  channelTitle?: string;
  channelDescription?: string;
};

export function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Strip HTML tags and decode the handful of entities Wix emits, then collapse
 * whitespace. Meta requires plain text in g:description.
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|ul|ol|h[1-6])\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim();
}

export function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + '…';
}

/** Always 2 decimals + ISO currency, e.g. "199.00 EUR". */
export function formatPrice(amount: string | number, currency: string): string {
  const n = typeof amount === 'number' ? amount : parseFloat(amount);
  if (!Number.isFinite(n)) return '';
  return `${n.toFixed(2)} ${currency.toUpperCase()}`;
}

/**
 * Wix v1 typically returns absolute https://static.wixstatic.com URLs already.
 * Keep the wix:image:// fallback in case the schema ever changes.
 */
export function wixImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const match = url.match(/^wix:image:\/\/v1\/([^/]+)/);
  if (match) return `https://static.wixstatic.com/media/${match[1]}`;
  return undefined;
}

function collectImages(media: WixProductMedia | undefined): string[] {
  const out: string[] = [];
  const push = (img: WixImage | undefined) => {
    const u = wixImageUrl(img?.url);
    if (u && !out.includes(u)) out.push(u);
  };
  push(media?.mainMedia?.image);
  for (const it of media?.items ?? []) push(it.image);
  return out;
}

function availability(
  product: WixProduct,
  variant?: WixVariant,
): 'in stock' | 'out of stock' {
  const stock = variant?.stock ?? product.stock;
  if (stock?.inStock === false) return 'out of stock';
  if (stock?.inventoryStatus === 'OUT_OF_STOCK') return 'out of stock';
  return 'in stock';
}

function findChoice(
  variant: WixVariant,
  ...names: string[]
): string | undefined {
  const choices = variant.choices ?? {};
  for (const name of names) {
    for (const k of Object.keys(choices)) {
      if (k.toLowerCase() === name.toLowerCase()) return choices[k];
    }
  }
  return undefined;
}

function buildVariantTitle(productName: string, variant: WixVariant): string {
  const opts = Object.values(variant.choices ?? {}).filter(Boolean);
  if (opts.length === 0) return productName;
  return `${productName} - ${opts.join(' - ')}`;
}

function variantQueryString(variant: WixVariant): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(variant.choices ?? {})) {
    if (k && v) parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  }
  return parts.join('&');
}

type Item = {
  id: string;
  title: string;
  description: string;
  link: string;
  imageLink?: string;
  additionalImages: string[];
  availability: 'in stock' | 'out of stock';
  price?: string;
  salePrice?: string;
  brand: string;
  itemGroupId?: string;
  color?: string;
  size?: string;
};

function priceTuple(
  price: number | undefined,
  discounted: number | undefined,
  currency: string,
): { price?: string; salePrice?: string } {
  if (price === undefined) return {};
  // Google Shopping convention: g:price = list price, g:sale_price = current
  // discounted price (only when actually discounted).
  if (discounted !== undefined && discounted < price) {
    return {
      price: formatPrice(price, currency),
      salePrice: formatPrice(discounted, currency),
    };
  }
  // No discount: emit g:price as the discountedPrice (= current selling price
  // in Wix when no promo) and skip g:sale_price.
  const current = discounted ?? price;
  return { price: formatPrice(current, currency) };
}

export function mapVariantsToItems(
  product: WixProduct,
  siteUrl: string,
): Item[] {
  const productId = product.id ?? '';
  const slug = product.slug ?? productId;
  const name = (product.name ?? '').replace(/\s+/g, ' ').trim();
  const baseLink = `${siteUrl.replace(/\/$/, '')}/shop/${encodeURIComponent(slug)}`;
  const description = truncate(stripHtml(product.description ?? ''), DESCRIPTION_MAX);
  const brand = product.brand?.trim() || DEFAULT_BRAND;
  const currency = product.priceData?.currency || 'EUR';
  const productImages = collectImages(product.media);

  const variants = product.variants ?? [];
  // Real variants only exist when manageVariants=true. When false, Wix returns
  // a single dummy variant with id=00000000-... and choices={} that we ignore
  // in favor of product-level fields.
  const realVariants = product.manageVariants
    ? variants.filter((v) => v.choices && Object.keys(v.choices).length > 0)
    : [];

  if (realVariants.length === 0) {
    const { price, salePrice } = priceTuple(
      product.priceData?.price,
      product.priceData?.discountedPrice,
      currency,
    );
    return [
      {
        id: product.sku || productId,
        title: truncate(name, TITLE_MAX),
        description,
        link: baseLink,
        imageLink: productImages[0],
        additionalImages: productImages.slice(1, 1 + ADDITIONAL_IMAGE_MAX),
        availability: availability(product),
        price,
        salePrice,
        brand,
      },
    ];
  }

  return realVariants.map<Item>((v) => {
    const variantImages = collectImages(v.variant ? undefined : undefined);
    const images = variantImages.length > 0 ? variantImages : productImages;
    const qs = variantQueryString(v);
    const { price, salePrice } = priceTuple(
      v.variant?.priceData?.price ?? product.priceData?.price,
      v.variant?.priceData?.discountedPrice ?? product.priceData?.discountedPrice,
      currency,
    );
    const id = v.variant?.sku || `${productId}_${v.id ?? ''}`;
    return {
      id,
      title: truncate(buildVariantTitle(name, v), TITLE_MAX),
      description,
      link: qs ? `${baseLink}?${qs}` : baseLink,
      imageLink: images[0],
      additionalImages: images.slice(1, 1 + ADDITIONAL_IMAGE_MAX),
      availability: availability(product, v),
      price,
      salePrice,
      brand,
      itemGroupId: productId,
      color: findChoice(v, 'Color', 'Couleur'),
      size: findChoice(v, 'Size', 'Taille'),
    };
  });
}

function tag(name: string, value: string | undefined): string {
  if (value === undefined || value === null || value === '') return '';
  return `      <${name}>${escapeXml(String(value))}</${name}>\n`;
}

// Google Shopping taxonomy path. Wingfoil tools fall under boating/water sports
// hardware. Hardcoded since all 3 SKUs sit in the same category and Wix has no
// custom field mapping. If the catalog ever diversifies, add per-product
// overrides via product.collectionIds → category map.
const GOOGLE_PRODUCT_CATEGORY =
  'Sporting Goods > Outdoor Recreation > Boating & Water Sports';

function renderItem(it: Item): string {
  const additional = it.additionalImages
    .map((u) => tag('g:additional_image_link', u))
    .join('');
  return (
    `    <item>\n` +
    tag('g:id', it.id) +
    tag('g:title', it.title.replace(/\s*\n\s*/g, ' ')) +
    tag('g:description', it.description) +
    tag('g:link', it.link) +
    tag('g:image_link', it.imageLink) +
    additional +
    tag('g:availability', it.availability) +
    tag('g:price', it.price) +
    tag('g:sale_price', it.salePrice) +
    tag('g:condition', 'new') +
    tag('g:brand', it.brand) +
    tag('g:item_group_id', it.itemGroupId) +
    tag('g:color', it.color) +
    tag('g:size', it.size) +
    tag('g:google_product_category', GOOGLE_PRODUCT_CATEGORY) +
    tag('g:identifier_exists', 'no') +
    `    </item>\n`
  );
}

export function buildMetaFeedXml(
  products: WixProduct[],
  opts: BuildOptions,
): string {
  const items = products.flatMap((p) => mapVariantsToItems(p, opts.siteUrl));
  const channelTitle = opts.channelTitle ?? 'The Foil Buddy';
  const channelDesc =
    opts.channelDescription ?? 'The Foil Buddy product catalog';
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n` +
    `  <channel>\n` +
    `    <title>${escapeXml(channelTitle)}</title>\n` +
    `    <link>${escapeXml(opts.siteUrl)}</link>\n` +
    `    <description>${escapeXml(channelDesc)}</description>\n` +
    items.map(renderItem).join('') +
    `  </channel>\n` +
    `</rss>\n`
  );
}
