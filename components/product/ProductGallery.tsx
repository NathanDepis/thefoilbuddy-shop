'use client';

import { useEffect, useRef, useState } from 'react';

type Media = {
  url: string;
  alt?: string;
  type?: 'image' | 'video';
  poster?: string;
};

export default function ProductGallery({
  images,
  productName,
}: {
  images: Media[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
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
        {current.type === 'video' ? (
          <>
            <video
              key={current.url}
              ref={videoRef}
              src={current.url}
              poster={current.poster}
              autoPlay
              loop
              muted={muted}
              playsInline
              className="w-full h-full object-cover animate-[fadeIn_.25s_ease-out]"
            />
            <button
              type="button"
              onClick={() => {
                const next = !muted;
                setMuted(next);
                if (videoRef.current) {
                  videoRef.current.muted = next;
                  if (!next) videoRef.current.play().catch(() => {});
                }
              }}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-black/50 backdrop-blur border border-white/20 text-white hover:bg-black/70 transition flex items-center justify-center"
              aria-label={muted ? 'Activer le son' : 'Couper le son'}
            >
              {muted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
          </>
        ) : (
          <img
            key={current.url}
            src={current.url}
            alt={current.alt ?? productName}
            className="w-full h-full object-cover animate-[fadeIn_.25s_ease-out]"
          />
        )}
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
              {img.type === 'video' ? (
                <>
                  {img.poster ? (
                    <img src={img.poster} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <video src={img.url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden>
                      <polygon points="6 4 20 12 6 20 6 4" />
                    </svg>
                  </div>
                </>
              ) : (
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
