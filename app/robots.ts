import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/cart', '/en/cart', '/fr/cart', '/en/review/', '/fr/review/'],
    },
    sitemap: 'https://www.thefoilbuddy.com/sitemap.xml',
  };
}
