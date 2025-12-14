import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "İsmail Doğan | Elektrik Mühendisliği Hizmetleri - İstanbul",
    template: "%s | İsmail Doğan Elektrik",
  },
  description:
    "İstanbul'da profesyonel elektrik mühendisliği hizmetleri. Elektrik tesisatı, proje çizimi, periyodik bakım, arıza tespit ve teknik danışmanlık. 7/24 acil servis.",
  keywords: [
    "elektrik mühendisi",
    "elektrik tesisatı",
    "elektrik projesi",
    "İstanbul elektrikçi",
    "elektrik arıza",
    "periyodik bakım",
    "topraklama ölçümü",
    "elektrik danışmanlık",
  ],
  authors: [{ name: "İsmail Doğan" }],
  creator: "İsmail Doğan",
  publisher: "İsmail Doğan Elektrik Mühendisliği",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://ismaildoganelektrik.com",
    siteName: "İsmail Doğan Elektrik Mühendisliği",
    title: "İsmail Doğan | Profesyonel Elektrik Mühendisliği Hizmetleri",
    description:
      "İstanbul genelinde güvenilir elektrik mühendisliği çözümleri. Proje çizimi, tesisat kurulumu ve 7/24 acil servis.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "İsmail Doğan Elektrik Mühendisliği",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "İsmail Doğan | Elektrik Mühendisliği Hizmetleri",
    description:
      "İstanbul'da profesyonel elektrik mühendisliği hizmetleri. 7/24 acil servis.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/favicon.svg" }],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a1929" },
    { media: "(prefers-color-scheme: light)", color: "#0a1929" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-cyber-dark-950 text-gray-100 antialiased">
        {/* Scan Line Effect */}
        <div className="scan-line" aria-hidden="true" />

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="relative">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Noise Overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-[100] opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
      </body>
    </html>
  );
}
