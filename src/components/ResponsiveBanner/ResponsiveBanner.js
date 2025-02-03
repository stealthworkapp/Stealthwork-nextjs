/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import SetmoreBooking from "../SetmoreBooking";
import Image from "next/image";

const banner = "/banner.png";
const bannerMobile = "/bannerMobile.png";
const notificationvid = "/videos/moving.mp4";
const notificationvidmobile = "/videos/mobilevid.mp4";

const VIDEO_BREAKPOINT = 640;

const ResponsiveBanner = () => {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [shouldUsePhoneVideo, setShouldUsePhoneVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    setContentVisible(true);
    setIsMobile(window.innerWidth < 900);
    const video = document.createElement("video");
    video.src = shouldUsePhoneVideo ? notificationvidmobile : notificationvid;
    video.preload = "auto";
    video.onloadeddata = () => setIsVideoReady(true);
    video.onerror = () => setVideoError(true);

    const checkVideoBreakpoint = () => {
      setShouldUsePhoneVideo(window.innerWidth < VIDEO_BREAKPOINT);
    };
    checkVideoBreakpoint();

    const handleResize = () => checkVideoBreakpoint();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [shouldUsePhoneVideo]);

  return (
    <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[50px]">
      <div className={`relative w-full min-h-[80vh] ${isMobile ? "h-[80vh]" : "h-[60vh]"}`}>
        <Image
          src={isMobile ? bannerMobile : banner}
          alt=""
          fill
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            isVideoReady ? "opacity-0" : "opacity-100"
          }`}
          priority
        />

        {!videoError && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              isVideoReady ? "opacity-100" : "opacity-0"
            }`}
          >
            <source
              src={
                shouldUsePhoneVideo ? notificationvidmobile : notificationvid
              }
              type="video/mp4"
            />
          </video>
        )}

        {!isMobile ? (
          <>
            <div
              className={`
                absolute left-2.5 top-1/2 -translate-y-1/2 max-w-[300px]
                transform transition-all duration-700 delay-300
                ${
                  contentVisible
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-8 opacity-0"
                }
              `}
            >
              <div className="bg-black/75 rounded-[30px] p-6 backdrop-blur-sm">
                <h1 className="text-3xl font-bold text-white">
                  Welcome to StealthWork
                </h1>
              </div>
            </div>

            <div
              className={`
                absolute right-2.5 top-1/2 -translate-y-1/2 max-w-[300px]
                transform transition-all duration-700 delay-500
                ${
                  contentVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-8 opacity-0"
                }
              `}
            >
              <div className="bg-black/75 rounded-[30px] p-6 backdrop-blur-sm">
                <p className="text-sm text-gray-200 mb-4">
                  Your trusted partner for VPN solutions, software development,
                  and website consultation. Stay secure, stay connected, stay
                  ahead.
                </p>
                <SetmoreBooking
                  className="w-full bg-white text-black px-6 py-2 rounded-full 
                    text-lg font-semibold hover:bg-gray-200 
                    transition-colors duration-300"
                  content="Book a Call"
                />
              </div>
            </div>
          </>
        ) : (
          <div
            className={`
              absolute bottom-6 left-4 right-4
              transform transition-all duration-700 delay-300
              ${
                contentVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }
            `}
          >
            <div className="bg-black/75 rounded-[30px] p-6 backdrop-blur-sm">
              <h1 className="text-2xl font-bold text-white mb-3">
                Welcome to StealthWork
              </h1>
              <p className="text-sm text-gray-200 mb-4">
                Your trusted partner for VPN solutions, software development,
                and website consultation. Stay secure, stay connected, stay
                ahead.
              </p>
              <SetmoreBooking
                className="w-full bg-white text-black px-6 py-2 rounded-full 
                  text-lg font-semibold hover:bg-gray-200 
                  transition-colors duration-300"
                content="Book a Call"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsiveBanner;
