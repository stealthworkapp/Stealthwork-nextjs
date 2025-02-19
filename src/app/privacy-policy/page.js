// src/app/privacy-policy/page.js
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";

export default function PrivacyPolicy() {
  const lastRevised = "February 19, 2025"; // Update when policy is revised

  // State for table of contents to highlight active section
  const [activeSection, setActiveSection] = useState(null);

  // Table of contents items
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tableOfContents = [
    { id: "children", title: "Children's Privacy" },
    { id: "information", title: "Information We Collect" },
    { id: "third-party-actions", title: "Third-Party Actions" },
    { id: "third-party-service", title: "Third-Party Service Integration" },
    { id: "data-retention", title: "Data Retention" },
    { id: "cookies", title: "Cookies" },
    { id: "ip-addresses", title: "IP Addresses" },
    { id: "third-party-websites", title: "Third-Party Web Sites" },
    { id: "data-security", title: "Commitment to Data Security" },
    {
      id: "security-vulnerabilities",
      title: "Reporting Security Vulnerabilities",
    },
    { id: "contacting", title: "Contacting Us" },
  ];

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for header

      // Find the section that's currently in view
      const currentSection = tableOfContents
        .map((item) => ({
          id: item.id,
          offset: document.getElementById(item.id)?.offsetTop || 0,
        }))
        .sort((a, b) => a.offset - b.offset)
        .find((item) => item.offset > scrollPosition) || {
        id: tableOfContents[tableOfContents.length - 1].id,
      };

      if (currentSection.id !== activeSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeSection, tableOfContents]);

  // Handle scroll to section and highlight in table of contents
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -130; // Account for fixed header with extra space
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar - Table of Contents */}
            <aside className="lg:w-1/4 hidden lg:block">
              <div className="sticky top-32 bg-gray-900 p-6 rounded-lg shadow-lg max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                <div className="mb-6 flex items-center">
                  <Shield className="mr-2 text-blue-400" size={20} />
                  <h3 className="text-lg font-semibold">Table of Contents</h3>
                </div>
                <nav>
                  <ul className="space-y-3">
                    {tableOfContents.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-left hover:text-blue-400 transition-colors ${
                            activeSection === item.id
                              ? "text-blue-400 font-medium"
                              : "text-gray-300"
                          }`}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <main className="lg:w-3/4">
              <div className="bg-gray-900 rounded-lg shadow-xl p-8 mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
                  Stealthwork Privacy Policy
                </h1>
                <p className="text-gray-400 mb-8">
                  Last Revised: {lastRevised}
                </p>

                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="mb-4">
                    Thank you for visiting the Stealthwork web site. You arrived
                    at this Privacy Policy page from one of the
                    Stealthwork-related sites, referred to herein as &quot;this
                    web site.&quot;
                  </p>

                  <p className="mb-4">
                    This Privacy Policy is subject to change by Stealthwork Inc.
                    (hereinafter &quot;Company&quot;) at any time and at our
                    discretion without notice by updating this posting.
                  </p>

                  <p className="mb-4">
                    We understand the importance that Internet users place on
                    privacy, and this Privacy Policy describes how we use
                    personal information that is collected at our web sites.
                  </p>

                  <p className="mb-4">
                    Please read this Privacy Policy before using this web site
                    or submitting any personal information.
                  </p>

                  <p className="mb-8">
                    By using this web site, you accept the privacy practices
                    contained in this Privacy Policy. You are encouraged to
                    review the Privacy Policy whenever you visit the web site to
                    make sure you understand how any personal information you
                    provide will be used.
                  </p>
                </div>
              </div>

              {/* Children's Privacy */}
              <section
                id="children"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Children&apos;s Privacy
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    We take children&apos;s privacy very seriously. Our Terms &
                    Conditions only allow this web site to be accessed by
                    persons eighteen (18) years or older. Due to the age
                    restrictions of this web site, none of the information
                    obtained by this web site falls within the Child Online
                    Privacy Protection Act (COPPA).
                  </p>
                </div>
              </section>

              {/* Information We Collect */}
              <section
                id="information"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Information We Collect
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="mb-4">
                    To serve our customers, we collect personally identifiable
                    information, such as names, addresses, phone numbers, email
                    addresses, and sometimes payment information when such
                    information is voluntarily submitted by our visitors. We
                    will only use your personal information for the following
                    purposes:
                  </p>
                  <ol className="list-decimal pl-6 mb-6 space-y-2">
                    <li>
                      To deliver the products and/or services to you that you
                      have requested.
                    </li>
                    <li>
                      To validate your compliance with the terms and conditions.
                    </li>
                    <li>For content improvement and feedback purposes.</li>
                    <li>
                      To reach you when necessary regarding your use of the web
                      site or services.
                    </li>
                  </ol>
                  <p className="mb-4">
                    We may disclose personally identifiable information
                    collected if we have received your permission beforehand
                    (such as to fulfill a third-party order) or in special
                    circumstances, such as when required by law or other
                    necessary cases.
                  </p>
                  <p className="mb-4">
                    We may also periodically conduct surveys of our subscribers
                    and customers to improve our services.
                  </p>
                  <p className="mb-4">
                    By submitting your email address on this web site, you agree
                    to receive emails from us. You may opt out at any time by
                    clicking the unsubscribe link included in emails. We do not
                    send unsolicited commercial emails.
                  </p>
                  <p>
                    By submitting your telephone contact information on this web
                    site and/or registering for a product or service, you
                    consent to receiving calls under applicable telemarketing
                    laws.
                  </p>
                </div>
              </section>

              {/* Third-Party Actions */}
              <section
                id="third-party-actions"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Third-Party Actions
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    We do not control and are not liable for the actions of any
                    third parties that we may promote. While we work with
                    quality companies, we have no control over their actions.
                    You may provide feedback on third-party experiences to
                    improve our services.
                  </p>
                </div>
              </section>

              {/* Third-Party Service Integration */}
              <section
                id="third-party-service"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Third-Party Service Integration
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="mb-4">
                    To provide services, we may integrate with third-party
                    platforms and require access to certain account data. Any
                    credentials stored are encrypted and used solely for the
                    intended purpose.
                  </p>
                  <p className="mb-4">
                    <strong>Google Drive Integration</strong>: When you connect
                    Google Drive, we only access files you specify. No other
                    files or folders are accessed or stored.
                  </p>
                  <p className="mb-4">
                    <strong>YouTube Integration</strong> (using YouTube API
                    services): When you connect YouTube, we only access the
                    necessary data to manage your content as requested. No
                    additional data is stored or accessed.
                  </p>
                  <p className="mb-4">
                    Learn more about Google&apos;s Privacy Policy at{" "}
                    <a
                      href="http://www.google.com/policies/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      http://www.google.com/policies/privacy
                    </a>
                  </p>
                  <p>
                    To revoke Stealthwork from accessing your YouTube account,
                    visit{" "}
                    <a
                      href="https://security.google.com/settings/security/permissions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Google Security Settings
                    </a>
                  </p>
                </div>
              </section>

              {/* Data Retention */}
              <section
                id="data-retention"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Data Retention
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    We retain your personal data only for the period necessary
                    to fulfill the purposes outlined in this Privacy Policy
                    unless a longer retention period is required by law. You may
                    delete your account and data by visiting your account
                    settings.
                  </p>
                </div>
              </section>

              {/* Cookies */}
              <section
                id="cookies"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Cookies
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    We may use cookies to deliver content specific to your
                    interests and enhance your experience. Cookies are text
                    files stored by your web browser to manage preferences.
                  </p>
                </div>
              </section>

              {/* IP Addresses */}
              <section
                id="ip-addresses"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  IP Addresses
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    We may use your IP address for security, fraud prevention,
                    and demographic analysis to improve our services.
                  </p>
                </div>
              </section>

              {/* Third-Party Web Sites */}
              <section
                id="third-party-websites"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Third-Party Web Sites
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    This web site may contain links to third-party web sites. We
                    are not responsible for their content or privacy practices.
                  </p>
                </div>
              </section>

              {/* Commitment to Data Security */}
              <section
                id="data-security"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Commitment to Data Security
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    All collected information is stored in a secure environment.
                    We use SSL encryption and take reasonable security measures,
                    but we cannot guarantee absolute security of transmitted
                    data.
                  </p>
                </div>
              </section>

              {/* Reporting Security Vulnerabilities */}
              <section
                id="security-vulnerabilities"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Reporting Security Vulnerabilities
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    If you discover a security vulnerability, please contact us
                    immediately. You can email us at{" "}
                    <a
                      href="mailto:support@stealthwork.app"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      support@stealthwork.app
                    </a>
                    .
                  </p>
                </div>
              </section>

              {/* Contacting Us */}
              <section
                id="contacting"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Contacting Us
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="mb-4">
                    If you need to contact us, email us at{" "}
                    <a
                      href="mailto:support@stealthwork.app"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      support@stealthwork.app
                    </a>
                    .
                  </p>
                  <p>
                    We strive to provide excellent services along with equally
                    excellent customer support. If you have any questions about
                    this Privacy Policy, please contact us.
                  </p>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
