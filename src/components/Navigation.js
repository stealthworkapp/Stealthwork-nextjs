"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import useAnalyticsEventTracker from "../hooks/useAnalyticsEventTracker";
import SetmoreBooking from "./SetmoreBooking";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Navigation bar */}
      <nav className="bg-black p-4 text-white fixed w-full z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            StealthWork
          </Link>
          <button onClick={toggleMenu} className="md:hidden">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden md:flex space-x-8">
            {/* Desktop menu items */}
            <Link
              href="/"
              className="hover:text-gray-300 transition duration-300"
              onClick={useAnalyticsEventTracker("home")}
            >
              Home
            </Link>
            <Link
              href="/services"
              className="hover:text-gray-300 transition duration-300"
              onClick={useAnalyticsEventTracker("services")}
            >
              Services
            </Link>
            <Link
              href="/articles"
              className="hover:text-gray-300 transition duration-300"
              onClick={useAnalyticsEventTracker("articles")}
            >
              Articles
            </Link>
            <SetmoreBooking
              className="hover:text-gray-300 transition duration-300"
              content="Book Consultation"
              onClick={useAnalyticsEventTracker("book")}
            />
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center">
          <div className="text-white text-center">
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              <X size={24} />
            </button>
            <nav>
              <ul className="space-y-6">
                <li>
                  <Link
                    href="/"
                    onClick={toggleMenu}
                    className="text-2xl hover:text-gray-300 transition duration-300"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    onClick={toggleMenu}
                    className="text-2xl hover:text-gray-300 transition duration-300"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/articles"
                    onClick={toggleMenu}
                    className="text-2xl hover:text-gray-300 transition duration-300"
                  >
                    Articles
                  </Link>
                </li>
                <li>
                  <SetmoreBooking
                    className="text-2xl hover:text-gray-300 transition duration-300"
                    content="Book Consultation"
                  />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
