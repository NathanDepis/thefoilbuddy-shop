import type {
  WixImage,
  WixProduct,
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
 * Wix media URLs come in two shapes:
 *  - already-resolved CDN URLs (https://static.wixstatic.com/media/...)
 *  - internal refs (wix:image://v1/<filename>/<original-name>#originWidth=...)
 * Meta Commerce needs absolute HTTPS URLs.
 */
export function wixImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const match = url.match(/^wix:image:\/\/v1\/([^/]+)/);
  if (match) return `https://static.wixstatic.com/media/${match[1]}`;
  return undefined;
}

function collectImages(media: WixProduct['media'] | WixVariant['media']): string[] {
  const out: string[] = [];
  const push = (img: WixImage | undefined) => {
    const u = wixImageUrl(img?.url);
    if (u && !out.includes(u)) out.push(u);
  };
  push(media?.main?.image);
  for (const it of media?.itemsInfo?.items ?? []) push(it.image);
  return out;
}

function availability(
  product: WixProduct,
  variant?: WixVariant,
): 'in stock' | 'out of stock' | 'preorder' {
  if (variant?.inventoryStatus) {
    if (variant.inventoryStatus.inStock) return 'in stock';
    if (variant.inventoryStatus.preorderEnabled) return 'preorder';
    return 'out of stock';
  }
  switch (product.inventory?.availabilityStatus) {
    case 'IN_STOCK':
    case 'PARTIALLY_OUT_OF_STOCK':
      return 'in stock';
    case 'OUT_OF_STOCK':
      return 'out of stock';
    default:
      return 'in stock';
  }
}

function buildVariantTitle(productName: string, variant: WixVariant): string {
  const opts = (variant.choices ?? [])
    .map((c) => c.optionChoiceNames?.choiceName)
    .filter((v): v is string => Boolean(v));
  if (opts.length === 0) return productName;
  return `${productName} - ${opts.join(' - ')}`;
}

function findChoice(
  variant: WixVariant,
  optionName: string,
): string | undefined {
  for (const c of variant.choices ?? []) {
    if (
      c.optionChoiceNames?.optionName?.toLowerCase() === optionName.toLowerCase()
    ) {
      return c.optionChoiceNames?.choiceName;
    }
  }
  return undefined;
}

function variantQueryString(variant: WixVariant): string {
  const parts: string[] = [];
  for (const c of variant.choices ?? []) {
    const k = c.optionChoiceNames?.optionName;
    const v = c.optionChoiceNames?.choiceName;
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
  availability: 'in stock' | 'out of stock' | 'preorder';
  price?: string;
  salePrice?: string;
  brand: string;
  itemGroupId?: string;
  color?: string;
  size?: string;
  sku?: string;
};

export function mapVariantsToItems(
  product: WixProduct,
  siteUrl: string,
): Item[] {
  const productId = product.id ?? '';
  const slug = product.slug ?? productId;
  const name = (product.name ?? '').replace(/\s+/g, ' ').trim();
  const baseLink = `${siteUrl.replace(/\/$/, '')}/shop/${encodeURIComponent(slug)}`;
  const description = truncate(stripHtml(product.description ?? ''), DESCRIPTION_MAX);
  const brand = product.brand?.name?.trim() || DEFAULT_BRAND;
  const currency =
    product.currency ||
    product.actualPriceRange?.minValue?.currency ||
    'EUR';
  const productImages = collectImages(product.media);

  const variants = product.variantsInfo?.variants ?? [];
  const hasRealVariants =
    variants.length > 1 ||
    (variants.length === 1 && (variants[0].choices ?? []).length > 0);

  if (!hasRealVariants) {
    const v = variants[0];
    const actualAmount =
      v?.price?.actualPrice?.amount ??
      product.actualPriceRange?.minValue?.amount;
    const compareAmount =
      v?.price?.compareAtPrice?.amount ??
      product.compareAtPriceRange?.minValue?.amount;
    const price = actualAmount ? formatPrice(actualAmount, currency) : undefined;
    const compare = compareAmount
      ? formatPrice(compareAmount, currency)
      : undefined;
    // Google Shopping convention: list price goes in g:price, discounted price
    // in g:sale_price. Wix exposes the discounted as `actualPrice` and the
    // list as `compareAtPrice`, so we swap when a compare-at exists and is
    // strictly higher.
    let finalPrice = price;
    let finalSale: string | undefined;
    if (
      compare &&
      compareAmount &&
      actualAmount &&
      parseFloat(compareAmount) > parseFloat(actualAmount)
    ) {
      finalPrice = compare;
      finalSale = price;
    }
    return [
      {
        id: v?.sku || productId,
        title: truncate(name, TITLE_MAX),
        description,
        link: baseLink,
        imageLink: productImages[0],
        additionalImages: productImages.slice(1, 1 + ADDITIONAL_IMAGE_MAX),
        availability: availability(product, v),
        price: finalPrice,
        salePrice: finalSale,
        brand,
        itemGroupId: undefined,
        sku: v?.sku,
      },
    ];
  }

  return variants.map<Item>((v) => {
    const variantImages = collectImages(v.media);
    const images = variantImages.length > 0 ? variantImages : productImages;
    const qs = variantQueryString(v);
    const actualAmount = v.price?.actualPrice?.amount;
    const compareAmount = v.price?.compareAtPrice?.amount;
    const price = actualAmount ? formatPrice(actualAmount, currency) : undefined;
    const compare = compareAmount
      ? formatPrice(compareAmount, currency)
      : undefined;
    let finalPrice = price;
    let finalSale: string | undefined;
    if (
      compare &&
      compareAmount &&
      actualAmount &&
      parseFloat(compareAmount) > parseFloat(actualAmount)
    ) {
      finalPrice = compare;
      finalSale = price;
    }
    const id = v.sku || `${productId}_${v.id ?? ''}`;
    return {
      id,
      title: truncate(buildVariantTitle(name, v), TITLE_MAX),
      description,
      link: qs ? `${baseLink}?${qs}` : baseLink,
      imageLink: images[0],
      additionalImages: images.slice(1, 1 + ADDITIONAL_IMAGE_MAX),
      availability: availability(product, v),
      price: finalPrice,
      salePrice: finalSale,
      brand,
      itemGroupId: productId,
      color: findChoice(v, 'Color') ?? findChoice(v, 'Couleur'),
      size: findChoice(v, 'Size') ?? findChoice(v, 'Taille'),
      sku: v.sku,
    };
  });
}

function tag(name: string, value: string | undefined): string {
  if (value === undefined || value === null || value === '') return '';
  return `      <${name}>${escapeXml(String(value))}</${name}>\n`;
}

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
