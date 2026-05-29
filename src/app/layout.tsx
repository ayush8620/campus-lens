import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "CampusLens — Discover. Compare. Decide.",
    template: "%s | CampusLens",
  },
  description:
    "Discover top colleges across India. Compare fees, placements, ratings, and courses. Make informed decisions with CampusLens — your smart college discovery platform.",
  keywords: [
    "college",
    "university",
    "India",
    "engineering",
    "IIT",
    "NIT",
    "admission",
    "placement",
    "compare colleges",
    "college finder",
  ],
  authors: [{ name: "CampusLens" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://campuslens.vercel.app",
    siteName: "CampusLens",
    title: "CampusLens — Discover. Compare. Decide.",
    description:
      "Discover top colleges across India. Compare fees, placements, ratings, and courses.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CampusLens — College Discovery Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusLens — Discover. Compare. Decide.",
    description:
      "Discover top colleges across India. Compare fees, placements, ratings, and courses.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          <ThemeProvider>
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
