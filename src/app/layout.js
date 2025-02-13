import { Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import SEOStructuredData from "@/components/SEOStructuredData";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://stealthwork.app"),
  title: {
    default:
      "StealthWork - VPN Solutions, Remote Work Tools & Digital Services",
    template: "%s | StealthWork",
  },
  description:
    "Expert VPN router setups, remote work solutions, TikTok video downloads without watermarks, image processing tools, and web development services. Stay secure and productive anywhere.",
  keywords: [
    "VPN router setup",
    "remote work solutions",
    "download TikTok without watermark",
    "TikTok video downloader",
    "image upscaler",
    "image watermark",
    "GL.iNet router configuration",
    "secure remote access",
    "website development",
    "remote work security",
    "VPN for digital nomads",
    "internet speed test",
    "IP location checker",
    "remote work tools",
    "cybersecurity solutions",
    "VPN consulting",
    "payment integration services",
    "SEO optimization",
    "secure remote workplace",
    "global content access",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stealthwork.app",
    siteName: "StealthWork",
    title: "StealthWork - VPN Solutions, Remote Work Tools & Digital Services",
    description:
      "Expert VPN router setups, remote work solutions, TikTok video downloads without watermarks, image processing tools, and web development services. Stay secure and productive anywhere.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "StealthWork - Secure Remote Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StealthWork - VPN Solutions, Remote Work Tools & Digital Services",
    description:
      "Expert VPN router setups, remote work solutions, TikTok video downloads without watermarks, image processing tools, and web development services. Stay secure and productive anywhere.",
    images: ["/twitter-image.jpg"],
  },
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
  alternates: {
    canonical: "https://stealthwork.app",
    types: {
      "application/rss+xml": [
        {
          url: "/feed.xml",
          title: "StealthWork Blog RSS Feed",
        },
      ],
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <SEOStructuredData />
      </head>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-black`}
        suppressHydrationWarning
      >
        <Navigation />
        <main className="flex-grow">{children}</main>
        <footer className="bg-black p-4 text-center text-gray-500">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
              <div>
                <h3 className="text-white text-lg font-semibold mb-4">
                  VPN Solutions
                </h3>
                <ul className="space-y-2">
                  <li>GL.iNet Router Setup</li>
                  <li>Remote Work Security</li>
                  <li>Global Access Solutions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold mb-4">
                  Free Tools
                </h3>
                <ul className="space-y-2">
                  <li>TikTok Video Downloader</li>
                  <li>Image Upscaler</li>
                  <li>Watermark Generator</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold mb-4">
                  Development
                </h3>
                <ul className="space-y-2">
                  <li>Website Development</li>
                  <li>Payment Integration</li>
                  <li>SEO Services</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8">
              © {new Date().getFullYear()} StealthWork. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
