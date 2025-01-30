"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faMapMarkerAlt,
  faServer,
  faBuilding,
  faNetworkWired,
  faDesktop,
  faExpandArrowsAlt,
  faCode,
  faCookie,
} from "@fortawesome/free-solid-svg-icons";
import LoadingCircle from "@/components/LoadingCircle";

// Move all marker icon setup into useEffect
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center mb-2">
    <FontAwesomeIcon icon={icon} className="text-blue-400 mr-2" />
    <span className="font-semibold mr-2">{label}:</span>
    <span>{value}</span>
  </div>
);

const IPLocationMap = () => {
  const [ipInfo, setIpInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [browserInfo, setBrowserInfo] = useState({
    platform: "",
    userAgent: "",
    screenSize: "",
  });

  useEffect(() => {
    // Set up marker icons
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });

    // Set browser info
    setBrowserInfo({
      platform: window.navigator.platform,
      userAgent: window.navigator.userAgent,
      screenSize: `${window.screen.width}px X ${window.screen.height}px`,
    });
  }, []);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch IP information");
        }
        return response.json();
      })
      .then((data) => {
        setIpInfo(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingCircle />;
  }

  if (error) {
    return (
      <div className="text-center p-8 pt-32 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="p-8 pt-32 bg-black text-white">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-blue-400">
          IP Address Details
        </h1>

        {ipInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <InfoItem icon={faGlobe} label="IPv4" value={ipInfo.ip} />
              <InfoItem
                icon={faMapMarkerAlt}
                label="Location"
                value={`${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country_name}`}
              />
              <InfoItem
                icon={faServer}
                label="Host Name"
                value={ipInfo.hostname || "Not available"}
              />
              <InfoItem
                icon={faBuilding}
                label="ISP"
                value={ipInfo.org || "Not available"}
              />
              <InfoItem
                icon={faNetworkWired}
                label="Proxy"
                value={ipInfo.proxy ? "Detected" : "Not Detected"}
              />
              <InfoItem
                icon={faDesktop}
                label="Platform"
                value={browserInfo.platform}
              />
            </div>
            <div>
              <InfoItem icon={faGlobe} label="IPv6" value="Not Detected" />
              <InfoItem
                icon={faGlobe}
                label="Browser"
                value={browserInfo.userAgent}
              />
              <InfoItem
                icon={faExpandArrowsAlt}
                label="Screen Size"
                value={browserInfo.screenSize}
              />
              <InfoItem icon={faCode} label="JavaScript" value="Enabled" />
              <InfoItem icon={faCookie} label="Cookie" value="Enabled" />
            </div>
          </div>
        )}
        {ipInfo && (
          <div className="h-64 mb-6 inset-0 z-0">
            <MapContainer
              center={[ipInfo.latitude, ipInfo.longitude]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              <Marker position={[ipInfo.latitude, ipInfo.longitude]}>
                <Popup>The location used by your internet provider</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPLocationMap;
