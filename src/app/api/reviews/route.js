// app/api/reviews/route.js
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const response = await axios.get(
      "https://stealthwork.setmore.com/reviews?sortBy=highestRated"
    );
    const html = response.data;
    const $ = cheerio.load(html);

    // Find the script containing all the data
    const scriptContent = $("#__NEXT_DATA__").html();

    if (!scriptContent) {
      return Response.json({ error: "No data found" }, { status: 404 });
    }

    // Parse the JSON content
    const jsonData = JSON.parse(scriptContent);
    const pageProps = jsonData?.props?.pageProps;

    // Extract company information
    const company = {
      name: pageProps?.company?.name,
      description: pageProps?.company?.aboutUs,
      businessType: pageProps?.company?.businessType,
      email: pageProps?.company?.email,
      website: pageProps?.company?.website,
      logoUrl: pageProps?.company?.logoUrl,
      address: pageProps?.company?.address,
      timeZone: pageProps?.company?.timeZone,
      socialMedia: pageProps?.company?.socialMediaLinks,
    };

    // Extract reviews metadata
    const reviewsMeta = {
      averageRating: pageProps?.reviewsMeta?.averageRating,
      totalReviews: pageProps?.reviewsMeta?.reviewCount,
      ratingsBreakdown: pageProps?.reviewsMeta?.ratingsCount,
    };

    // Extract reviews with all available details
    const reviews =
      pageProps?.reviews?.map((review) => ({
        id: review.id,
        author: review.author,
        rating: review.rating,
        review: review.review,
        date: review.date,
        source: review.source,
      })) || [];

    // Extract reviews settings
    const reviewsSettings = {
      reviewsActive: pageProps?.reviewsSettings?.reviewsActive,
      requestReviewUrl: pageProps?.reviewsSettings?.requestReview?.url,
    };

    // Extract booking settings if available
    const bookingSettings = {
      confirmationRedirect:
        pageProps?.bookingPageSettings?.confirmationRedirect,
      customerAuth: pageProps?.bookingPageSettings?.customerAuth,
      showReviews: pageProps?.bookingPageSettings?.showReviews,
      showWorkingHours: pageProps?.bookingPageSettings?.showWorkingHours,
      showAboutUsSection: pageProps?.bookingPageSettings?.showAboutUsSection,
      showServicesSection: pageProps?.bookingPageSettings?.showServicesSection,
    };

    return Response.json({
      company,
      reviews: {
        meta: reviewsMeta,
        settings: reviewsSettings,
        items: reviews,
      },
      bookingSettings,
      meta: {
        lastFetched: new Date().toISOString(),
        source: "Setmore",
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json(
      {
        error: "Failed to fetch data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
