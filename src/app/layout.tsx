import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
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
  metadataBase: new URL("https://hypersnap.org"),
  title: {
    default: "Hypersnap",
    template: "%s | Hypersnap",
  },
  description:
    "Hypersnap is a decentralized fork of Snapchain for Farcaster data, public APIs, node operators, and open protocol contributors.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hypersnap",
    description:
      "A decentralized Farcaster/Snapchain fork with live network access, node operator docs, and open source contribution paths.",
    url: "https://hypersnap.org",
    siteName: "Hypersnap",
    images: ["/opengraph-image"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hypersnap",
    description:
      "A decentralized Farcaster/Snapchain fork with live network access, node operator docs, and open source contribution paths.",
    images: ["/opengraph-image"],
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
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
