'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  getWixClient,
  getWixClientWithSession,
  WIX_STORES_APP_ID,
} from '@/lib/wix-server';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n';

type OptionSelection = Record<string, string>;

function cartPath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/cart' : `/${locale}/cart`;
}

export async function addToCart(
  productId: string,
  quantity: number = 1,
  selectedOptions?: OptionSelection,
  locale: string = DEFAULT_LOCALE,
) {
  const loc = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const client = await getWixClientWithSession(loc);

  // If the caller passed explicit options (from variant selector) use those.
  // Otherwise, resolve defaults by looking up the product — Wix silently
  // no-ops adds when a product has productOptions and none are passed.
  let options: OptionSelection = { ...(selectedOptions ?? {}) };
  if (Object.keys(options).length === 0) {
    const found = await client.products
      .queryProducts()
      .eq('_id', productId)
      .limit(1)
      .find();
    const product = found.items?.[0];
    for (const opt of product?.productOptions ?? []) {
      const name = opt.name;
      const firstChoice = opt.choices?.[0]?.value;
      if (name && firstChoice) options[name] = firstChoice;
    }
  }

  await client.currentCart.addToCurrentCart({
    lineItems: [
      {
        catalogReference: {
          appId: WIX_STORES_APP_ID,
          catalogItemId: productId,
          options: Object.keys(options).length > 0 ? { options } : undefined,
        },
        quantity,
      },
    ],
  });

  revalidatePath(cartPath(loc));
  revalidatePath(`/${loc}/shop`, 'layout');
  redirect(cartPath(loc));
}

export async function removeItem(lineItemId: string) {
  const { client } = await getWixClient();
  await client.currentCart.removeLineItemsFromCurrentCart([lineItemId]);
  revalidatePath('/cart');
  revalidatePath('/fr/cart');
}

export async function updateQty(lineItemId: string, quantity: number) {
  const { client } = await getWixClient();
  await client.currentCart.updateCurrentCartLineItemQuantity([
    { _id: lineItemId, quantity },
  ]);
  revalidatePath('/cart');
  revalidatePath('/fr/cart');
}
