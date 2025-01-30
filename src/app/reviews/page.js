// src/app/reviews/page.js
"use client";

import { useEffect, useState } from "react";
import { Star, Mail, Globe, MapPin } from "lucide-react";
import Image from "next/image";
import logo from "@/images/logo.png";

const ReviewCard = ({ review }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-gray-800 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{review.author}</h3>
          <div className="flex items-center mt-1">
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
        </div>
        <span className="text-sm text-gray-400">{formatDate(review.date)}</span>
      </div>
      <p className="text-gray-300 leading-relaxed">{review.review}</p>
      <div className="mt-4 text-sm text-gray-400">via {review.source}</div>
    </div>
  );
};

const CompanyHeader = ({ company }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-gray-800 rounded-lg p-8 mb-8">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {company.logoUrl && (
          <div className="w-24 h-24 relative flex-shrink-0">
            <Image
              src={logo}
              alt={company.name}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        )}
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-white mb-4">{company.name}</h1>
          {/* <p className="text-gray-300 mb-4 leading-relaxed">
            Stealth Work Started in 2023
          </p> */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            {company.email && (
              <a
                href="mailto:contact@stealthwork.app"
                className="flex items-center gap-2 hover:text-blue-400"
              >
                <Mail size={16} />
                contact@stealthwork.app
              </a>
            )}

            <span className="flex items-center gap-2">
              <MapPin size={16} />
              Remote
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ReviewsPage() {
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
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div
          className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded"
          role="alert"
        >
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-32">
      <CompanyHeader company={data.company} />

      <div className="bg-white/5 backdrop-blur-sm border border-gray-800 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={24}
                className={`${
                  index < Math.round(data.reviews.meta.averageRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <div>
            <span className="text-2xl font-bold text-white">
              {data.reviews.meta.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-400 ml-2">
              out of {data.reviews.meta.totalReviews} reviews
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {data.reviews.items.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
