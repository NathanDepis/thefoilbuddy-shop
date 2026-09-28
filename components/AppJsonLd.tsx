import { APP_STORE_URL, INSTAGRAM_URL, WEB_APP_URL } from '@/lib/app-store';
import { SITE_URL } from '@/lib/seo';

/** schema.org MobileApplication + Organization for the TheFoilBuddy app. */
export default function AppJsonLd({ description, url, inLanguage }: { description: string; url: string; inLanguage: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'The Foil Buddy',
        alternateName: 'TheFoilBuddy',
        url: SITE_URL,
        logo: `${SITE_URL}/logo-hd.png`,
        sameAs: [INSTAGRAM_URL, APP_STORE_URL],
      },
      {
        '@type': 'MobileApplication',
        '@id': `${SITE_URL}/#app`,
        name: 'TheFoilBuddy',
        alternateName: 'The Foil Buddy',
        description,
        url,
        inLanguage,
        operatingSystem: 'iOS',
        applicationCategory: 'SportsApplication',
        image: `${SITE_URL}/app-shots/icon-512.png`,
        screenshot: [
          `${SITE_URL}/app-shots/01-carte.jpg`,
          `${SITE_URL}/app-shots/03-modeles.jpg`,
          `${SITE_URL}/app-shots/04-session.jpg`,
        ],
        installUrl: APP_STORE_URL,
        downloadUrl: APP_STORE_URL,
        sameAs: [APP_STORE_URL, WEB_APP_URL],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
