'use client'
import Link from "next/link"
import { TextEffect } from '@/components/motion-primitives/text-effect'

export default function HeroSection() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-black to-green-950">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(22,163,74,0.3),transparent_70%)]"></div>

      {/* Navigation */}
      <header className="relative z-10 px-6 py-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-white text-2xl font-bold">
              <img src="/assets/images/HealHunter.svg" alt="HealHunter Logo" className="h-7 w-auto" />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden ml-12 space-x-8 md:flex">
              {["Features", "Docs"].map((item) => (
                <Link
                  key={item}
                  href={item === "Features" ? "#features" : `/${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
            <Link
              href="/login"
              className="px-4 py-2 text-white bg-gray-800 rounded hover:bg-gray-700 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-10 pb-32 mx-auto text-center max-w-7xl">
        <h1 className="max-w-4xl mx-auto text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          An AI-backed all-in-one telehealth SaaS for <TextEffect>preliminary diagnosis</TextEffect>
        </h1>
        <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-300">
          HealHunter’s AI agent generates preliminary diagnoses and sends them directly to specialists, eliminating the
          need for offline visits.
        </p>
        <div className="flex justify-center mt-10">
          <Link
            href="/login"
            className="flex items-center justify-center px-8 py-3 text-lg font-medium text-gray-900 bg-white rounded-md hover:bg-gray-100 transition-colors"
          >
            Input symptoms and upload a photo
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        {/* Problem Solution Section with ID */}
        <div className="w-full mt-20 px-4" id="features">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
            {/* Issues Column */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100/10 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-red-500 font-semibold mb-2">Doctors overload:</h3>
                  <p className="text-gray-300">
                    the workload per general practitioner (GP) in Kazakhstan is{" "}
                    <span className="text-red-500 font-semibold">1,700 people</span> (2023)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-red-100/10 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-red-500 font-bold mb-2">Physical visits required:</h3>
                  <p className="text-gray-300">
                    The need for a <span className="text-red-500 font-bold">physical visit</span> and{" "}
                    <span className="text-red-500 font-bold">long waiting times</span> for an appointment with a doctor to receive
                    a preliminary diagnosis
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-red-100/10 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-red-500 font-semibold mb-2">Self-diagnosis errors:</h3>
                  <p className="text-gray-300">
                    {"> 1/3 of Americans self-diagnose when they encounter"}{" "}
                    <span className="text-red-500 font-bold">health problems</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Center Column with Phone */}
            <div className="flex items-center justify-center">
              <div className="relative mx-auto w-full max-w-[350px]">
                  <div className="h-full w-full pt-1/3">
                    <img
                      src="/assets/images/mobile.svg"
                      alt="HealHunter App Interface"
                      className="w-full h-full object-cover"
                    />
                  </div>
              </div>
            </div>

            {/* Solutions Column */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div>
                  <h3 className="text-green-500 font-semibold mb-2">Simplifying the doctor's work:</h3>
                  <p className="text-gray-300">
                    through remote medical examination and <span className="text-green-500 font-bold">automated booking</span> to
                    a specialist
                  </p>
                </div>
                <div className="bg-green-100/10 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div>
                  <h3 className="text-green-500 font-semibold mb-2">Saving time:</h3>
                  <p className="text-gray-300">1 examination in 3 minutes.</p>
                  <p className="text-gray-300">
                    <span className="text-green-500 font-bold">Legitimacy</span> of the session without an offline visit to the
                    doctor.
                  </p>
                </div>
                <div className="bg-green-100/10 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div>
                  <h3 className="text-green-500 font-semibold mb-2">High-quality health analytics:</h3>
                  <p className="text-gray-300">
                    through <span className="text-green-500 font-bold">end-to-end support</span> and{" "}
                    <span className="text-green-500 font-bold">built-in advice</span> from the{" "}
                    <span className="text-green-500 font-bold">AI agent</span>
                  </p>
                </div>
                <div className="bg-green-100/10 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}