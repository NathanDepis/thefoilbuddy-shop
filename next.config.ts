import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Anciennes pages produit Wix encore référencées (Google Merchant, liens externes)
  async redirects() {
    return [
      { source: '/product-page/thefoilbuddy-torx-t30-t40', destination: '/shop/tool-titanium-torx-t30-t45-green-red', permanent: true },
      { source: '/product-page/:slug', destination: '/shop/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
