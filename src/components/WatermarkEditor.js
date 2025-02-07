"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  Plus,
  X,
  Layers,
  Settings,
  Image as ImageIcon,
} from "lucide-react";

const fonts = [
  { name: "Arial", value: "Arial" },
  { name: "Times New Roman", value: "Times New Roman" },
  { name: "Helvetica", value: "Helvetica" },
  { name: "Georgia", value: "Georgia" },
  { name: "Verdana", value: "Verdana" },
];

const logoPositions = [
  { name: "Top Left", value: "topLeft" },
  { name: "Top Right", value: "topRight" },
  { name: "Bottom Left", value: "bottomLeft" },
  { name: "Bottom Right", value: "bottomRight" },
  { name: "Center", value: "center" },
];

const defaultSettings = {
  watermarkText: "StealthWork",
  repetitions: 3,
  opacity: 0.3,
  rotation: 45,
  fontSize: 24,
  selectedFont: "Arial",
  textColor: "#ffffff",
  logoPosition: "bottomRight",
  logoSize: 100,
  logoOpacity: 0.8,
};

const STORAGE_KEY = "watermark-settings";

const WatermarkEditor = () => {
  const [showControls, setShowControls] = useState(true);
  const [images, setImages] = useState([]);
  const [batchMode, setBatchMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewCanvasData, setPreviewCanvasData] = useState(null);
  const [logo, setLogo] = useState(null);
  const [watermarkSettings, setWatermarkSettings] = useState(defaultSettings);
  const canvasRef = useRef(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      setWatermarkSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watermarkSettings));
  }, [watermarkSettings]);

  useEffect(() => {
    if (previewImage) {
      processAndPreviewImage(previewImage);
    }
  }, [watermarkSettings, previewImage, logo]);

  const updateSetting = (key, value) => {
    setWatermarkSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (batchMode) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            setImages((prev) => [...prev, { original: img, file: file }]);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    } else {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            setPreviewImage(img);
            processAndPreviewImage(img);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setLogo(img);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const getLogoPosition = (canvas, logoWidth, logoHeight) => {
    const padding = 20;
    const positions = {
      topLeft: { x: padding, y: padding },
      topRight: { x: canvas.width - logoWidth - padding, y: padding },
      bottomLeft: { x: padding, y: canvas.height - logoHeight - padding },
      bottomRight: {
        x: canvas.width - logoWidth - padding,
        y: canvas.height - logoHeight - padding,
      },
      center: {
        x: (canvas.width - logoWidth) / 2,
        y: (canvas.height - logoHeight) / 2,
      },
    };
    return positions[watermarkSettings.logoPosition] || positions.bottomRight; // Add fallback
  };

  const processAndPreviewImage = (img) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Add watermark text
    ctx.save();
    ctx.globalAlpha = watermarkSettings.opacity;
    ctx.font = `${watermarkSettings.fontSize}px ${watermarkSettings.selectedFont}`;

    const textWidth = ctx.measureText(watermarkSettings.watermarkText).width;
    const spacing =
      Math.max(canvas.width, canvas.height) / watermarkSettings.repetitions;

    for (let y = 0; y < canvas.height; y += spacing) {
      for (let x = 0; x < canvas.width; x += spacing) {
        ctx.save();
        ctx.translate(x + textWidth / 2, y + watermarkSettings.fontSize / 2);
        ctx.rotate((watermarkSettings.rotation * Math.PI) / 180);
        ctx.fillStyle = watermarkSettings.textColor;
        ctx.textAlign = "center";
        ctx.fillText(watermarkSettings.watermarkText, 0, 0);
        ctx.restore();
      }
    }

    // Add logo if present
    if (logo) {
      const logoWidth = (logo.width * watermarkSettings.logoSize) / 100;
      const logoHeight = (logo.height * watermarkSettings.logoSize) / 100;
      const { x, y } = getLogoPosition(canvas, logoWidth, logoHeight);

      ctx.globalAlpha = watermarkSettings.logoOpacity;
      ctx.drawImage(logo, x, y, logoWidth, logoHeight);
    }

    ctx.restore();
    const dataUrl = canvas.toDataURL("image/png");
    setPreviewCanvasData(dataUrl);
    return canvas;
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const downloadImages = () => {
    if (batchMode) {
      images.forEach((img, index) => {
        const canvas = processAndPreviewImage(img.original);
        const link = document.createElement("a");
        link.download = `watermarked-${img.file.name}`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    } else if (previewImage) {
      const canvas = processAndPreviewImage(previewImage);
      const link = document.createElement("a");
      link.download = "watermarked-image.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="relative bg-gray-900" style={{ height: "75vh" }}>
      <div className="absolute inset-0">
        {batchMode ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative h-64 bg-gray-800 rounded-lg overflow-hidden"
              >
                <img
                  src={img.original.src}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ))}
            <label className="h-64 flex flex-col items-center justify-center cursor-pointer bg-gray-800 rounded-lg hover:bg-gray-700/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                multiple
              />
              <Plus className="h-12 w-12 text-gray-400 mb-2" />
              <span className="text-gray-400">Add images</span>
            </label>
          </div>
        ) : (
          <div className="h-full relative">
            {!previewImage ? (
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className="h-16 w-16 text-gray-400 mb-4" />
                <span className="text-gray-400 text-lg">
                  Click to upload image
                </span>
              </label>
            ) : (
              <img
                src={previewCanvasData}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        )}
        <button
          onClick={() => setShowControls(true)}
          className="absolute top-5 right-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors "
        >
          <Settings className="h-6 w-6 text-white" />
        </button>

        {/* Slide-in controls panel */}
        {showControls && (
          <div
            className={`absolute inset-y-0 right-0 w-96 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto ${
              showControls ? "" : ""
            }`}
          >
            <div className="h-full overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Watermark Settings
                </h2>
                <button
                  onClick={() => setShowControls(false)}
                  className="p-2 hover:bg-gray-800 rounded-full"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Batch mode toggle */}
                <button
                  onClick={() => setBatchMode(!batchMode)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <Layers className="h-4 w-4" />
                  {batchMode
                    ? "Switch to Single Image"
                    : "Switch to Batch Mode"}
                </button>

                {/* Logo upload section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center gap-2 bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors cursor-pointer">
                      <ImageIcon className="h-4 w-4" />
                      <span>{logo ? "Change Logo" : "Upload Logo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    {logo && (
                      <button
                        onClick={() => setLogo(null)}
                        className="p-2 bg-red-500 rounded-md hover:bg-red-600"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Logo position */}
                {logo && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Logo Position
                      </label>
                      <select
                        value={watermarkSettings.logoPosition}
                        onChange={(e) =>
                          updateSetting("logoPosition", e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                      >
                        {logoPositions.map((pos) => (
                          <option key={pos.value} value={pos.value}>
                            {pos.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Logo Size: {watermarkSettings.logoSize}%
                      </label>
                      <input
                        type="range"
                        value={watermarkSettings.logoSize}
                        onChange={(e) =>
                          updateSetting("logoSize", Number(e.target.value))
                        }
                        min="10"
                        max="200"
                        step="5"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Logo Opacity:{" "}
                        {(watermarkSettings.logoOpacity * 100).toFixed(0)}%
                      </label>
                      <input
                        type="range"
                        value={watermarkSettings.logoOpacity * 100}
                        onChange={(e) =>
                          updateSetting(
                            "logoOpacity",
                            Number(e.target.value) / 100
                          )
                        }
                        min="10"
                        max="100"
                        step="1"
                        className="w-full"
                      />
                    </div>
                  </>
                )}

                {/* Watermark text controls */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={watermarkSettings.watermarkText}
                    onChange={(e) =>
                      updateSetting("watermarkText", e.target.value)
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                    placeholder="Enter watermark text"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Font Family
                  </label>
                  <select
                    value={watermarkSettings.selectedFont}
                    onChange={(e) =>
                      updateSetting("selectedFont", e.target.value)
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                  >
                    {fonts.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Font Size: {watermarkSettings.fontSize}px
                  </label>
                  <input
                    type="range"
                    value={watermarkSettings.fontSize}
                    onChange={(e) =>
                      updateSetting("fontSize", Number(e.target.value))
                    }
                    min="12"
                    max="72"
                    step="2"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Text Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={watermarkSettings.textColor}
                      onChange={(e) =>
                        updateSetting("textColor", e.target.value)
                      }
                      className="w-12 h-12 p-1 bg-transparent"
                    />
                    <input
                      type="text"
                      value={watermarkSettings.textColor}
                      onChange={(e) =>
                        updateSetting("textColor", e.target.value)
                      }
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Repetitions: {watermarkSettings.repetitions}
                  </label>
                  <input
                    type="range"
                    value={watermarkSettings.repetitions}
                    onChange={(e) =>
                      updateSetting("repetitions", Number(e.target.value))
                    }
                    min="1"
                    max="10"
                    step="1"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Opacity: {(watermarkSettings.opacity * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    value={watermarkSettings.opacity * 100}
                    onChange={(e) =>
                      updateSetting("opacity", Number(e.target.value) / 100)
                    }
                    min="10"
                    max="100"
                    step="1"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Rotation: {watermarkSettings.rotation}°
                  </label>
                  <input
                    type="range"
                    value={watermarkSettings.rotation}
                    onChange={(e) =>
                      updateSetting("rotation", Number(e.target.value))
                    }
                    min="0"
                    max="360"
                    step="5"
                    className="w-full"
                  />
                </div>

                {/* Download button */}
                {(batchMode ? images.length > 0 : previewImage) && (
                  <button
                    onClick={downloadImages}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    {batchMode
                      ? `Download ${images.length} ${
                          images.length === 1 ? "Image" : "Images"
                        }`
                      : "Download Image"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatermarkEditor;
