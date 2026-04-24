import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED = ['en', 'fr'] as const;
const DEFAULT_LOCALE: (typeof SUPPORTED)[number] = 'en';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const firstSeg = pathname.split('/')[1];
  if (SUPPORTED.includes(firstSeg as (typeof SUPPORTED)[number])) {
    return NextResponse.next();
  }

  // Rewrite every unprefixed path to /{DEFAULT_LOCALE}/...
  // Canonical URLs: /shop, /cart  → served by /en/shop, /en/cart internally.
  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
