import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWixClient } from '@/lib/wix-server';
import { isLocale, t, localeHref, translateProductName, isNewProduct } from '@/lib/i18n';
import ShopHeader from '@/components/ShopHeader';
import Hero from '@/components/Hero';
import FeaturesGrid from '@/components/FeaturesGrid';
import Comparison from '@/components/Comparison';
import VideoTestimonials from '@/components/VideoTestimonials';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);

  const { client } = await getWixClient(locale);
  const res = await client.products.queryProducts().find();
  const items = res.items ?? [];

  return (
    <main className="min-h-screen bg-[#091E2C] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <ShopHeader locale={locale} />

        <Hero locale={locale} />

        <FeaturesGrid locale={locale} />

        <Comparison locale={locale} />

        <section id="products" className="mb-16 scroll-mt-24">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                {d.shop.title}
              </h2>
              <p className="text-white/60 mt-1">{d.shop.subtitle}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#9ED63A]/15 text-[#9ED63A] text-xs font-semibold uppercase tracking-wider px-3 py-1.5 border border-[#9ED63A]/30">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <path d="M7 7h.01" />
              </svg>
              {d.shop.bundlePromo}
            </span>
          </div>

          {items.length === 0 ? (
            <p className="opacity-70">—</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p) => (
                <li key={p._id}>
                  <Link
                    href={localeHref(locale, `/shop/${p.slug}`)}
                    className="group flex flex-col h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden hover:border-[#4DB8C7]/60 hover:bg-white/10 transition"
                  >
                    {p.media?.mainMedia?.image?.url && (
                      <div className="relative overflow-hidden aspect-square bg-white/5">
                        <img
                          src={p.media.mainMedia.image.url}
                          alt={p.name ?? ''}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        {isNewProduct(p.slug) && (
                          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#9ED63A] text-[#0B3C5D] text-[11px] font-bold uppercase tracking-wider px-3 py-1 shadow-[0_0_16px_rgba(158,214,58,0.5)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0B3C5D] animate-pulse" />
                            {d.shop.newBadge}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold text-white group-hover:text-[#4DB8C7] transition">
                        {translateProductName(locale, p.slug, p.name) ?? p.name}
                      </h3>
                      <p className="text-2xl font-bold text-white/95 mt-2">
                        {p.priceData?.formatted?.price ?? p.price?.formatted?.price}
                      </p>
                      <div className="mt-auto pt-4 flex items-center justify-between text-xs text-white/50">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#9ED63A]" />
                          {d.product.stock}
                        </span>
                        <span className="text-[#4DB8C7] font-medium group-hover:translate-x-0.5 transition">
                          {d.shop.viewDetails} →
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <VideoTestimonials locale={locale} />

        <Footer locale={locale} />
      </div>
    </main>
  );
}
