import SnapTikClient from "@/utils/SnapTikClient";

const BASE_URL = "https://stealthwork.app"; // Your actual domain

// Function to resolve TikTok redirect URLs
const resolveTikTokRedirect = async (shortUrl) => {
  try {
    const response = await fetch(shortUrl, {
      method: "HEAD",
      redirect: "follow",
    });
    return response.url.split("?")[0]; // Get clean URL without query params
  } catch (error) {
    console.error("Error resolving TikTok redirect:", error);
    throw new Error("Failed to resolve TikTok URL");
  }
};

export async function POST(req) {
  try {
    let { url } = await req.json();
    if (!url) throw new Error("URL is required");

    // **If it's a TikTok short link, resolve it first**
    if (url.includes("vt.tiktok.com/")) {
      console.log("Resolving TikTok redirect URL...");
      url = await resolveTikTokRedirect(url);
      console.log("Resolved URL:", url);
    }

    // **Remove query parameters to get a clean URL**
    url = url.split("?")[0];
    console.log("Clean TikTok URL:", url);

    const snaptik = new SnapTikClient();
    let sources = [];
    let method = "";

    // **Attempt to fetch from SnapTik first**
    try {
      console.log("Attempting to fetch video from SnapTik...");
      const snapData = await snaptik.process(url);

      if (snapData?.data?.sources?.length > 0) {
        console.log("StealthTik Success: No-watermark video retrieved.");
        sources = snapData.data.sources.map((res) => res.url);
        method = "StealthTik";
      }
    } catch (snapError) {
      console.error("StealthTik Failed:", snapError.message);
    }

    // **Fallback to TikTok API if StealthTik fails**
    if (sources.length === 0) {
      console.log("Falling back to TikTok API...");

      try {
        const getIdVideo = (url) => {
          const matching = url.includes("/video/");
          if (!matching) throw new Error("Invalid TikTok URL");

          let idVideo = url.substring(
            url.indexOf("/video/") + 7,
            url.indexOf("/video/") + 26
          );

          return idVideo.length > 19
            ? idVideo.substring(0, idVideo.indexOf("?"))
            : idVideo;
        };

        const idVideo = getIdVideo(url);

        const API_URL = `https://api22-normal-c-alisg.tiktokv.com/aweme/v1/feed/?aweme_id=${idVideo}`;
        const request = await fetch(API_URL, {
          method: "GET",
          headers: {
            "User-Agent": "okhttp/3.10.0.1",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        const data = await request.json();

        if (!data.aweme_list || data.aweme_list.length === 0) {
          throw new Error("Video not found or deleted");
        }

        const video = data.aweme_list[0].video;
        const allSources = [];

        // Get non-watermarked sources from play_addr
        if (video.play_addr?.url_list) {
          allSources.push(...video.play_addr.url_list);
        }

        // Get watermarked sources from download_addr
        if (video.download_addr?.url_list) {
          allSources.push(...video.download_addr.url_list);
        }

        sources = allSources;
      } catch (tiktokError) {
        console.error("TikTok API Failed:", tiktokError.message);
      }
    }

    // **Remove only known bad sources**
    sources = sources.filter((src) => !src.includes("pro.snaptik.app"));

    if (sources.length === 0) {
      throw new Error("No valid video sources found");
    }

    // **Modify the URLs to point to your custom API for downloading**
    const downloadUrls = sources.map((src, index) => {
      // return src;
      return `${BASE_URL}/api/download?url=${encodeURIComponent(src)}`;
    });

    return new Response(
      JSON.stringify({
        source: downloadUrls[0], // Best available source
        sources: downloadUrls, // All available sources
        cleanUrl: url, // Clean TikTok URL (for embedding)
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching video:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch video",
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  }
}
