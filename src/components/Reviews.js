"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

const ReviewCard = ({ review }) => {
  // Convert Unix timestamp to readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {review.author}
          </h3>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={16}
                className={`${
                  index < review.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 fill-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {review.rating}/5
            </span>
          </div>
        </div>
        <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
      </div>
      <p className="text-gray-600 leading-relaxed">{review.review}</p>
      <div className="mt-4 flex items-center text-sm text-gray-500">
        <span className="capitalize">via {review.source}</span>
      </div>
    </div>
  );
};

const ReviewsSummary = ({ meta }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
          <div className="flex items-center mt-2">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  size={20}
                  className={`${
                    index < Math.round(meta.averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 fill-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-lg font-semibold">
              {meta.averageRating.toFixed(1)}
            </span>
            <span className="mx-2 text-gray-500">•</span>
            <span className="text-gray-600">
              {meta.totalReviews}{" "}
              {meta.totalReviews === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center">
            <span className="w-12 text-sm text-gray-600">{rating} stars</span>
            <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full"
                style={{
                  width: `${
                    (meta.ratingsBreakdown[`count${rating}`] /
                      meta.totalReviews) *
                    100
                  }%`,
                }}
              />
            </div>
            <span className="w-12 text-sm text-gray-600">
              {meta.ratingsBreakdown[`count${rating}`]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Reviews() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!data?.reviews?.items?.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700">No Reviews Yet</h2>
        <p className="text-gray-500 mt-2">Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ReviewsSummary meta={data.reviews.meta} />
      <div className="space-y-6">
        {data.reviews.items.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
