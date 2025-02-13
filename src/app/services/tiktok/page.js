"use client";
import React, { useState, useEffect } from "react";

const TikTokDownloader = () => {
  const [inputUrl, setInputUrl] = useState(
    "https://www.tiktok.com/@maegyi71/video/7469641427270749441?is_from_webapp=1&sender_device=pc"
  );
  const [videoSources, setVideoSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Add TikTok embed script when needed
  useEffect(() => {
    if (videoSources.length > 0) {
      const script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [videoSources]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setVideoSources([]);

    if (!inputUrl.trim()) {
      setError("Please enter a TikTok URL");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/get-tiktok-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: inputUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch video");
      }

      if (data.sources && data.sources.length > 0) {
        console.log(`Video sources retrieved via ${data.method}`);
        setVideoSources(data.sources);
      } else {
        throw new Error("No video sources found");
      }
    } catch (err) {
      setError(err.message || "Error loading video source");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputUrl("");
    setVideoSources([]);
    setIsLoading(false);
    setError("");
  };

  // Extract video ID from URL
  const getVideoId = (url) => {
    const match = url.match(/video\/(\d+)/);
    return match ? match[1] : null;
  };

  return (
    <div className=" pt-32 text-black">
      <h2 className="text-4xl font-bold mb-8 text-center text-white">
        TikTok Video Download
      </h2>
      <div className="">
        <p className="text-gray-300 mb-8 text-center">
          Download tiktok videos without watermark and in HD
        </p>
        {/* Download Buttons and Embedded Video Container */}
        {videoSources.length > 0 ? (
          <div className="md:flex md:justify-center items-start max-w-3xl mx-auto">
            {/* Download Buttons */}
            <div className="max-w-xs mx-auto space-y-4 md:mr-4 mt-4">
              <a
                href={`${
                  videoSources[videoSources.length - 1]
                }&filename=stealthwork_video.mp4`}
                download
                className="block w-full px-4 py-2 text-center text-white bg-blue-400 rounded-lg hover:bg-blue-300"
              >
                Download
              </a>
              <a
                href={`${videoSources[0]}&filename=stealthwork_video_HD.mp4`}
                download
                className="block w-full px-4 py-2 text-center text-white bg-blue-700 rounded-lg hover:bg-blue-600"
              >
                Download in HD
              </a>
              <button
                onClick={() => handleReset()}
                className="block w-full px-4 py-2 text-center text-white bg-gray-500 rounded-lg hover:bg-gray-400"
              >
                Download Another
              </button>
            </div>

            {/* Embedded Video */}
            <div className="mt-4 md:mt-0 mx-auto">
              <blockquote
                className="tiktok-embed"
                cite={inputUrl}
                data-video-id={getVideoId(inputUrl)}
                style={{
                  maxWidth: "325px",
                  minWidth: "325px",
                  height: "576px",
                }}
              >
                <section></section>
              </blockquote>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-2 max-w-md mx-auto space-y-4"
          >
            {/* URL Input Form */}
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste TikTok URL here"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 text-white bg-blue-500 rounded-lg transition-colors ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
            >
              {isLoading ? "Fetching..." : "Get Download Links"}
            </button>
          </form>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500 text-white text-center rounded-lg max-w-md mx-auto">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TikTokDownloader;
