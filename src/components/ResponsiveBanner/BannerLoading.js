// src/components/BannerLoading.js
export default function BannerLoading() {
  return (
    <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[50px] bg-black/90">
      <div className="relative w-full h-[60vh] flex items-center justify-center">
        <div className="bg-black/75 rounded-[30px] p-6 backdrop-blur-sm">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 w-64 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-56 bg-gray-700 rounded mb-4"></div>
            <div className="h-10 w-full bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
