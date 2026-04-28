'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import ProductGallery from './ProductGallery';
import ProductBuyBox, { type ProductOption } from './ProductBuyBox';
import type { Locale } from '@/lib/i18n';

type Media = { url: string; alt?: string; type?: 'image' | 'video'; poster?: string };

type Ctx = {
  selected: Record<string, string>;
  setSelected: (next: Record<string, string>) => void;
  activeImages: Media[];
};

const VariantCtx = createContext<Ctx | null>(null);

function useVariant() {
  const ctx = useContext(VariantCtx);
  if (!ctx) throw new Error('useVariant must be used inside VariantProvider');
  return ctx;
}

export function VariantProvider({
  options,
  productImages,
  choiceImages,
  children,
}: {
  options: ProductOption[];
  productImages: Media[];
  /** Per-choice image sets, keyed by choice value (e.g. "Jaune-Orange"). */
  choiceImages: Record<string, Media[]>;
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const opt of options) {
      if (opt.choices[0]?.value) init[opt.name] = opt.choices[0].value;
    }
    return init;
  });

  const activeImages = useMemo<Media[]>(() => {
    for (const value of Object.values(selected)) {
      const imgs = choiceImages[value];
      if (imgs && imgs.length > 0) return imgs;
    }
    return productImages;
  }, [selected, choiceImages, productImages]);

  const value = useMemo<Ctx>(
    () => ({ selected, setSelected, activeImages }),
    [selected, activeImages],
  );

  return <VariantCtx.Provider value={value}>{children}</VariantCtx.Provider>;
}

export function GalleryConnected({ productName }: { productName: string }) {
  const { activeImages } = useVariant();
  return <ProductGallery images={activeImages} productName={productName} />;
}

export function BuyBoxConnected({
  productId,
  options,
  locale,
  labels,
}: {
  productId: string;
  options: ProductOption[];
  locale: Locale;
  labels: {
    color: string;
    size: string;
    quantity: string;
    addToCart: string;
    adding: string;
  };
}) {
  const { selected, setSelected } = useVariant();
  return (
    <ProductBuyBox
      productId={productId}
      options={options}
      locale={locale}
      labels={labels}
      selected={selected}
      onSelectedChange={setSelected}
    />
  );
}
