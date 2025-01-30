// src/app/page.js
import FeaturedProducts from "@/components/FeaturedProducts";
import NewsletterSignupModal from "@/components/NewsletterSignupModal";
import SetmoreBooking from "@/components/SetmoreBooking";
import blogArticles from "@/data/blogArticles.json";
import ArticleCard from "@/components/ArticleCard";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ResponsiveBanner from "@/components/ResponsiveBanner/BannerWrapper";

export default function Home() {
  const RecentArticles = () => {
    // Sort articles by date (newest first) and take the first two
    const sortedRecentArticles = blogArticles.articles
      .sort((a, b) => {
        const dateA = new Date(a.dateCreated);
        const dateB = new Date(b.dateCreated);
        return dateB - dateA; // Sort in descending order (newest first)
      })
      .slice(0, 2);

    return (
      <div id="recent-articles-container" className="mt-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Recent Articles</h2>
        <div
          id="recent-articles-grid"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {sortedRecentArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="text-center p-8 pt-32 bg-black text-white">
      <div className="banner">
        <div className="content">
          <ResponsiveBanner />
          {/* <SetmoreBooking
            className="bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300"
            content="Book a Consultation"
          /> */}
        </div>
      </div>
      <FeaturedProducts />
      <RecentArticles />
      <NewsletterSignupModal />
      <ReviewsCarousel />
    </div>
  );
}
