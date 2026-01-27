import { useEffect, useState, useRef } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowDown,
  FiArrowUpLeft,
  FiArrowUpRight,
} from "react-icons/fi";

import banner1 from "../assets/Banner/Class_ad.png";
import banner2 from "../assets/Banner/Sunil_sir.png";

import student1Img from "../assets/Hero_flow/Student1.png";
import student2Img from "../assets/Hero_flow/Student2.png";
import student3Img from "../assets/Hero_flow/Student3.png";

import { motion } from "framer-motion";

export default function Hero() {
  const banners = [banner1, banner2];
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  // Auto Slide
  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
  };

  const stopAutoSlide = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <>
      {/* ================= BANNER SLIDER (UNCHANGED) ================= */}
      <div
        className="relative w-full overflow-hidden bg-black aspect-[16/3] max-h-[360px]"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {banners.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Banner ${i}`}
              className="w-full h-full object-contain flex-shrink-0"
            />
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-white hover:text-blue-400 transition"
        >
          <FiChevronLeft size={36} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-white hover:text-blue-400 transition"
        >
          <FiChevronRight size={36} />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <span
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full cursor-pointer transition ${
                i === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ================= HERO CONTENT ================= */}
      <section className="relative bg-blue-50 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-14">
          {/* LEFT TEXT */}
          <div>
            <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold">
              LEARNING COURSE
            </span>

            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              DCA <br />
              <span className="text-blue-600">Feels Like Real Classroom</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-lg">
              Get certified, gain job-ready skills and build your future with
              expert guidance and practical learning.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-lg transition">
                Get Started
              </button>

              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg transition">
                Our Courses
              </button>
            </div>
          </div>

          {/* PW STYLE DASHED SYSTEM */}
          <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
            {/* DASHED CIRCLES (Background) */}
            <div className="absolute w-[320px] h-[320px] border border-dashed border-slate-300 rounded-full opacity-50"></div>
            <div className="absolute w-[440px] h-[440px] border border-dashed border-slate-200 rounded-full opacity-30"></div>

            {/* CENTER DCA LOGO */}
            <div className="relative z-20">
              <div className="w-24 h-24 bg-blue-600 text-white flex items-center justify-center rounded-full shadow-2xl text-2xl font-black border-4 border-white">
                DCA
              </div>
              {/* Decorative dots around center */}
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white"></span>
            </div>

            {/* FIXED POSITION ELEMENTS */}
            {/* Student 1 - Top Right Area */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }} // Gentle Floating
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-[15%] flex flex-col items-center z-10"
            >
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={student1Img}
                    className="w-full h-full object-cover"
                    alt="Student"
                  />
                </div>
                {/* Speech Bubble */}
                <div className="absolute -left-32 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-2xl shadow-lg border border-slate-100 text-slate-700 text-xs font-bold whitespace-nowrap">
                  Sir, DCA kya hai?
                  <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-slate-100"></div>
                </div>
              </div>
            </motion.div>

            {/* Student 2 - Bottom Left Area */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, 10, 0] }} // Gentle Floating
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-10 left-[15%] flex flex-col items-center z-10"
            >
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={student2Img}
                    className="w-full h-full object-cover"
                    alt="Teacher"
                  />
                </div>
                {/* Speech Bubble */}
                <div className="absolute -right-44 top-1/2 -translate-y-1/2 bg-blue-900 text-white px-4 py-2 rounded-2xl shadow-lg text-xs font-medium max-w-[160px] leading-relaxed">
                  DCA ek aisi jagah hai jahan aap guidance ke saath grow karte
                  ho ❤️
                  <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-900 rotate-45"></div>
                </div>
              </div>
            </motion.div>

            {/* ORBITING DOTS (Static but placed on circles) */}
            <div className="absolute top-[20%] left-[30%] w-3 h-3 bg-blue-400 rounded-full shadow-sm"></div>
            <div className="absolute bottom-[30%] right-[25%] w-3 h-3 bg-red-400 rounded-full shadow-sm"></div>
            <div className="absolute top-[50%] right-[10%] w-2 h-2 bg-purple-400 rounded-full shadow-sm"></div>
          </div>
        </div>
      </section>
    </>
  );
}
