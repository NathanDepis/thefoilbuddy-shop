import { t, type Locale } from '@/lib/i18n';

const IconTitanium = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 2L3 7v10l9 5 9-5V7z" />
    <path d="M12 22V12M3 7l9 5 9-5" />
  </svg>
);
const IconFloat = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
    <path d="M2 20c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
    <circle cx="12" cy="8" r="4" />
  </svg>
);
const IconPocket = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 12h8M12 8v8" />
  </svg>
);
const IconTwo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="8" cy="12" r="5" />
    <circle cx="16" cy="12" r="5" />
  </svg>
);

export default function FeaturesGrid({ locale }: { locale: Locale }) {
  const d = t(locale).features;
  const items = [
    { icon: <IconTitanium />, title: d.titanium.title, body: d.titanium.body, accent: '#4DB8C7' },
    { icon: <IconFloat />, title: d.floating.title, body: d.floating.body, accent: '#9ED63A' },
    { icon: <IconPocket />, title: d.pocket.title, body: d.pocket.body, accent: '#4DB8C7' },
    { icon: <IconTwo />, title: d.twoInOne.title, body: d.twoInOne.body, accent: '#9ED63A' },
  ];
  return (
    <section id="how" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-8 text-center">
        {d.title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item) => (
          <div
            key={item.title}
            className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 hover:border-white/25 hover:bg-white/10 transition"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition group-hover:scale-110"
              style={{ background: `${item.accent}1F`, color: item.accent }}
            >
              {item.icon}
            </div>
            <h3 className="text-white font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-white/70 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
