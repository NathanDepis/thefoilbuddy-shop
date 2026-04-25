import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://www.thefoilbuddy.com";
const TITLE = "The Foil Buddy — L'outil indispensable pour wingfoilers";
const DESCRIPTION =
  "Le seul outil que tu peux amener avec toi sur l'eau. Conçu par des wingfoilers, pour des wingfoilers.";

export const metadata: Metadata = {
  title: { default: TITLE, template: "%s | The Foil Buddy" },
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    languages: { fr: "/fr", en: "/en" },
  },
  openGraph: {
    type: "website",
    siteName: "The Foil Buddy",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/app-share.jpg", width: 1200, height: 630, alt: "The Foil Buddy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/app-share.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
