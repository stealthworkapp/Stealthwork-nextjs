import Link from "next/link";

const ArticleCard = ({ article }) => (
  <div className="bg-gray-900 rounded-lg overflow-hidden p-6">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-xl font-semibold mr-3">{article.title}</h3>
      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
        {article.topic}
      </span>
    </div>
    <p className="text-gray-400 mb-4">
      {article.dateCreated} | {article.author}
    </p>
    <p className="text-gray-300 mb-4">{article.summary}</p>
    <Link
      href={`/articles/${article.urlName}`}
      className="text-blue-400 hover:text-blue-300 transition duration-300 flex items-center"
    >
      Read More <span className="ml-2">&rarr;</span>
    </Link>
  </div>
);

export default ArticleCard;
