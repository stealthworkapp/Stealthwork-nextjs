'use client'
import React, { useState, useEffect } from "react";
import jsonp from "jsonp";
import { X } from "lucide-react";

const NewsletterSignupModal = () => {
  // State to control modal visibility
  const [isVisible, setIsVisible] = useState(false);
  // State to store email input
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Check if the user has seen the modal before
    const hasSeenModal = localStorage.getItem("hasSeenNewsletterModal");
    if (!hasSeenModal) {
      // If not, show the modal after a short delay
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Function to handle form submission
  // Mailchimp custom form instead of their embedded form
  const handleSubmit = (e) => {
    e.preventDefault();
    jsonp(
      `${process.env.REACT_APP_MAILCHIMP_URL}&EMAIL=${email}`,
      { param: "c" },
      (_, data) => {
        console.log("data", data);
        const { msg } = data;

        alert(msg);
      }
    );
    closeModal();
  };

  // Function to close the modal
  const closeModal = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenNewsletterModal", "true");
  };

  if (!isVisible) return null;

  return (
    <div
      id="newsletter-signup-modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        id="newsletter-signup-modal"
        className="bg-gray-900 text-white p-8 rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">
            Stay Updated with StealthWork
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 transition duration-300"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-sm text-white mb-6">
          Sign up for our newsletter to receive the latest articles and updates!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSignupModal;
