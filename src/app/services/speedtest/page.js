'use client'
import React, { useState, useEffect } from "react";
import LoadingCircle from "@/components/LoadingCircle";

const SpeedTest = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000); // Simulating load time
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 pt-32 bg-black text-white ">
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-400">
            Speed Test
          </h1>

          <div
            className="speed-test-container flex justify-center items-center"
            style={{ height: "400px" }}
          >
            <iframe
              src="//openspeedtest.com/Get-widget.php"
              className="w-full h-full border-2 border-blue-500 rounded-lg shadow-lg"
              style={{
                filter: "drop-shadow(0 4px 6px rgba(0, 208, 255, 0.5))",
              }}
              title="Speed Test"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedTest;
