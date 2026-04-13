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
  title: "Forage — The Shared Intelligence Substrate That Makes Agent Work Compound",
  description: "Give your AI agents a shared intelligence substrate that makes their work compound. Real memory, live web intelligence, causal reasoning. 36 tools, one MCP connection. Pay per call. No subscriptions.",
  metadataBase: new URL("https://useforage.xyz"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Forage — The Shared Intelligence Substrate That Makes Agent Work Compound",
    description: "Give your AI agents a shared intelligence substrate that makes their work compound. Real memory, live web intelligence, causal reasoning. 36 tools, one MCP connection. Pay per call. No subscriptions.",
    url: "https://useforage.xyz",
    siteName: "Forage",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forage — The Shared Intelligence Substrate That Makes Agent Work Compound",
    description: "Give your AI agents a shared intelligence substrate that makes their work compound. Real memory, live web intelligence, causal reasoning. 36 tools, one MCP connection. Pay per call. No subscriptions.",
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
                  "description": "AI agent intelligence platform — shared intelligence substrate, live web intelligence, causal reasoning."
                },
                {
                  "@type": "SoftwareApplication",
                  "name": "Forage",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web",
                  "description": "MCP server giving AI agents a shared intelligence substrate that makes their work compound. 36 tools. Pay per call.",
                  "url": "https://useforage.xyz",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD",
                    "description": "No credit card required · $5.00 credit included · Cancel anytime"
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.intercomSettings = {
                app_id: "jqygdl4y",
                api_base: "https://api-iam.intercom.io"
              };
              (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/' + w.intercomSettings.app_id;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
