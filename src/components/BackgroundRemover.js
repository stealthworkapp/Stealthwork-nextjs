'use client'
import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Download } from "lucide-react";

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setProcessedImage(null);
        setError(null);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const removeBackground = () => {
    if (!originalImage) return;
    setIsProcessing(true);
    setError(null);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size to match image
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    // Draw original image
    ctx.drawImage(originalImage, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Enhanced background removal for logos
    const tolerance = 5; // Much stricter tolerance for white detection
    const backgroundColor = [255, 255, 255]; // White background
    const visited = new Set(); // Track processed pixels
    const width = canvas.width;
    const height = canvas.height;

    // Flood fill from the edges to remove white background
    const stack = [];

    // Add edge pixels to initial stack
    for (let x = 0; x < width; x++) {
      stack.push([x, 0]); // Top edge
      stack.push([x, height - 1]); // Bottom edge
    }
    for (let y = 0; y < height; y++) {
      stack.push([0, y]); // Left edge
      stack.push([width - 1, y]); // Right edge
    }

    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const idx = (y * width + x) * 4;
      const key = `${x},${y}`;

      if (visited.has(key)) continue;
      visited.add(key);

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Check if pixel is white (with very low tolerance)
      const isWhite =
        Math.abs(r - backgroundColor[0]) < tolerance &&
        Math.abs(g - backgroundColor[1]) < tolerance &&
        Math.abs(b - backgroundColor[2]) < tolerance;

      if (isWhite) {
        // Make pixel transparent
        data[idx + 3] = 0;

        // Add neighboring pixels to stack
        const neighbors = [
          [x + 1, y],
          [x - 1, y],
          [x, y + 1],
          [x, y - 1],
        ];

        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            stack.push([nx, ny]);
          }
        }
      }
    }

    // Put processed image data back to canvas
    ctx.putImageData(imageData, 0, 0);

    // Convert canvas to image
    try {
      const processedDataUrl = canvas.toDataURL("image/png");
      setProcessedImage(processedDataUrl);
    } catch (err) {
      setError("Error processing image");
    }

    setIsProcessing(false);
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.download = "removed-background.png";
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          ref={fileInputRef}
        />

        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
        >
          <Upload size={20} />
          Upload Image
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {originalImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ImageIcon size={20} />
              Original Image
            </h3>
            <img
              src={originalImage.src}
              alt="Original"
              className="max-w-full h-auto rounded-lg"
            />
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ImageIcon size={20} />
              Processed Image
            </h3>
            {processedImage ? (
              <img
                src={processedImage}
                alt="Processed"
                className="max-w-full h-auto rounded-lg"
              />
            ) : (
              <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Process the image to see result</p>
              </div>
            )}
          </div>
        </div>
      )}

      {originalImage && (
        <div className="flex justify-center gap-4">
          <button
            onClick={removeBackground}
            disabled={isProcessing}
            className={`bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors ${
              isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              "Remove Background"
            )}
          </button>

          {processedImage && (
            <button
              onClick={downloadImage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <Download size={20} />
              Download
            </button>
          )}
        </div>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default BackgroundRemover;
