'use client';

import { useMemo, useState, useTransition } from 'react';
import { addToCart } from '@/app/[locale]/shop/actions';
import type { Locale } from '@/lib/i18n';

type Choice = {
  value: string;
  description?: string;
  mediaUrl?: string;
};

export type ProductOption = {
  name: string;
  choices: Choice[];
};

type Labels = {
  color: string;
  size: string;
  quantity: string;
  addToCart: string;
  adding: string;
};

// Map common Wix color choice labels → hex swatches. Fallback to text pill.
const SWATCH_MAP: Record<string, string | string[]> = {
  'jaune-orange': ['#FFC937', '#FF7A3D'],
  'yellow-orange': ['#FFC937', '#FF7A3D'],
  'rouge-vert': ['#D83B3B', '#5FCC5C'],
  'red-green': ['#D83B3B', '#5FCC5C'],
  'orange': '#FF7A3D',
  'yellow': '#FFC937',
  'jaune': '#FFC937',
  'red': '#D83B3B',
  'rouge': '#D83B3B',
  'green': '#5FCC5C',
  'vert': '#5FCC5C',
  'blue': '#3DA4D8',
  'bleu': '#3DA4D8',
  'black': '#111',
  'noir': '#111',
  'white': '#f4f4f4',
  'blanc': '#f4f4f4',
};

function swatchFor(value: string): string | string[] | null {
  return SWATCH_MAP[value.toLowerCase()] ?? null;
}

function looksLikeColorOption(name: string): boolean {
  const n = name.toLowerCase();
  return n.includes('color') || n.includes('couleur') || n.includes('colour');
}

function looksLikeSizeOption(name: string): boolean {
  const n = name.toLowerCase();
  return n.includes('size') || n.includes('taille');
}

function labelFor(name: string, labels: Labels): string {
  if (looksLikeColorOption(name)) return labels.color;
  if (looksLikeSizeOption(name)) return labels.size;
  return name;
}

export default function ProductBuyBox({
  productId,
  options,
  locale,
  labels,
  selected,
  onSelectedChange,
}: {
  productId: string;
  options: ProductOption[];
  locale: Locale;
  labels: Labels;
  selected: Record<string, string>;
  onSelectedChange: (next: Record<string, string>) => void;
}) {
  const [qty, setQty] = useState(1);
  const [isPending, startTransition] = useTransition();

  const activeChoices = useMemo(
    () =>
      options.map((opt) => ({
        ...opt,
        active: selected[opt.name],
      })),
    [options, selected],
  );

  function submit() {
    startTransition(async () => {
      await addToCart(productId, qty, selected, locale);
    });
  }

  return (
    <div className="space-y-6">
      {activeChoices.map((opt) => (
        <div key={opt.name}>
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-xs uppercase tracking-widest text-white/60">
              {labelFor(opt.name, labels)}
            </span>
            <span className="text-sm text-white/90">{opt.active}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {opt.choices.map((choice) => {
              const isActive = selected[opt.name] === choice.value;
              const swatch = swatchFor(choice.value);
              if (swatch) {
                const stripes = Array.isArray(swatch)
                  ? `linear-gradient(135deg, ${swatch[0]} 0% 50%, ${swatch[1]} 50% 100%)`
                  : swatch;
                return (
                  <button
                    key={choice.value}
                    type="button"
                    onClick={() =>
                      onSelectedChange({ ...selected, [opt.name]: choice.value })
                    }
                    className={`relative w-11 h-11 rounded-full border-2 transition ${
                      isActive
                        ? 'border-[#4DB8C7] ring-2 ring-[#4DB8C7]/30 scale-105'
                        : 'border-white/20 hover:border-white/50'
                    }`}
                    style={{ background: stripes }}
                    aria-label={choice.value}
                    title={choice.value}
                  />
                );
              }
              return (
                <button
                  key={choice.value}
                  type="button"
                  onClick={() =>
                    onSelectedChange({ ...selected, [opt.name]: choice.value })
                  }
                  className={`px-4 py-2 rounded-full border text-sm transition ${
                    isActive
                      ? 'border-[#4DB8C7] bg-[#4DB8C7]/15 text-white'
                      : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {choice.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4 pt-2">
        <div>
          <div className="text-xs uppercase tracking-widest text-white/60 mb-3">
            {labels.quantity}
          </div>
          <div className="flex items-center rounded-full border border-white/20 bg-white/5">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-11 h-11 text-lg hover:bg-white/10 rounded-l-full disabled:opacity-40"
              disabled={qty <= 1}
              aria-label="Decrease"
            >
              −
            </button>
            <span className="w-10 text-center font-medium">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="w-11 h-11 text-lg hover:bg-white/10 rounded-r-full"
              aria-label="Increase"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={isPending}
        className="w-full rounded-full bg-[#9ED63A] text-[#0B3C5D] font-bold px-6 py-4 hover:shadow-[0_0_24px_rgba(158,214,58,0.4)] hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {isPending ? labels.adding : labels.addToCart}
      </button>
    </div>
  );
}
