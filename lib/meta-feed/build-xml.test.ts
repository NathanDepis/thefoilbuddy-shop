import { describe, it, expect } from 'vitest';
import { buildMetaFeedXml, escapeXml, formatPrice, wixImageUrl } from './build-xml';
import type { WixProduct } from '@/lib/wix/client';

const SITE_URL = 'https://thefoilbuddy.com';

function countItems(xml: string): number {
  return (xml.match(/<item>/g) ?? []).length;
}

function extract(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g');
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) out.push(m[1]);
  return out;
}

describe('escapeXml', () => {
  it('escapes the five XML entities', () => {
    expect(escapeXml(`a & b < c > d "e" 'f'`)).toBe(
      'a &amp; b &lt; c &gt; d &quot;e&quot; &apos;f&apos;',
    );
  });
});

describe('formatPrice', () => {
  it('formats with two decimals + ISO currency', () => {
    expect(formatPrice('199', 'eur')).toBe('199.00 EUR');
    expect(formatPrice(149.5, 'EUR')).toBe('149.50 EUR');
  });
});

describe('wixImageUrl', () => {
  it('passes through HTTPS URLs', () => {
    expect(wixImageUrl('https://static.wixstatic.com/x.jpg')).toBe(
      'https://static.wixstatic.com/x.jpg',
    );
  });
  it('rewrites wix:image refs to the CDN', () => {
    expect(
      wixImageUrl('wix:image://v1/abc_xyz.jpg/main.jpg#originWidth=1000'),
    ).toBe('https://static.wixstatic.com/media/abc_xyz.jpg');
  });
});

describe('buildMetaFeedXml', () => {
  it('emits a single <item> for a product without managed variants', () => {
    const products: WixProduct[] = [
      {
        id: 'p1',
        name: 'Foil Cover Pro',
        slug: 'foil-cover-pro',
        description: '<p>Great cover.</p>',
        visible: true,
        manageVariants: false,
        priceData: { price: 199, discountedPrice: 199, currency: 'EUR' },
        stock: { inStock: true, inventoryStatus: 'IN_STOCK' },
        media: {
          mainMedia: { image: { url: 'https://static.wixstatic.com/media/p1-main.jpg' } },
        },
      },
    ];
    const xml = buildMetaFeedXml(products, { siteUrl: SITE_URL });
    expect(countItems(xml)).toBe(1);
    expect(xml).toContain('<g:id>p1</g:id>');
    expect(xml).toContain('<g:title>Foil Cover Pro</g:title>');
    expect(xml).toContain('<g:price>199.00 EUR</g:price>');
    expect(xml).toContain(
      '<g:link>https://thefoilbuddy.com/shop/foil-cover-pro</g:link>',
    );
    expect(xml).toContain('<g:availability>in stock</g:availability>');
    expect(xml).not.toContain('<g:item_group_id>');
    expect(xml).not.toContain('<g:sale_price>');
  });

  it('does not split when productOptions exist but manageVariants=false', () => {
    // Real-world TheFoilBuddy shape: Color/Size options for display only.
    const products: WixProduct[] = [
      {
        id: 'p-tfb',
        name: 'Foil Buddy',
        slug: 'foil-buddy',
        description: '',
        visible: true,
        manageVariants: false,
        priceData: { price: 39.95, discountedPrice: 39.95, currency: 'EUR' },
        stock: { inStock: true },
        productOptions: [
          { name: 'Color', choices: [{ value: 'Red' }, { value: 'Yellow' }] },
        ],
        variants: [
          { id: '00000000-0000-0000-0000-000000000000', choices: {}, variant: { sku: '' } },
        ],
      },
    ];
    const xml = buildMetaFeedXml(products, { siteUrl: SITE_URL });
    expect(countItems(xml)).toBe(1);
  });

  it('emits one <item> per real variant with shared item_group_id', () => {
    const products: WixProduct[] = [
      {
        id: 'p2',
        name: 'Cover',
        slug: 'cover',
        description: '',
        visible: true,
        manageVariants: true,
        priceData: { price: 99, discountedPrice: 99, currency: 'EUR' },
        stock: { inStock: true },
        variants: [
          {
            id: 'v-black-m',
            choices: { Color: 'Black', Size: 'M' },
            variant: {
              sku: 'COV-BL-M',
              priceData: { price: 99, discountedPrice: 99, currency: 'EUR' },
            },
            stock: { inStock: true },
          },
          {
            id: 'v-red-l',
            choices: { Color: 'Red', Size: 'L' },
            variant: {
              sku: 'COV-RD-L',
              priceData: { price: 99, discountedPrice: 99, currency: 'EUR' },
            },
            stock: { inStock: true },
          },
        ],
      },
    ];
    const xml = buildMetaFeedXml(products, { siteUrl: SITE_URL });
    expect(countItems(xml)).toBe(2);
    expect(extract(xml, 'g:item_group_id')).toEqual(['p2', 'p2']);
    expect(extract(xml, 'g:id')).toEqual(['COV-BL-M', 'COV-RD-L']);
    expect(extract(xml, 'g:title')).toEqual(['Cover - Black - M', 'Cover - Red - L']);
    expect(xml).toContain('<g:color>Black</g:color>');
    expect(xml).toContain('<g:size>L</g:size>');
    expect(xml).toContain('?Color=Black&amp;Size=M');
  });

  it('escapes & in product names', () => {
    const products: WixProduct[] = [
      {
        id: 'p3',
        name: 'Tom & Jerry Tool',
        slug: 'tom-jerry',
        description: 'A & B',
        visible: true,
        manageVariants: false,
        priceData: { price: 10, discountedPrice: 10, currency: 'EUR' },
        stock: { inStock: true },
      },
    ];
    const xml = buildMetaFeedXml(products, { siteUrl: SITE_URL });
    expect(xml).toContain('<g:title>Tom &amp; Jerry Tool</g:title>');
    expect(xml).toContain('<g:description>A &amp; B</g:description>');
    expect(xml).not.toMatch(/<g:title>Tom & Jerry/);
  });

  it('marks out-of-stock products correctly', () => {
    const products: WixProduct[] = [
      {
        id: 'p4',
        name: 'Sold Out',
        slug: 'sold-out',
        description: '',
        visible: true,
        manageVariants: false,
        priceData: { price: 49, discountedPrice: 49, currency: 'EUR' },
        stock: { inStock: false, inventoryStatus: 'OUT_OF_STOCK' },
      },
    ];
    const xml = buildMetaFeedXml(products, { siteUrl: SITE_URL });
    expect(xml).toContain('<g:availability>out of stock</g:availability>');
  });

  it('uses list price as g:price and discounted as g:sale_price', () => {
    const products: WixProduct[] = [
      {
        id: 'p5',
        name: 'On Sale',
        slug: 'on-sale',
        description: '',
        visible: true,
        manageVariants: false,
        priceData: { price: 199, discountedPrice: 149, currency: 'EUR' },
        stock: { inStock: true },
      },
    ];
    const xml = buildMetaFeedXml(products, { siteUrl: SITE_URL });
    expect(xml).toContain('<g:price>199.00 EUR</g:price>');
    expect(xml).toContain('<g:sale_price>149.00 EUR</g:sale_price>');
  });
});
