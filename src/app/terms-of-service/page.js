// src/app/terms-of-service/page.js
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";

export default function TermsOfService() {
  const lastRevised = "February 19, 2025"; // This should be updated when terms are revised

  // State for table of contents to highlight active section
  const [activeSection, setActiveSection] = useState(null);

  // Update active section based on scroll position
  React.useEffect(() => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  // Table of contents items
  const tableOfContents = [
    { id: "services", title: "Services" },
    { id: "license", title: "License" },
    { id: "company-ip", title: "Company's Intellectual Property" },
    { id: "user-ip", title: "User's Intellectual Property" },
    { id: "user-restrictions", title: "User Restrictions" },
    { id: "payments", title: "Payments" },
    { id: "termination", title: "Termination" },
    { id: "renewals", title: "Renewals, Refunds, and Cancellation" },
    { id: "disclaimer", title: "Disclaimer and Limitation of Liability" },
    { id: "choice-of-law", title: "Choice of Law" },
    { id: "assignment", title: "No Assignment" },
    { id: "warranty", title: "Warranty and Indemnification" },
    { id: "severability", title: "Severability" },
    { id: "joint-venture", title: "No Joint Venture" },
    { id: "notices", title: "Notices" },
    { id: "force-majeure", title: "Force Majeure" },
    { id: "entire-agreement", title: "Entire Agreement" },
  ];

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
                  <BookOpen className="mr-2 text-blue-400" size={20} />
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
                  Stealthwork Terms of Service
                </h1>
                <p className="text-gray-400 mb-8">
                  Last Revised: {lastRevised}
                </p>

                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="mb-8">
                    The following terms and conditions govern the use of the
                    Stealthwork application and services
                    (&quot;Stealthwork&quot;), which have been made available by
                    Stealthwork Inc. (&quot;Company&quot;). By using
                    Stealthwork, you (&quot;User&quot; or &quot;You&quot;)
                    expressly agree to be bound, without modification, to this
                    Terms and Conditions Agreement (&quot;Agreement&quot;). If
                    you do not agree to be bound to this Agreement, you cannot
                    use Stealthwork.
                  </p>

                  <p className="mb-8">
                    Company reserves the right to change this Agreement at any
                    time, at its sole discretion. If Company makes any changes,
                    it will notify Users at the email address provided by each
                    User, and it will post any such changes here. You are
                    responsible for reviewing any such amendments. Your
                    continued use of Stealthwork after the posting of an amended
                    Agreement constitutes your acceptance of any such modified
                    terms.
                  </p>
                </div>
              </div>

              {/* Services Section */}
              <section
                id="services"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Services
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    As long as User has a Paid Subscription to Stealthwork,
                    subject to the terms and conditions of this Agreement, User
                    shall have access to use Stealthwork for the valid dates of
                    User&apos;s Paid Subscription. From time to time, Company
                    may change, modify, or upgrade the functionality or
                    appearance of Stealthwork, which may include the removal of
                    functionality, content, or integrations.
                  </p>
                  <p>
                    Stealthwork may experience downtime for maintenance and
                    upgrades. Company does not and cannot guarantee that User
                    will have continual access or that any particular content
                    will be available at all times.
                  </p>
                  <p>
                    By connecting your accounts to Stealthwork, you agree to be
                    bound by the respective terms of service of those platforms.
                  </p>
                </div>
              </section>

              {/* License Section */}
              <section
                id="license"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  License
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    Subject to the terms and conditions of this Agreement,
                    Company grants User a non-transferable, non-assignable,
                    limited, non-exclusive, revocable license to use Stealthwork
                    only as permitted in this Agreement, for the term of
                    User&apos;s Paid Subscription. The password and login
                    information that is assigned to User must be kept
                    confidential and may only be used by User personally. It may
                    not be shared, given, rented, or assigned to any other
                    persons.
                  </p>
                </div>
              </section>

              {/* Company's Intellectual Property */}
              <section
                id="company-ip"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Company&apos;s Intellectual Property
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    Stealthwork is the property of Company and contains
                    information and data protected by copyright, trademark,
                    trade secret, and other such intellectual property laws.
                    User agrees to abide by all copyright notices and trademark
                    restrictions.
                  </p>
                </div>
              </section>

              {/* User's Intellectual Property */}
              <section
                id="user-ip"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  User&apos;s Intellectual Property
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    User retains all intellectual property rights, including
                    copyrights, over the content posted or transmitted using
                    Stealthwork (&quot;User Content&quot;). You grant Company a
                    non-exclusive, non-transferable (except as stated in this
                    Agreement), worldwide, non-sublicensable, limited license to
                    access, use, reproduce, electronically distribute, transmit,
                    perform, format, display, store, archive, and index User
                    Content for the purpose of your use of Stealthwork.
                  </p>
                </div>
              </section>

              {/* User Restrictions */}
              <section
                id="user-restrictions"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  User Restrictions
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>User may not and may not allow others to:</p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>
                      Sell, rent, lease, license, sublicense, or assign use of
                      Stealthwork to others.
                    </li>
                    <li>
                      Reverse engineer, decompile, disassemble, or otherwise
                      derive the source code from Stealthwork.
                    </li>
                    <li>
                      Alter, modify, adapt, reconfigure, or prepare derivative
                      works of Stealthwork.
                    </li>
                    <li>
                      Copy, extract, summarize, distribute, or otherwise use
                      Stealthwork in any manner which competes with
                      Company&apos;s services.
                    </li>
                    <li>
                      Use Stealthwork to violate any applicable laws or
                      regulations.
                    </li>
                    <li>
                      Use Stealthwork to abuse, defame, harass, threaten, or
                      post illegal content.
                    </li>
                    <li>
                      Use Stealthwork to transmit malware, hacks, or any harmful
                      content.
                    </li>
                    <li>
                      Use Stealthwork to gain unauthorized access to Stealthwork
                      systems or other third-party platforms.
                    </li>
                    <li>
                      Post content that infringes upon the intellectual property
                      rights of others.
                    </li>
                  </ol>
                  <p className="mt-4">
                    User must promptly notify Company if their Stealthwork
                    account has been subject to a security breach.
                  </p>
                </div>
              </section>

              {/* Payments */}
              <section
                id="payments"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Payments
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    Monthly subscriptions may be paid via credit card or other
                    accepted payment methods. Overdue amounts, including bounced
                    payments or chargebacks, will be assessed a late payment
                    charge at a monthly rate of 10% or the maximum provided by
                    law, whichever is less. Company shall have the right to
                    recover expenses, including collection costs and reasonable
                    attorney&apos;s fees incurred in collecting overdue amounts.
                  </p>
                </div>
              </section>

              {/* Termination */}
              <section
                id="termination"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Termination
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    Company reserves the right to terminate this Agreement and
                    User&apos;s rights hereunder at its sole discretion. Upon
                    termination, User will no longer have access to Stealthwork
                    services, and all sums paid by User shall be retained by
                    Company.
                  </p>
                </div>
              </section>

              {/* Renewals, Refunds, and Cancellation */}
              <section
                id="renewals"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Renewals, Refunds, and Cancellation
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    After your free trial expires, User must choose a
                    subscription plan and enter payment details. Subscriptions
                    automatically renew each month or year. You may cancel your
                    subscription at any time, and you will no longer be charged
                    going forward. Subscriptions are not subject to refunds.
                  </p>
                </div>
              </section>

              {/* Disclaimer and Limitation of Liability */}
              <section
                id="disclaimer"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Disclaimer and Limitation of Liability
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="uppercase">
                    To the extent allowed by law, company does not make any
                    warranty regarding stealthwork, including, but not limited
                    to, the materials, the software, the content, or any
                    services or products provided through or in connection with
                    stealthwork. stealthwork is licensed to user
                    &quot;as-is&quot; and &quot;as-available,&quot; without any
                    warranty of any nature, express or implied.
                  </p>
                  <p className="uppercase mt-4">
                    In no event will company, its subsidiaries, affiliates,
                    employees, or agents be liable to user for any damages or
                    losses, including indirect, consequential, special,
                    incidental, or punitive damages resulting from or caused by
                    stealthwork.
                  </p>
                  <p className="mt-4">
                    Any liability of Company shall be strictly limited to the
                    amount paid to Company by or on behalf of User in the three
                    (3) months prior to the claimed injury or damage.
                  </p>
                </div>
              </section>

              {/* Choice of Law */}
              <section
                id="choice-of-law"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Choice of Law
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    This Agreement shall be governed by and construed in
                    accordance with the laws of the State of Delaware, without
                    regard to its conflict of law provisions.
                  </p>
                </div>
              </section>

              {/* No Assignment */}
              <section
                id="assignment"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  No Assignment
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    The licenses and passwords granted to User under this
                    Agreement are personal and may not be assigned, sublicensed,
                    or transferred without Company&apos;s prior written consent.
                  </p>
                </div>
              </section>

              {/* Warranty and Indemnification */}
              <section
                id="warranty"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Warranty and Indemnification
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    User represents and warrants that they will not use
                    Stealthwork to post or distribute content that infringes on
                    the rights of others or violates any applicable laws. User
                    agrees to indemnify Company against any claims or damages
                    arising from their use of Stealthwork.
                  </p>
                </div>
              </section>

              {/* Severability */}
              <section
                id="severability"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Severability
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    If any provision of this Agreement is held to be invalid,
                    illegal, or unenforceable, the validity, legality, or
                    enforceability of the remainder of this Agreement shall not
                    be affected.
                  </p>
                </div>
              </section>

              {/* No Joint Venture */}
              <section
                id="joint-venture"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  No Joint Venture
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    Nothing in this Agreement shall be construed to place the
                    parties in a partnership or joint venture. The parties are
                    not authorized to obligate or bind each other.
                  </p>
                </div>
              </section>

              {/* Notices */}
              <section
                id="notices"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Notices
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    Company may provide notices to Users via email or
                    notifications within Stealthwork.
                  </p>
                </div>
              </section>

              {/* Force Majeure */}
              <section
                id="force-majeure"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Force Majeure
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    Neither party shall be liable for any failure or delay in
                    performance due to circumstances beyond its control,
                    including but not limited to acts of God, strikes, or
                    governmental regulations.
                  </p>
                </div>
              </section>

              {/* Entire Agreement */}
              <section
                id="entire-agreement"
                className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                  Entire Agreement
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    This Agreement constitutes the entire agreement between the
                    parties and supersedes all prior agreements. This Agreement
                    may only be modified by a written instrument executed by a
                    corporate officer of Company.
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
