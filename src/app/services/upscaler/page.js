"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, Loader, AlertTriangle } from "lucide-react";

const MAX_DIMENSION = 4096;
const CHUNK_SIZE = 512;

const ImageUpscaler = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [upscaledImage, setUpscaledImage] = useState(null);
  const [scale, setScale] = useState(2);
  const [quality, setQuality] = useState("high");
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const canvasRef = useRef(null);

  const showLoadingState = isProcessing || isLoading;

  const processWithDelay = useCallback(async (fn) => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return fn();
  }, []);

  const checkImageSize = (img) => {
    const targetWidth = img.width * scale;
    const targetHeight = img.height * scale;

    if (targetWidth > MAX_DIMENSION || targetHeight > MAX_DIMENSION) {
      const maxScale = Math.min(
        MAX_DIMENSION / img.width,
        MAX_DIMENSION / img.height
      );
      setScale(Math.floor(maxScale));
      setWarning(
        `Image too large. Scale reduced to ${Math.floor(
          maxScale
        )}x to prevent memory issues.`
      );
      return false;
    }
    return true;
  };

  const handleImageUpload = async (event) => {
    setError(null);
    setWarning(null);
    setProgress(0);
    setUpscaledImage(null);
    setOriginalImage(null);
    const file = event.target.files[0];

    if (!file) {
      setError("No file selected");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 25) {
      setError("Image file size must be less than 25MB");
      return;
    }

    try {
      setIsLoading(true);
      setLoadingStatus("Reading file...");
      setProgress(5);

      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setProgress(15);
      setLoadingStatus("Loading image...");

      const img = await new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataUrl;
      });

      setProgress(25);
      if (!checkImageSize(img)) {
        setProgress(30);
      }

      setDimensions({ width: img.width, height: img.height });
      setOriginalImage(dataUrl);
      setIsLoading(false);

      setIsProcessing(true);
      setLoadingStatus("Processing image...");
      await upscaleImage(img);
    } catch (err) {
      console.error("Processing error:", err);
      setError("Error processing image: " + err.message);
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  const processImageChunk = async (
    ctx,
    sourceCtx,
    x,
    y,
    width,
    height,
    targetX,
    targetY,
    targetWidth,
    targetHeight
  ) => {
    await processWithDelay(() => {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        sourceCtx.canvas,
        x,
        y,
        width,
        height,
        targetX,
        targetY,
        targetWidth,
        targetHeight
      );
    });
  };

  const processInChunks = async (
    sourceCtx,
    targetCtx,
    sourceWidth,
    sourceHeight,
    targetWidth,
    targetHeight
  ) => {
    const numChunksX = Math.ceil(sourceWidth / CHUNK_SIZE);
    const numChunksY = Math.ceil(sourceHeight / CHUNK_SIZE);
    const totalChunks = numChunksX * numChunksY;
    let processedChunks = 0;

    for (let y = 0; y < sourceHeight; y += CHUNK_SIZE) {
      for (let x = 0; x < sourceWidth; x += CHUNK_SIZE) {
        const chunkWidth = Math.min(CHUNK_SIZE, sourceWidth - x);
        const chunkHeight = Math.min(CHUNK_SIZE, sourceHeight - y);

        const targetX = (x * targetWidth) / sourceWidth;
        const targetY = (y * targetHeight) / sourceHeight;
        const targetChunkWidth = (chunkWidth * targetWidth) / sourceWidth;
        const targetChunkHeight = (chunkHeight * targetHeight) / sourceHeight;

        await processImageChunk(
          targetCtx,
          sourceCtx,
          x,
          y,
          chunkWidth,
          chunkHeight,
          targetX,
          targetY,
          targetChunkWidth,
          targetChunkHeight
        );

        processedChunks++;
        setProgress(30 + Math.round((processedChunks / totalChunks) * 40));
      }
    }
  };

  const applyAntiAliasing = async (ctx, width, height) => {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");

    const chunkSize = CHUNK_SIZE;
    const numChunksX = Math.ceil(width / chunkSize);
    const numChunksY = Math.ceil(height / chunkSize);

    for (let chunkY = 0; chunkY < numChunksY; chunkY++) {
      for (let chunkX = 0; chunkX < numChunksX; chunkX++) {
        const x = chunkX * chunkSize;
        const y = chunkY * chunkSize;
        const w = Math.min(chunkSize, width - x);
        const h = Math.min(chunkSize, height - y);

        const imageData = ctx.getImageData(x, y, w, h);
        const data = imageData.data;

        await processWithDelay(() => {
          for (let py = 1; py < h - 1; py++) {
            for (let px = 1; px < w - 1; px++) {
              const idx = (py * w + px) * 4;
              for (let c = 0; c < 3; c++) {
                const sum = [
                  data[idx - w * 4 - 4 + c],
                  data[idx - w * 4 + c],
                  data[idx - w * 4 + 4 + c],
                  data[idx - 4 + c],
                  data[idx + c],
                  data[idx + 4 + c],
                  data[idx + w * 4 - 4 + c],
                  data[idx + w * 4 + c],
                  data[idx + w * 4 + 4 + c],
                ].reduce((a, b) => a + b, 0);
                data[idx + c] = sum / 9;
              }
            }
          }
          tempCtx.putImageData(imageData, x, y);
        });
      }
    }

    ctx.drawImage(tempCanvas, 0, 0);
  };

  const upscaleImage = async (img) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setError("Canvas initialization error");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("Canvas context error");
      return;
    }

    const targetWidth = img.width * scale;
    const targetHeight = img.height * scale;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(img, 0, 0);

    try {
      setLoadingStatus("Upscaling image...");
      await processInChunks(
        tempCtx,
        ctx,
        img.width,
        img.height,
        targetWidth,
        targetHeight
      );
      setProgress(70);

      if (quality === "high") {
        setLoadingStatus("Applying enhancements...");
        await applyAntiAliasing(ctx, targetWidth, targetHeight);
      }
      setProgress(90);

      setLoadingStatus("Finalizing...");
      const dataUrl = canvas.toDataURL("image/png");
      setUpscaledImage(dataUrl);
      setProgress(100);
    } catch (err) {
      console.error("Processing error:", err);
      setError("Error processing image");
      throw err;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 pt-32">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold mb-8 text-center">Enhanced Image Upscaler</h2>
        <p className="text-gray-300 mb-8 text-center">
          Upload an image to upscale it with improved clarity
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {warning && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {warning}
          </div>
        )}

        {showLoadingState && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-center">
                  {loadingStatus}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-500 text-center">
                    {loadingStatus}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 disabled:opacity-50"
              disabled={showLoadingState}
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Image
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={showLoadingState}
              />
            </label>

            <div className="flex items-center space-x-2">
              <label className="text-sm">Scale Factor:</label>
              <select
                className="border rounded px-2 py-1 text-black"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                disabled={showLoadingState}
              >
                <option value="2">2x</option>
                <option value="3">3x</option>
                <option value="4">4x</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm">Quality:</label>
              <select
                className="border rounded px-2 py-1  text-black"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                disabled={showLoadingState}
              >
                <option value="high">High (Slower)</option>
                <option value="medium">Medium (Faster)</option>
              </select>
            </div>
          </div>

          {upscaledImage && !showLoadingState && (
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.download = "upscaled-image.png";
                link.href = upscaledImage;
                link.click();
              }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Download Upscaled Image
            </button>
          )}
        </div>

        {!upscaledImage && !originalImage && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Processing Time & Limitations
                </h3>
                <div className="mt-2 text-sm text-blue-700 space-y-1">
                  <p>Please note the following limitations:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Maximum file size: 25MB</li>
                    <li>Maximum dimension: 4096px (width or height)</li>
                    <li>Supported formats: PNG, JPG, JPEG, WebP</li>
                  </ul>
                  <p className="mt-2">Processing time varies based on:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Image size - larger images may take several minutes</li>
                    <li>Scale factor - 4x scaling takes longer than 2x</li>
                    <li>
                      Quality setting - high quality requires more processing
                    </li>
                  </ul>
                  <p className="mt-2 font-medium">
                    Please keep the tab open during processing. The upscaler
                    will show progress in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {originalImage && (
            <div className="space-y-2">
              <h3 className="font-semibold">Original Image</h3>
              <div
                className="border rounded p-2 relative"
                style={{ height: "300px" }}
              >
                <Image
                  src={originalImage}
                  alt="Original"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              <p className="text-sm text-gray-500">
                Size: {dimensions.width} x {dimensions.height}
              </p>
            </div>
          )}

          {/* Add this section */}
          {upscaledImage && !showLoadingState && (
            <div className="space-y-2">
              <h3 className="font-semibold">Upscaled Image</h3>
              <div
                className="border rounded p-2 relative"
                style={{ height: "300px" }}
              >
                <Image
                  src={upscaledImage}
                  alt="Upscaled"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              <p className="text-sm text-gray-500">
                Size: {dimensions.width * scale} x {dimensions.height * scale}
              </p>
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageUpscaler;
