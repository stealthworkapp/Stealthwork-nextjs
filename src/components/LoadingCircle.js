import React from "react";
import "@/styles/LoadingCircle.css";

const LoadingCircle = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
  </div>
);

export default LoadingCircle;
