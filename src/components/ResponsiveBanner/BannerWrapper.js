// src/components/BannerWrapper.js
import { Suspense, lazy } from "react";
import BannerLoading from "./BannerLoading";

// Lazy load the ResponsiveBanner component
const ResponsiveBanner = lazy(() => import("./ResponsiveBanner"));

export default function BannerWrapper() {
  return (
    <Suspense fallback={<BannerLoading />}>
      <ResponsiveBanner />
    </Suspense>
  );
}
