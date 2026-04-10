import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Forage — The Knowledge Layer Your AI Agents Are Missing",
  description: "Give your AI agents real memory, live web intelligence, and causal reasoning. 36 tools, one MCP connection. Pay per call. No subscriptions.",
  metadataBase: new URL("https://useforage.xyz"),
  openGraph: {
    title: "Forage — The Knowledge Layer Your AI Agents Are Missing",
    description: "Give your AI agents real memory, live web intelligence, and causal reasoning. 36 tools, one MCP connection. Pay per call. No subscriptions.",
    url: "https://useforage.xyz",
    siteName: "Forage",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forage — The Knowledge Layer Your AI Agents Are Missing",
    description: "Give your AI agents real memory, live web intelligence, and causal reasoning. 36 tools, one MCP connection. Pay per call. No subscriptions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "name": "Ernesta Labs",
                  "url": "https://useforage.xyz",
                  "email": "director@useforage.xyz",
                  "description": "AI agent intelligence platform — persistent knowledge graph, live web intelligence, causal reasoning."
                },
                {
                  "@type": "SoftwareApplication",
                  "name": "Forage",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web",
                  "description": "MCP server giving AI agents real memory, live data, and causal reasoning. 36 tools. Pay per call.",
                  "url": "https://useforage.xyz",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD",
                    "description": "$5 free credits on signup"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
