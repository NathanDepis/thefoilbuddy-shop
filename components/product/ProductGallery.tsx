'use client';

import { useEffect, useState } from 'react';

type Media = {
  url: string;
  alt?: string;
};

export default function ProductGallery({
  images,
  productName,
}: {
  images: Media[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  // When the image set changes (e.g. user picks a different color variant),
  // jump back to the first image so the hero matches the selection.
  useEffect(() => {
    setActive(0);
  }, [images]);
  if (images.length === 0) return null;
  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden aspect-square">
        <img
          key={current.url}
          src={current.url}
          alt={current.alt ?? productName}
          className="w-full h-full object-cover animate-[fadeIn_.25s_ease-out]"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setActive((a) => (a - 1 + images.length) % images.length)
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/20 text-white hover:bg-black/60 transition flex items-center justify-center"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setActive((a) => (a + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/20 text-white hover:bg-black/60 transition flex items-center justify-center"
              aria-label="Next image"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square rounded-lg overflow-hidden border transition ${
                i === active
                  ? 'border-[#4DB8C7] ring-2 ring-[#4DB8C7]/30'
                  : 'border-white/10 hover:border-white/30'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
