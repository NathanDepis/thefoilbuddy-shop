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
  it('emits a single <item> for a product with no variants', () => {
    const products: WixProduct[] = [
      {
        id: 'p1',
        name: 'Foil Cover Pro',
        slug: 'foil-cover-pro',
        description: '<p>Great cover.</p>',
        visible: true,
        currency: 'EUR',
        media: { main: { image: { url: 'https://static.wixstatic.com/media/p1-main.jpg' } } },
        actualPriceRange: { minValue: { amount: '199', currency: 'EUR' } },
        inventory: { availabilityStatus: 'IN_STOCK' },
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
  });

  it('emits one <item> per variant with a shared item_group_id', () => {
    const products: WixProduct[] = [
      {
        id: 'p2',
        name: 'Cover',
        slug: 'cover',
        description: '',
        visible: true,
        currency: 'EUR',
        actualPriceRange: { minValue: { amount: '99', currency: 'EUR' } },
        inventory: { availabilityStatus: 'IN_STOCK' },
        variantsInfo: {
          variants: [
            {
              id: 'v-black-m',
              sku: 'COV-BL-M',
              price: { actualPrice: { amount: '99', currency: 'EUR' } },
              choices: [
                { optionChoiceNames: { optionName: 'Color', choiceName: 'Black' } },
                { optionChoiceNames: { optionName: 'Size', choiceName: 'M' } },
              ],
              inventoryStatus: { inStock: true },
            },
            {
              id: 'v-red-l',
              sku: 'COV-RD-L',
              price: { actualPrice: { amount: '99', currency: 'EUR' } },
              choices: [
                { optionChoiceNames: { optionName: 'Color', choiceName: 'Red' } },
                { optionChoiceNames: { optionName: 'Size', choiceName: 'L' } },
              ],
              inventoryStatus: { inStock: true },
            },
          ],
        },
      },
    ];
    const xml = buildMetaFeedXml(products, { siteUrl: SITE_URL });
    expect(countItems(xml)).toBe(2);
    const groupIds = extract(xml, 'g:item_group_id');
    expect(groupIds).toEqual(['p2', 'p2']);
    const ids = extract(xml, 'g:id');
    expect(ids).toEqual(['COV-BL-M', 'COV-RD-L']);
    const titles = extract(xml, 'g:title');
    expect(titles).toEqual(['Cover - Black - M', 'Cover - Red - L']);
    expect(xml).toContain('<g:color>Black</g:color>');
    expect(xml).toContain('<g:size>L</g:size>');
    // Variant link includes the variant query string (& escaped per XML rules).
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
        currency: 'EUR',
        actualPriceRange: { minValue: { amount: '10', currency: 'EUR' } },
        inventory: { availabilityStatus: 'IN_STOCK' },
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
        currency: 'EUR',
        actualPriceRange: { minValue: { amount: '49', currency: 'EUR' } },
        inventory: { availabilityStatus: 'OUT_OF_STOCK' },
      },
    ];
    const xml = buildMetaFeedXml(products, { siteUrl: SITE_URL });
    expect(xml).toContain('<g:availability>out of stock</g:availability>');
  });

  it('uses compareAtPrice as g:price and actualPrice as g:sale_price when discounted', () => {
    const products: WixProduct[] = [
      {
        id: 'p5',
        name: 'On Sale',
        slug: 'on-sale',
        description: '',
        visible: true,
        currency: 'EUR',
        actualPriceRange: { minValue: { amount: '149', currency: 'EUR' } },
        compareAtPriceRange: { minValue: { amount: '199', currency: 'EUR' } },
        inventory: { availabilityStatus: 'IN_STOCK' },
      },
    ];
    const xml = buildMetaFeedXml(products, { siteUrl: SITE_URL });
    expect(xml).toContain('<g:price>199.00 EUR</g:price>');
    expect(xml).toContain('<g:sale_price>149.00 EUR</g:sale_price>');
  });
});
