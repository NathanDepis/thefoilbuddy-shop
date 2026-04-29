import { NextResponse } from 'next/server';
import { fetchAllWixProducts, WixApiError } from '@/lib/wix/client';
import { buildMetaFeedXml } from '@/lib/meta-feed/build-xml';

export const revalidate = 3600;

const FALLBACK_SITE_URL = 'https://thefoilbuddy.com';

export async function GET() {
  const siteUrl = process.env.SITE_URL || FALLBACK_SITE_URL;

  try {
    const products = await fetchAllWixProducts();
    const xml = buildMetaFeedXml(products, { siteUrl });
    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (err) {
    const isWix = err instanceof WixApiError;
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[meta-feed] failed to build feed:', err);
    return NextResponse.json(
      {
        error: 'Failed to build product feed',
        source: isWix ? 'wix' : 'internal',
        message,
      },
      { status: 503 },
    );
  }
}
