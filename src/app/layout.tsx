import type { Metadata, Viewport } from "next";
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
    "Hypersnap is a decentralized social network, built by a global community of contributors. No company, no VC. The evolution of Farcaster: every node run by someone different, anywhere in the world.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hypersnap",
    description:
      "A decentralized social network — actually decentralized. Built by contributors worldwide. No company, no VC.",
    url: "https://hypersnap.org",
    siteName: "Hypersnap",
    images: ["/opengraph-image"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hypersnap",
    description:
      "A decentralized social network — actually decentralized. Built by contributors worldwide. No company, no VC.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  initialScale: 1,
  themeColor: "#020617",
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
      <body className="min-h-full flex flex-col">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
