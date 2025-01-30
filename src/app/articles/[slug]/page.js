import { notFound } from "next/navigation";
import Link from "next/link";
import blogArticles from "@/data/blogArticles.json";
import CodeBlock from "@/components/CodeBlock";

// Generate static params for all articles
export async function generateStaticParams() {
  return blogArticles.articles.map((article) => ({
    slug: article.urlName,
  }));
}

// Generate metadata for each article
export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params); // Ensure params is awaited
  const { slug } = resolvedParams;

  const article = blogArticles.articles.find((article) => article.urlName === slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.summary,
  };
}

// Simulate async data fetching
async function getArticle(slug) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(blogArticles.articles.find((article) => article.urlName === slug));
    }, 100); // Simulate delay
  });
}

export default async function ArticlePage({ params }) {
  const resolvedParams = await Promise.resolve(params); // Fix: Ensure params is awaited
  const { slug } = resolvedParams;

  const article = await getArticle(slug); // Await only if fetching asynchronously

  if (!article) {
    notFound();
  }

  return (
    <div className="p-8 pt-32 bg-black text-white">
      <div className="max-w-3xl mx-auto">
        <nav className="mb-8">
          <Link href="/articles" className="text-blue-400 hover:text-blue-300">
            ← Back to Articles
          </Link>
        </nav>

        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-400">
            {article.dateCreated} | {article.author}
          </p>
          <span className="bg-blue-500 text-white px-2 py-1 rounded">
            {article.topic}
          </span>
        </div>

        {article.content.map((item) => (
          <div key={item.id} className="mb-8">
            {item.title && (
              <h2 className="text-2xl font-semibold mb-4">{item.title}</h2>
            )}
            {item.paragraph && (
              <div className="text-gray-300 leading-relaxed">
                {item.paragraph}
              </div>
            )}
            {item.code && (
              <CodeBlock
                code={item.code.content}
                language={item.code.language}
              />
            )}
            {item.steps && (
              <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4 mt-4">
                {item.steps.map((step, index) => (
                  <li key={index} className="pl-2">
                    {step}
                  </li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
