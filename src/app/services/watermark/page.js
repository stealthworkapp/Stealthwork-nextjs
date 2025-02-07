'use client'
import React from "react";
import WatermarkEditor from "@/components/WatermarkEditor";

const WatermarkPage = () => {
  return (
    <div className="p-8 pt-32 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center">Image Watermark Tool</h2>
        <p className="text-gray-300 mb-8 text-center">
          Add customizable watermarks to your images. Adjust text, opacity, repetition, and rotation.
        </p>
        <WatermarkEditor />
      </div>
    </div>
  );
};

export default WatermarkPage;