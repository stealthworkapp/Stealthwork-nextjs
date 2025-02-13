export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/", "/admin/"],
      },
    ],
    sitemap: "https://stealthwork.app/sitemap.xml",
    host: "https://stealthwork.app",
  };
}
