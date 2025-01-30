'use client'
import React from "react";
import { MapPin, Activity } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";

const FreeTools = () => (
  <div className="p-8 pt-32 bg-black text-white" id="free-tools-container">
    <h2 className="text-4xl font-bold mb-12 text-center" id="free-tools-title">
      Free Tools
    </h2>

    <section className="mb-16" id="free-tools-grid">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <ServiceCard
          icon={MapPin}
          title="IP Location"
          description="Get detailed information about your current IP address and geolocation."
          link="/ip-location"
        />
        <ServiceCard
          icon={Activity}
          title="Internet Speed Test"
          description="Measure your internet connection's speed and performance with our comprehensive test."
          link="/speedtest"
        />
      </div>
    </section>
  </div>
);

export default FreeTools;
