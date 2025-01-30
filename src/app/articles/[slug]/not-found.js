// src/app/articles/[slug]/not-found.js
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-8 pt-32 bg-black text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Article Not Found</h2>
        <p className="text-gray-300 mb-8">
          Sorry, the article you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/articles"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Back to Articles
        </Link>
      </div>
    </div>
  );
}
