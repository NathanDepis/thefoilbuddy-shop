'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n';
import { REVIEW_STRINGS } from '@/lib/review-i18n';
import { submitReview } from './actions';

export function ReviewForm({
  locale,
  orderId,
  token,
  productSlug,
  productName,
  defaultName,
}: {
  locale: Locale;
  orderId: string;
  token: string;
  productSlug: string;
  productName: string;
  defaultName: string;
}) {
  const strings = REVIEW_STRINGS[locale];
  const router = useRouter();
  const [rating, setRating] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [hover, setHover] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (rating < 1) {
      setError(strings.errorRating);
      return;
    }
    const validRating = rating as 1 | 2 | 3 | 4 | 5;
    startTransition(async () => {
      const result = await submitReview({
        locale,
        orderId,
        token,
        productSlug,
        productName,
        firstName: defaultName,
        rating: validRating,
        title: title.trim() || undefined,
        body: body.trim() || undefined,
        location: location.trim() || undefined,
      });
      if (result.ok) {
        router.push(`/${locale}/review/${orderId}/thanks`);
      } else {
        setError(strings.errorGeneric);
      }
    });
  };

  const displayed = hover || rating;

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      <div>
        <label className="block text-sm font-medium text-white/80">{strings.ratingLabel}</label>
        <div className="mt-2 flex gap-1" role="radiogroup" aria-label={strings.ratingLabel}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n}/5`}
              onClick={() => setRating(n as 1 | 2 | 3 | 4 | 5)}
              onMouseEnter={() => setHover(n as 1 | 2 | 3 | 4 | 5)}
              onMouseLeave={() => setHover(0)}
              className="cursor-pointer p-1 transition-transform hover:scale-110"
            >
              <Star filled={n <= displayed} size={36} />
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-white/50">{strings.ratingHelp}</p>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-white/80">{strings.titleLabel}</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={strings.titlePlaceholder}
          maxLength={80}
          className="mt-2 block w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-white/80">{strings.bodyLabel}</label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={strings.bodyPlaceholder}
          maxLength={2000}
          rows={5}
          className="mt-2 block w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
        />
        <p className="mt-1 text-xs text-white/50">{strings.bodyHelp}</p>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-white/80">{strings.locationLabel}</label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={strings.locationPlaceholder}
          maxLength={60}
          className="mt-2 block w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition disabled:opacity-50"
      >
        {pending ? strings.submitting : strings.submit}
      </button>
    </form>
  );
}

function Star({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? '#FFC937' : 'none'}
      stroke={filled ? '#FFC937' : 'rgba(255,255,255,0.3)'}
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}
