import articles from "@/data/blogArticles.json" assert { type: "json" };

export async function GET() {
  // Format date to RFC822
  const formatDate = (date) => {
    return new Date(date).toUTCString();
  };

  // Format content to be XML safe
  const formatContent = (content) => {
    return content
      .map(
        (section) =>
          `&lt;h2&gt;${section.title}&lt;/h2&gt;
       &lt;p&gt;${section.paragraph}&lt;/p&gt;`
      )
      .join("");
  };

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>StealthWork Blog</title>
    <link>https://stealthwork.app</link>
    <description>Expert insights on VPN solutions, remote work, and digital tools. Learn about VPN security, remote access, payment processing, mobile development, and more.</description>
    <language>en-us</language>
    <lastBuildDate>${formatDate(new Date())}</lastBuildDate>
    ${articles.articles
      .map(
        (article) => `
      <item>
        <title>${article.title
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</title>
        <link>https://stealthwork.app/articles/${article.urlName}</link>
        <guid>https://stealthwork.app/articles/${article.urlName}</guid>
        <pubDate>${formatDate(article.dateCreated)}</pubDate>
        <dc:creator>StealthWork Team</dc:creator>
        <category>${article.topic}</category>
        <description>${article.summary
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</description>
        <content:encoded>${formatContent(article.content)}</content:encoded>
      </item>
    `
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
