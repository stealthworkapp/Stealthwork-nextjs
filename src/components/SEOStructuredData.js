"use client";
import { useEffect, useState } from "react";

export default function SEOStructuredData() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "StealthWork",
    description:
      "Expert VPN router setups, remote work solutions, TikTok video downloads without watermarks, image processing tools, and web development services.",
    url: "https://stealthwork.app",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://stealthwork.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    // sameAs: [
    //   "https://twitter.com/stealthwork",
    //   "https://linkedin.com/company/stealthwork",
    // ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
