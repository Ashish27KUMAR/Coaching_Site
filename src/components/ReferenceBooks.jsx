import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronDown,
  FiStar,
  FiDownload,
  FiExternalLink,
  FiBookOpen,
} from "react-icons/fi";

const data = {
  CBSE: {
    activeBg: "bg-blue-600 shadow-blue-200",
    accent: "text-blue-600",
    bg: "bg-blue-50",
    subjects: {
      Mathematics: [
        { name: "RD Sharma Class 10", rating: 4.8, pdf: "#", link: "#" },
        { name: "NCERT Exemplar", rating: 4.7, pdf: "#", link: "#" },
        { name: "RS Aggarwal Mathematics", rating: 4.6, pdf: "#", link: "#" },
      ],
      Physics: [
        {
          name: "H.C. Verma (Concepts of Physics)",
          rating: 4.9,
          pdf: "#",
          link: "#",
        },
        {
          name: "S. Chand Physics (Lakhmir Singh)",
          rating: 4.5,
          pdf: "#",
          link: "#",
        },
        { name: "SL Arora New Simplified", rating: 4.7, pdf: "#", link: "#" },
      ],
      Chemistry: [
        { name: "Together With Chemistry", rating: 4.6, pdf: "#", link: "#" },
        {
          name: "Pradeep's New Course Chemistry",
          rating: 4.7,
          pdf: "#",
          link: "#",
        },
        {
          name: "O.P. Tandon Physical Chemistry",
          rating: 4.8,
          pdf: "#",
          link: "#",
        },
      ],
      Biology: [
        {
          name: "Trueman's Elementary Biology",
          rating: 4.8,
          pdf: "#",
          link: "#",
        },
        { name: "Dinesh Companion Biology", rating: 4.5, pdf: "#", link: "#" },
      ],
      English: [
        {
          name: "Wren & Martin (High School)",
          rating: 4.9,
          pdf: "#",
          link: "#",
        },
        { name: "All In One English Core", rating: 4.6, pdf: "#", link: "#" },
      ],
      Hindi: [
        { name: "NCERT Kshitij Bhag 2", rating: 4.5, pdf: "#", link: "#" },
        { name: "Manak Hindi Vyakaran", rating: 4.4, pdf: "#", link: "#" },
      ],
    },
  },
  ICSE: {
    activeBg: "bg-emerald-600 shadow-emerald-200",
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
    subjects: {
      Mathematics: [
        {
          name: "M.L. Aggarwal (Understanding ICSE)",
          rating: 4.8,
          pdf: "#",
          link: "#",
        },
        {
          name: "Selina Concise Mathematics",
          rating: 4.7,
          pdf: "#",
          link: "#",
        },
      ],
      Physics: [
        { name: "Selina Concise Physics", rating: 4.8, pdf: "#", link: "#" },
        { name: "S. Chand's ICSE Physics", rating: 4.5, pdf: "#", link: "#" },
      ],
      Chemistry: [
        { name: "Selina Concise Chemistry", rating: 4.7, pdf: "#", link: "#" },
        {
          name: "Dalal Simplified ICSE Chemistry",
          rating: 4.9,
          pdf: "#",
          link: "#",
        },
      ],
      Biology: [
        { name: "Selina Concise Biology", rating: 4.8, pdf: "#", link: "#" },
        { name: "S. Chand Biology for ICSE", rating: 4.6, pdf: "#", link: "#" },
      ],
      English: [
        {
          name: "Treasure Trove - A Collection of Poems",
          rating: 4.7,
          pdf: "#",
          link: "#",
        },
        {
          name: "Merchant of Venice (Morning Star)",
          rating: 4.8,
          pdf: "#",
          link: "#",
        },
      ],
      Hindi: [
        { name: "Sahitya Sagar", rating: 4.5, pdf: "#", link: "#" },
        { name: "Saras Hindi Vyakaran", rating: 4.6, pdf: "#", link: "#" },
      ],
    },
  },
  BSEB: {
    activeBg: "bg-amber-600 shadow-amber-200",
    accent: "text-amber-600",
    bg: "bg-amber-50",
    subjects: {
      Mathematics: [
        { name: "K.C. Sinha Mathematics", rating: 4.8, pdf: "#", link: "#" },
        {
          name: "BSEB Target Objective Maths",
          rating: 4.4,
          pdf: "#",
          link: "#",
        },
        { name: "NCERT Ganit Class 10", rating: 4.6, pdf: "#", link: "#" },
      ],
      Physics: [
        { name: "Bharti Bhawan Physics", rating: 4.7, pdf: "#", link: "#" },
        { name: "Alok Physics Guide", rating: 4.3, pdf: "#", link: "#" },
      ],
      Chemistry: [
        { name: "Bharti Bhawan Chemistry", rating: 4.6, pdf: "#", link: "#" },
        { name: "Golden Chemistry Guide", rating: 4.4, pdf: "#", link: "#" },
      ],
      Biology: [
        { name: "Bharti Bhawan Biology", rating: 4.7, pdf: "#", link: "#" },
        {
          name: "BSEB Biology Question Bank",
          rating: 4.2,
          pdf: "#",
          link: "#",
        },
      ],
      English: [
        { name: "Panorama English Reader", rating: 4.3, pdf: "#", link: "#" },
        { name: "Rainbow English Part II", rating: 4.5, pdf: "#", link: "#" },
      ],
      Hindi: [
        { name: "Godhuli Hindi Bhag 2", rating: 4.6, pdf: "#", link: "#" },
        { name: "Hindi Vyakaran (Barnwal)", rating: 4.4, pdf: "#", link: "#" },
      ],
    },
  },
};

export default function ReferenceBooks() {
  const [openBoard, setOpenBoard] = useState("CBSE");
  const [activeSubject, setActiveSubject] = useState(null);
  const dropdownRef = useRef(null);

  // Outside click logic
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveSubject(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="bg-slate-50 pt-16 pb-12 font-sans overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
            Study <span className="text-blue-600">Resources</span>
          </h2>
          <h2 className="text-center text-gray-600 mt-6 max-w-2xl mx-auto italic">
            Explore Our Collection of Expert-Recommended Reference Books,
            Specially Selected to Help You Learn Better and Faster.
          </h2>
        </div>

        {/* Board Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {Object.entries(data).map(([board, config]) => (
            <button
              key={board}
              onClick={() => {
                setOpenBoard(board);
                setActiveSubject(null);
              }}
              className={`px-7 py-3 rounded-xl font-bold transition-all duration-300 ${
                openBoard === board
                  ? `${config.activeBg} text-white shadow-lg scale-105`
                  : "bg-white text-slate-500 hover:bg-slate-200"
              }`}
            >
              {board} Board
            </button>
          ))}
        </div>

        {/* Dynamic Content Area */}
        <div className="space-y-3" ref={dropdownRef}>
          {Object.entries(data[openBoard].subjects).map(([subject, books]) => (
            <div
              key={subject}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
            >
              <button
                onClick={() =>
                  setActiveSubject(activeSubject === subject ? null : subject)
                }
                className="w-full flex justify-between items-center px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${data[openBoard].bg} ${data[openBoard].accent}`}
                  >
                    <FiBookOpen size={18} />
                  </div>
                  <span className="font-bold text-slate-700 text-md md:text-lg">
                    {subject}
                  </span>
                </div>
                <FiChevronDown
                  className={`text-slate-400 transition-transform duration-300 ${
                    activeSubject === subject ? "rotate-180" : ""
                  }`}
                  size={20}
                />
              </button>

              <AnimatePresence>
                {activeSubject === subject && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 space-y-3">
                      <div className="h-px bg-slate-100 mb-4" />
                      {books.map((book, i) => (
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          key={i}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-blue-100 hover:shadow-md transition-all group"
                        >
                          <div className="mb-3 sm:mb-0">
                            <h4 className="font-bold text-slate-800 text-sm md:text-base">
                              {book.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <FiStar
                                className="text-amber-400 fill-current"
                                size={12}
                              />
                              <span className="text-xs font-semibold text-slate-500">
                                {book.rating} Rating
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto">
                            <a
                              href={book.pdf}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-900 hover:text-white transition-all"
                            >
                              <FiDownload /> PDF
                            </a>
                            <a
                              href={book.link}
                              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg text-xs font-bold transition-all shadow-sm ${
                                data[openBoard].activeBg.split(" ")[0]
                              } hover:brightness-110`}
                            >
                              <FiExternalLink /> GET BOOK
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
