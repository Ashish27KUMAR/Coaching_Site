import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TopBar() {
  const announcementText =
    "🎉 Welcome Dear Students! Join our expert coaching for JEE/NEET/Class 10-12 success | Limited seats in new batches | Enroll now & achieve your dreams! 🎉";

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const randomOffset = Math.random() * 50 + 50; // 50% to 100%
    setOffset(randomOffset);
  }, []);

  return (
    <div className="bg-gray-900 text-gray-300 text-sm border-b border-gray-800">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Desktop layout - unchanged */}
        <div className="hidden md:flex flex-row justify-between items-center py-3">
          {/* Left - Contact Info */}
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>+91 99311 90218</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>sunil@gmail.com</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Mon-Sat: 8:00 AM - 3:00 PM</span>
            </div> */}
          </div>

          {/* Center - Marquee */}
          <div className="flex-1 mx-8 overflow-hidden relative">
            <div
              className="flex"
              style={{ transform: `translateX(-${offset}%)` }}
            >
              <div className="animate-marquee whitespace-nowrap flex items-center">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="mx-4">
                    {announcementText}{" "}
                    <span className="mx-4 text-gray-600">|</span>
                  </span>
                ))}
              </div>
              <div
                className="animate-marquee whitespace-nowrap flex items-center"
                aria-hidden="true"
              >
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="mx-4">
                    {announcementText}{" "}
                    <span className="mx-4 text-gray-600">|</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Buttons */}
          <div className="flex gap-4">
            {/* Line 2 - Days & Timing */}
            <div className="flex items-center gap-2 text-center">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Mon-Sat: 8:00 AM - 3:00 PM</span>
            </div>
            <Link
              to="/login"
              className="border border-gray-600 hover:border-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Login
            </Link>
            {/* <Link
              to="/admission"
              className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2 rounded-md font-semibold transition-colors duration-200"
            >
              Register
            </Link> */}
          </div>
        </div>

        {/* Small device layout */}
        <div className="flex flex-col items-center gap-2 md:hidden py-3">
          {/* Line 1 - Phone & Email same line */}
          <div className="flex flex-wrap gap-4 justify-center items-center text-center">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>+91 99311 90218</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>sunil@gmail.com</span>
            </div>
          </div>

          {/* Line 2 - Days & Timing */}
          <div className="flex items-center gap-2 text-center">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Mon-Sat: 8:00 AM - 3:00 PM</span>
          </div>

          {/* Line 3 - Buttons */}
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="border border-gray-600 hover:border-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Login
            </Link>
            {/* <Link
              to="/admission"
              className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2 rounded-md font-semibold transition-colors duration-200"
            >
              Register
            </Link> */}
          </div>

          {/* Line 4 - Marquee */}
          <div className="overflow-hidden w-full mt-2">
            <div
              className="flex"
              style={{ transform: `translateX(-${offset}%)` }}
            >
              <div className="animate-marquee whitespace-nowrap flex justify-center items-center gap-4">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-center">
                    {announcementText} <span className="text-gray-600">|</span>
                  </span>
                ))}
              </div>
              <div
                className="animate-marquee whitespace-nowrap flex justify-center items-center gap-4"
                aria-hidden="true"
              >
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-center">
                    {announcementText} <span className="text-gray-600">|</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 35s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
