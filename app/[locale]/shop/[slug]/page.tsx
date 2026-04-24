import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWixClient } from '@/lib/wix-server';
import { isLocale, t, localeHref, translateProductName, translateProductDescription, isNewProduct } from '@/lib/i18n';
import ShopHeader from '@/components/ShopHeader';
import Footer from '@/components/Footer';
import VideoTestimonials from '@/components/VideoTestimonials';
import { type ProductOption } from '@/components/product/ProductBuyBox';
import {
  VariantProvider,
  GalleryConnected,
  BuyBoxConnected,
} from '@/components/product/ProductDetails';

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);

  const { client } = await getWixClient(locale);
  const res = await client.products.queryProducts().find();
  // Next 16 delivers the raw URL-encoded param (e.g. `cl%C3%A9`) while Wix
  // returns the decoded slug (`clé`). Decode + normalize before comparing.
  // Also matches against raw slugs so old links keep working.
  let target: string;
  try {
    target = decodeURIComponent(slug).normalize('NFC');
  } catch {
    target = slug.normalize('NFC');
  }
  const product = res.items?.find((p) => {
    const s = (p.slug ?? '').normalize('NFC');
    return s === target || s === slug;
  });
  if (!product || !product._id) notFound();

  const displayName =
    translateProductName(locale, product.slug, product.name) ?? product.name ?? '';
  const price =
    product.priceData?.formatted?.price ?? product.price?.formatted?.price;

  const galleryImages =
    product.media?.items
      ?.map((m) => ({
        url: m.image?.url,
        alt: m.image?.altText ?? product.name ?? '',
      }))
      .filter((m): m is { url: string; alt: string } => Boolean(m.url)) ?? [];

  // Fallback to main media if items is empty
  if (galleryImages.length === 0 && product.media?.mainMedia?.image?.url) {
    galleryImages.push({
      url: product.media.mainMedia.image.url,
      alt: product.media.mainMedia.image.altText ?? product.name ?? '',
    });
  }

  const options: ProductOption[] = (product.productOptions ?? [])
    .map((opt) => ({
      name: opt.name ?? '',
      choices:
        opt.choices
          ?.map((c) => ({ value: c.value ?? '', description: c.description }))
          .filter((c) => Boolean(c.value)) ?? [],
    }))
    .filter((opt) => opt.name && opt.choices.length > 0);

  // Build per-choice image sets so picking a color swaps the gallery.
  const choiceImages: Record<string, { url: string; alt: string }[]> = {};
  for (const opt of product.productOptions ?? []) {
    for (const choice of opt.choices ?? []) {
      const value = choice.value;
      if (!value) continue;
      const imgs: { url: string; alt: string }[] = [];
      for (const item of choice.media?.items ?? []) {
        const url = item.image?.url;
        if (url) imgs.push({ url, alt: item.image?.altText ?? value });
      }
      if (imgs.length === 0 && choice.media?.mainMedia?.image?.url) {
        imgs.push({
          url: choice.media.mainMedia.image.url,
          alt: choice.media.mainMedia.image.altText ?? value,
        });
      }
      if (imgs.length > 0) choiceImages[value] = imgs;
    }
  }

  return (
    <main className="min-h-screen bg-[#091E2C] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <ShopHeader locale={locale} />

        <Link
          href={localeHref(locale, '/shop')}
          className="inline-block mb-6 text-sm text-white/60 hover:text-white transition"
        >
          {d.product.back}
        </Link>

        <VariantProvider
          options={options}
          productImages={galleryImages}
          choiceImages={choiceImages}
        >
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <GalleryConnected productName={displayName} />

          <div>
            {isNewProduct(product.slug) && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9ED63A] text-[#0B3C5D] text-[11px] font-bold uppercase tracking-wider px-3 py-1 shadow-[0_0_16px_rgba(158,214,58,0.5)] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B3C5D] animate-pulse" />
                {d.shop.newBadge}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              {displayName}
            </h1>
            <div className="flex items-center gap-3 mt-3 mb-6">
              <p className="text-3xl font-bold text-[#4DB8C7]">{price}</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9ED63A]/15 text-[#9ED63A] text-xs font-semibold px-2.5 py-1 border border-[#9ED63A]/30">
                {d.shop.bundlePromo}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6 text-sm">
              <span className="inline-flex items-center gap-1.5 text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9ED63A]" />
                {d.product.stock}
              </span>
              <span className="inline-flex items-center gap-1.5 text-white/60">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                {d.product.freeShip}
              </span>
            </div>

            <BuyBoxConnected
              productId={product._id}
              options={options}
              locale={locale}
              labels={{
                color: d.product.color,
                size: d.product.size,
                quantity: d.product.quantity,
                addToCart: d.product.addToCart,
                adding: d.product.adding,
              }}
            />

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
              <div className="flex items-start gap-3">
                <div className="text-[#4DB8C7] mt-0.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white mb-1">
                    {d.product.shipping.title}
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {d.product.shipping.body}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </VariantProvider>

        {product.description && (() => {
          const html =
            translateProductDescription(locale, product.slug, product.description) ??
            product.description;
          return (
            <section className="mb-16 max-w-4xl">
              <h2 className="text-xs uppercase tracking-widest text-[#4DB8C7] mb-3">
                {d.product.features}
              </h2>
              <div
                className="prose prose-invert prose-sm max-w-none text-white/80 leading-relaxed [&_li]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:my-3"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </section>
          );
        })()}

        <VideoTestimonials locale={locale} />

        <Footer locale={locale} />
      </div>
    </main>
  );
}
