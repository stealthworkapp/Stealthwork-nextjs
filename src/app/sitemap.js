export default async function sitemap() {
  const baseUrl = "https://stealthwork.app";

  // Core pages
  const routes = [
    "",
    "/services",
    "/articles",
    "/reviews",
    "/services/speedtest",
    "/services/ip-location",
    "/services/watermark",
    "/services/upscaler",
    "/services/stealthtik",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));

  // Add dynamic routes from your blog articles
  const articles = [
    // Add your article slugs here
    "advantages-of-vpns-for-remote-workers-2024",
    "understanding-remote-access",
    "understanding-stripe-payment-processing",
    "integrating-capacitor-nextjs-mobile-app-guide",
    "integrating-firebase-capacitor-guide",
    "why-move-react-to-nextjs-and-use-nextjs-with-capacitor",
    "fundamentals-of-engineering-exam-japan",
  ].map((slug) => ({
    url: `${baseUrl}/articles/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...routes, ...articles];
}
