"use client";
import React, { useState, useMemo } from "react";
import blogArticles from "@/data/blogArticles.json";
import ArticleCard from "@/components/ArticleCard"; // Assuming you have this component

const Blog = () => {
  // State for selected topic and sort order
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  // Extract unique topics from blog articles
  const topics = useMemo(() => {
    const uniqueTopics = new Set(
      blogArticles.articles.map((article) => article.topic)
    );
    return ["All", ...uniqueTopics];
  }, []);

  // Filter and sort articles based on selected topic and sort order
  const filteredAndSortedArticles = useMemo(() => {
    let filtered =
      selectedTopic === "All"
        ? blogArticles.articles
        : blogArticles.articles.filter(
            (article) => article.topic === selectedTopic
          );

    return filtered.sort((a, b) => {
      const dateA = new Date(a.dateCreated);
      const dateB = new Date(b.dateCreated);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [selectedTopic, sortOrder]);

  return (
    <div id="blog-container" className="p-8 pt-32 bg-black text-white">
      <h2 className="text-4xl font-bold mb-12 text-center">Articles</h2>
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Topic filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="topic-filter" className="text-gray-300">
              Filter by topic:
            </label>
            <select
              id="topic-filter"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2"
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {/* Sort order selector */}
          <div className="flex items-center space-x-2">
            <label htmlFor="sort-order" className="text-gray-300">
              Sort by date:
            </label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Display filtered and sorted articles */}
      <div
        id="article-grid"
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
      >
        {filteredAndSortedArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Display message if no articles match the filter */}
      {filteredAndSortedArticles.length === 0 && (
        <p className="text-center text-gray-400 mt-8">
          No articles found for the selected topic.
        </p>
      )}
    </div>
  );
};

export default Blog;
