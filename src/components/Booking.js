import React, { useState, useEffect } from "react";
import { Shield, Globe, DollarSign } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, formatInTimeZone, toDate } from "date-fns-tz";
import { parseISO } from "date-fns";

const API_BASE_URL = "https://developer.setmore.com/api/v1";
const TIMEZONE = "America/New_York"; // Setmore's timezone
const LOCAL_TIMEZONE = "Asia/Tokyo"; // Your local timezone

const Booking = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [staffKey, setStaffKey] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (currentPage === "booking") {
      handleAuthentication();
    }
  }, [currentPage]);

  const handleAuthentication = async () => {
    try {
      const token = await fetchAccessToken();
      if (token) {
        setAccessToken(token);
        fetchServices(token);
        fetchStaff(token);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthError("Failed to authenticate. Please try again later.");
    }
  };

  const fetchAccessToken = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/o/oauth2/token?refreshToken=YOUR_REFRESH_TOKEN`
      );
      const data = await response.json();
      if (data.response && data.data && data.data.token) {
        return data.data.token.access_token;
      } else if (data.error === "invalid_refresh_token") {
        throw new Error("Invalid refresh token. Please obtain a new one.");
      } else {
        throw new Error("Failed to fetch access token");
      }
    } catch (error) {
      console.error("Error fetching access token:", error);
      setAuthError(error.message);
      return null;
    }
  };

  const fetchServices = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookingapi/services`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.response && data.data && data.data.services) {
        setServices(data.data.services);
      } else {
        throw new Error("Failed to fetch services");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setAuthError("Failed to fetch services. Please try again later.");
    }
  };

  const fetchStaff = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookingapi/staffs`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (
        data.response &&
        data.data &&
        data.data.staffs &&
        data.data.staffs.length > 0
      ) {
        setStaffKey(data.data.staffs[0].key);
      } else {
        throw new Error("Failed to fetch staff");
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      setAuthError(
        "Failed to fetch staff information. Please try again later."
      );
    }
  };

  const fetchAvailableSlots = async (serviceKey, date) => {
    if (!staffKey || !accessToken) return;

    const formattedDate = formatInTimeZone(date, TIMEZONE, "dd/MM/yyyy");
    try {
      const response = await fetch(`${API_BASE_URL}/bookingapi/slots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          staff_key: staffKey,
          service_key: serviceKey,
          selected_date: formattedDate,
          timezone: TIMEZONE,
        }),
      });
      const data = await response.json();
      if (data.response && data.data) {
        const localSlots = data.data.map((slot) => {
          const [hours, minutes] = slot.split(".");
          const slotDate = new Date(date);
          slotDate.setHours(parseInt(hours), parseInt(minutes));
          return formatInTimeZone(slotDate, LOCAL_TIMEZONE, "HH:mm");
        });
        setAvailableSlots(localSlots);
      } else {
        throw new Error("Failed to fetch available slots");
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setAuthError("Failed to fetch available slots. Please try again.");
    }
  };

  const createAppointment = async () => {
    if (
      !selectedService ||
      !selectedDate ||
      !selectedSlot ||
      !staffKey ||
      !accessToken
    )
      return;

    const [hours, minutes] = selectedSlot.split(":");
    const localDateTime = new Date(selectedDate);
    localDateTime.setHours(parseInt(hours), parseInt(minutes));

    const startTime = formatInTimeZone(
      localDateTime,
      TIMEZONE,
      "yyyy-MM-dd'T'HH:mm:ssXXX"
    );
    const endTime = formatInTimeZone(
      new Date(localDateTime.getTime() + selectedService.duration * 60000),
      TIMEZONE,
      "yyyy-MM-dd'T'HH:mm:ssXXX"
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/bookingapi/appointment/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            staff_key: staffKey,
            service_key: selectedService.key,
            customer_key: "CUSTOMER_KEY",
            start_time: startTime,
            end_time: endTime,
            timezone: TIMEZONE,
          }),
        }
      );
      const data = await response.json();
      if (data.response && data.msg === "Appointment created successfully") {
        alert("Appointment booked successfully!");
        setSelectedService(null);
        setSelectedDate(null);
        setSelectedSlot(null);
      } else {
        throw new Error("Failed to create appointment");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      setAuthError("Failed to book appointment. Please try again.");
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedDate(null);
    setAvailableSlots([]);
    setSelectedSlot(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    if (selectedService) {
      fetchAvailableSlots(selectedService.key, date);
    }
  };

  const isDateAvailable = (date) => {
    const day = formatInTimeZone(date, TIMEZONE, "i");
    return parseInt(day) >= 1 && parseInt(day) <= 4; // Monday is 1, Thursday is 4
  };

  return (
    <div className="p-8 pt-32 bg-gray-900 text-gray-100">
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Book a Consultation
      </h2>

      {authError ? (
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-red-500 mb-4">{authError}</p>
          <button
            onClick={handleAuthentication}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Try Again
          </button>
        </div>
      ) : !selectedService ? (
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl mb-4">Select a Service:</h3>
          <div className="space-y-4">
            {services.map((service) => (
              <button
                key={service.key}
                onClick={() => handleServiceSelect(service)}
                className="w-full bg-gray-800 p-4 rounded-lg text-left hover:bg-gray-700 transition duration-300"
              >
                <h4 className="text-xl font-semibold">
                  {service.service_name}
                </h4>
                <p className="text-gray-400">
                  Duration: {service.duration} minutes | Cost: ${service.cost}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl mb-4">Select a Date and Time:</h3>
          <p className="mb-4">Service: {selectedService.service_name}</p>
          <p className="mb-2 text-gray-400">
            Available days: Monday to Thursday
          </p>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateSelect}
            filterDate={isDateAvailable}
            minDate={new Date()}
            inline
            className="bg-gray-800 text-white rounded"
            calendarClassName="bg-gray-800 border-gray-700"
            dayClassName={(date) =>
              isDateAvailable(date)
                ? "text-white hover:bg-blue-500"
                : "text-gray-500"
            }
          />
          {selectedDate && availableSlots.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xl mb-2">Available Slots:</h4>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2 rounded transition duration-300 ${
                      selectedSlot === slot
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
          {selectedSlot && (
            <button
              onClick={createAppointment}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
            >
              Book Appointment
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Booking;
