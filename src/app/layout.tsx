import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteShell } from "@/components/site-shell";
import { creator } from "@/lib/creator";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "Hypersnap",
  authors: [{ name: creator.name, url: creator.website }],
  metadataBase: new URL("https://hypersnap.org"),
  title: {
    default: "Hypersnap",
    template: "%s | Hypersnap",
  },
  description:
    "Hypersnap is a decentralized social network portal made by Felirami, a solo developer contributing to the new Farcaster.",
  creator: creator.name,
  publisher: creator.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hypersnap",
    description:
      "Hypersnap.org is made by Felirami: a portal for the decentralized Farcaster fork, live network access, node operators, and contributors.",
    url: "https://hypersnap.org",
    siteName: "Hypersnap",
    images: ["/opengraph-image"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hypersnap",
    description:
      "Hypersnap.org is made by Felirami, a solo developer contributing to the new Farcaster.",
    images: ["/opengraph-image"],
  },
};

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Hypersnap",
  url: "https://hypersnap.org",
  author: {
    "@type": "Person",
    name: creator.name,
    url: creator.website,
    sameAs: creator.links.map((link) => link.href),
  },
  creator: {
    "@type": "Person",
    name: creator.name,
    url: creator.website,
    sameAs: creator.links.map((link) => link.href),
  },
  description:
    "Hypersnap.org is made by Felirami, a solo developer contributing to the new Farcaster.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  initialScale: 1,
  themeColor: "#030712",
  width: "device-width",
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
      <body className="min-h-full flex flex-col bg-[#030712]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        <SiteShell>{children}</SiteShell>
        <Analytics />
      </body>
    </html>
  );
}
