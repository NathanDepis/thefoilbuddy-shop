import { cookies } from 'next/headers';
import { createClient, OAuthStrategy, type Tokens } from '@wix/sdk';
import { products } from '@wix/stores';
import { currentCart } from '@wix/ecom';
import { redirects } from '@wix/redirects';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n';

const CLIENT_ID = process.env.NEXT_PUBLIC_WIX_CLIENT_ID;
if (!CLIENT_ID) throw new Error('NEXT_PUBLIC_WIX_CLIENT_ID is not set');

export const WIX_COOKIE = 'wixSession';
// Wix Stores Catalog app ID — used as catalogReference.appId in cart line items
export const WIX_STORES_APP_ID = '215238eb-22a5-4c36-9e7b-e7c08025e04e';

function parseTokens(raw: string | undefined): Tokens | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as Tokens;
  } catch {
    return undefined;
  }
}

function buildClient(tokens?: Tokens, locale: Locale = DEFAULT_LOCALE) {
  return createClient({
    modules: { products, currentCart, redirects },
    auth: OAuthStrategy({ clientId: CLIENT_ID!, tokens }),
    // Wix Multilingual honors Accept-Language for translated catalog content.
    headers: { 'Accept-Language': locale },
  });
}

export async function getWixClient(locale: Locale = DEFAULT_LOCALE) {
  const store = await cookies();
  const tokens = parseTokens(store.get(WIX_COOKIE)?.value);
  return { client: buildClient(tokens, locale), hasTokens: Boolean(tokens) };
}

/** For use in server actions: ensures a persistent visitor session exists. */
export async function getWixClientWithSession(
  locale: Locale = DEFAULT_LOCALE,
) {
  const store = await cookies();
  let tokens = parseTokens(store.get(WIX_COOKIE)?.value);

  if (!tokens) {
    // Generate visitor tokens BEFORE constructing the client we'll use, so
    // every subsequent call on this client is tied to the tokens we persist.
    const bootstrap = OAuthStrategy({ clientId: CLIENT_ID! });
    tokens = await bootstrap.generateVisitorTokens();
    store.set(WIX_COOKIE, JSON.stringify(tokens), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return buildClient(tokens, locale);
}
