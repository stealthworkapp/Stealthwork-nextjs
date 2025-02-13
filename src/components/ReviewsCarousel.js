"use client";

// src/components/ReviewsCarousel.js
import { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import LoadingCircle from "./LoadingCircle";

const CompactReviewCard = ({ review }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 h-full border border-gray-800">
      <div className="flex items-center gap-2 mb-2">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={16}
            className={`${
              index < review.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-600"
            }`}
          />
        ))}
      </div>
      <p className="text-gray-300 line-clamp-4 mb-4">{review.review}</p>
      <p className="text-gray-400 font-medium">— {review.author}</p>
    </div>
  );
};

export default function ReviewsCarousel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useEffect(() => {
    if (data?.reviews?.items?.length) {
      const timer = setInterval(() => {
        setCurrentIndex((current) =>
          current === data.reviews.items.length - 1 ? 0 : current + 1
        );
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(timer);
    }
  }, [data]);

  if (loading) {
    return <LoadingCircle />;
  }

  if (error || !data?.reviews?.items?.length) {
    return null; // Don't show anything if there's an error or no reviews
  }

  const nextSlide = () => {
    setCurrentIndex((current) =>
      current === data.reviews.items.length - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((current) =>
      current === 0 ? data.reviews.items.length - 1 : current - 1
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-16">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={20}
                className={`${
                  index < Math.round(data.reviews.meta.averageRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-lg font-semibold text-white">
            {data.reviews.meta.averageRating.toFixed(1)}
          </span>
          <span className="text-gray-400">
            ({data.reviews.meta.totalReviews} reviews)
          </span>
        </div>
        <Link
          href="/reviews"
          className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
        >
          View all reviews
        </Link>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="transition-transform duration-500 ease-in-out flex"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {data.reviews.items.map((review) => (
              <div key={review.id} className="w-full flex-shrink-0">
                <CompactReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="text-white" size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <ChevronRight className="text-white" size={24} />
        </button>

        <div className="flex justify-center gap-2 mt-4">
          {data.reviews.items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-blue-500" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
