import SnapTikClient from "@/utils/SnapTikClient";

const BASE_URL = "http://stealthwork.app"; // Your actual domain

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) throw new Error("URL is required");

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
          headers: { "User-Agent": "okhttp/3.10.0.1" },
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
        // method = "TikTok API";
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
      return `${BASE_URL}/api/download?url=${encodeURIComponent(
        src
      )}`;
    });

    return new Response(
      JSON.stringify({
        source: downloadUrls[0], // Best available source
        sources: downloadUrls, // All available sources
        // method: method,
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
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
