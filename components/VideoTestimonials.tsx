import { t, type Locale } from '@/lib/i18n';
import { VIDEO_TESTIMONIALS, type VideoTestimonial } from '@/lib/video-testimonials';

function Embed({ v }: { v: VideoTestimonial }) {
  if (v.source === 'youtube') {
    return (
      <iframe
        className="w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${v.id}?rel=0&modestbranding=1`}
        title={v.caption ?? 'Video testimonial'}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  if (v.source === 'vimeo') {
    return (
      <iframe
        className="w-full h-full"
        src={`https://player.vimeo.com/video/${v.id}?title=0&byline=0&portrait=0`}
        title={v.caption ?? 'Video testimonial'}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <video
      className="w-full h-full object-cover"
      src={v.url}
      poster={v.poster}
      controls
      preload="metadata"
      playsInline
    />
  );
}

export default function VideoTestimonials({ locale }: { locale: Locale }) {
  if (VIDEO_TESTIMONIALS.length === 0) return null;
  const d = t(locale).testimonials;

  return (
    <section className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
          {d.title}
        </h2>
        <p className="text-white/60">{d.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {VIDEO_TESTIMONIALS.map((v, i) => (
          <figure
            key={i}
            className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur hover:border-[#4DB8C7]/50 transition"
          >
            <div className="relative aspect-[3/4] bg-black">
              <Embed v={v} />
            </div>
            {v.caption && (
              <figcaption className="px-3 py-2 text-xs text-white/75 border-t border-white/10">
                {v.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
