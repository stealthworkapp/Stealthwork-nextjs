// src/app/layout.js
import { Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StealthWork - Secure VPN & Remote Access Solutions",
  description:
    "Your trusted partner for VPN solutions, software development, and website consultation. Stay secure, stay connected, stay ahead.",
  keywords:
    "VPN, Remote Access, Cybersecurity, Software Development, Website Consultation, Remote Work Solutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-black`}
        suppressHydrationWarning 
      >
        <Navigation />
        <main className="flex-grow">{children}</main>
        <footer className="bg-black p-4 text-center text-gray-500">
          © {new Date().getFullYear()} StealthWork. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
