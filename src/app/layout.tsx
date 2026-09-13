import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#fafaf9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "Rabiku — Platform Undangan Pernikahan Digital Drag & Drop",
    template: "%s | Rabiku",
  },
  description:
    "Buat undangan pernikahan digital yang elegan, eksklusif, dan modern dengan drag & drop builder. Fitur RSVP online, pemutar musik latar romantis, amplop digital interaktif, dan generator pesan WhatsApp otomatis per tamu.",
  keywords: [
    "undangan pernikahan digital",
    "wedding invitation online",
    "undangan digital elegan",
    "drag and drop wedding builder",
    "rsvp online pernikahan",
    "undangan web gratis",
  ],
  authors: [{ name: "Rabiku Studio" }],
  openGraph: {
    title: "Rabiku — Platform Undangan Pernikahan Digital Drag & Drop",
    description:
      "Buat undangan pernikahan digital elegan dengan drag & drop builder. RSVP online, amplop digital, dan generator pesan WhatsApp otomatis.",
    url: "/",
    siteName: "Rabiku",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rabiku — Platform Undangan Pernikahan Digital",
    description:
      "Buat undangan pernikahan digital impian Anda dengan mudah, cepat, dan indah.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=Cinzel:wght@400..700&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Dancing+Script:wght@400..700&family=Great+Vibes&family=Inter:wght@300..700&family=Jost:wght@300..700&family=Lora:ital,wght@0,400..700;1,400..700&family=MonteCarlo&family=Montserrat:wght@300..700&family=Outfit:wght@300..700&family=Parisienne&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:wght@300..700&family=Prata&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
