import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWixClient } from '@/lib/wix-server';
import { isLocale, t, localeHref, type Locale } from '@/lib/i18n';
import ShopHeader from '@/components/ShopHeader';
import Footer from '@/components/Footer';
import CheckoutForm from '@/components/CheckoutForm';
import { removeItem, updateQty } from '../shop/actions';
import { checkout } from './actions';

export const dynamic = 'force-dynamic';

async function fetchCart(locale: Locale) {
  const { client, hasTokens } = await getWixClient(locale);
  if (!hasTokens) return { cart: null, totals: null };
  try {
    const [cart, totals] = await Promise.all([
      client.currentCart.getCurrentCart(),
      client.currentCart.estimateCurrentCartTotals().catch(() => null),
    ]);
    return { cart, totals };
  } catch {
    return { cart: null, totals: null };
  }
}

function wixImageUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  if (raw.startsWith('http')) return raw;
  // wix:image://v1/<mediaId>/<filename>#...
  const match = raw.match(/^wix:image:\/\/v1\/([^/]+)\/([^#?]+)/);
  if (!match) return undefined;
  return `https://static.wixstatic.com/media/${match[1]}`;
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);

  const { cart, totals } = await fetchCart(locale);
  const items = cart?.lineItems ?? [];
  const subtotal =
    totals?.priceSummary?.subtotal?.formattedConvertedAmount ??
    totals?.priceSummary?.subtotal?.formattedAmount;

  return (
    <main className="min-h-screen bg-[#091E2C] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <ShopHeader locale={locale} />

        <h1 className="text-3xl sm:text-4xl font-bold mb-8">{d.cart.title}</h1>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-10 text-center max-w-xl mx-auto">
            <svg
              className="mx-auto text-white/40 mb-4"
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <p className="text-white/80 mb-5">{d.cart.empty}</p>
            <Link
              href={localeHref(locale, '/shop')}
              className="inline-block rounded-full bg-[#4DB8C7] text-[#091E2C] font-semibold px-6 py-3 hover:opacity-90 transition"
            >
              {d.cart.seeProducts}
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            <ul className="space-y-3">
              {items.map((li) => {
                const imgUrl = wixImageUrl(li.image);
                const name =
                  li.productName?.translated ?? li.productName?.original;
                const linePrice =
                  li.price?.formattedConvertedAmount ??
                  li.price?.formattedAmount;
                return (
                  <li
                    key={li._id}
                    className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 hover:border-white/20 transition"
                  >
                    {imgUrl && (
                      <img
                        src={imgUrl}
                        alt={name ?? ''}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0 basis-40">
                      <div className="font-semibold text-white">{name}</div>
                      <div className="text-sm text-white/60 mt-0.5">
                        {linePrice}
                      </div>
                    </div>

                    <form
                      action={async (formData: FormData) => {
                        'use server';
                        const id = String(formData.get('id'));
                        const q = Number(formData.get('q'));
                        await updateQty(id, q);
                      }}
                      className="flex items-center rounded-full border border-white/15 bg-white/5"
                    >
                      <input type="hidden" name="id" value={li._id ?? ''} />
                      <button
                        type="submit"
                        name="q"
                        value={Math.max(1, (li.quantity ?? 1) - 1)}
                        className="w-9 h-9 hover:bg-white/10 rounded-l-full disabled:opacity-40"
                        disabled={(li.quantity ?? 1) <= 1}
                        aria-label="−"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {li.quantity}
                      </span>
                      <button
                        type="submit"
                        name="q"
                        value={(li.quantity ?? 1) + 1}
                        className="w-9 h-9 hover:bg-white/10 rounded-r-full"
                        aria-label="+"
                      >
                        +
                      </button>
                    </form>

                    <form
                      action={async () => {
                        'use server';
                        if (li._id) await removeItem(li._id);
                      }}
                    >
                      <button
                        type="submit"
                        className="text-sm text-white/50 hover:text-red-400 px-2 transition"
                        aria-label={d.cart.remove}
                      >
                        ✕
                      </button>
                    </form>
                  </li>
                );
              })}
            </ul>

            <aside className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur p-6 h-fit lg:sticky lg:top-24">
              <div className="text-xs uppercase tracking-widest text-white/60 mb-2">
                {d.cart.subtotal}
              </div>
              <div className="text-3xl font-bold mb-1">{subtotal}</div>
              <div className="text-xs text-white/50 mb-5">
                {d.product.freeShip}
              </div>
              <CheckoutForm
                action={checkout.bind(null, locale)}
                label={d.cart.checkout}
                redirectingLabel={d.cart.redirecting}
              />
            </aside>
          </div>
        )}

        <Footer locale={locale} />
      </div>
    </main>
  );
}
