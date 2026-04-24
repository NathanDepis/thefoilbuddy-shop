'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getWixClient } from '@/lib/wix-server';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n';

async function getSiteOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto =
    h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

function localePath(locale: Locale, path: string): string {
  return locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;
}

export async function checkout(rawLocale: string = DEFAULT_LOCALE) {
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const { client, hasTokens } = await getWixClient();
  if (!hasTokens) redirect(localePath(locale, '/shop'));

  const { checkoutId } = await client.currentCart.createCheckoutFromCurrentCart({
    channelType: 'WEB',
  });
  if (!checkoutId) throw new Error('Checkout creation returned no checkoutId');

  const origin = await getSiteOrigin();
  const { redirectSession } = await client.redirects.createRedirectSession({
    ecomCheckout: { checkoutId },
    callbacks: {
      postFlowUrl: `${origin}${localePath(locale, '/cart/thanks')}`,
      thankYouPageUrl: `${origin}${localePath(locale, '/cart/thanks')}`,
      cartPageUrl: `${origin}${localePath(locale, '/cart')}`,
    },
  });
  if (!redirectSession?.fullUrl) {
    throw new Error('Redirect session missing fullUrl');
  }
  redirect(redirectSession.fullUrl);
}
