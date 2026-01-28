import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StudentLayout from "./StudentLayout";
// Importing Books pdf
// Class6
import mathpdf6 from "../../assets/E_library/Class_6/Mathematics_class6.pdf";
import englishpdf6 from "../../assets/E_library/Class_6/English_class6.pdf";
import hindipdf6 from "../../assets/E_library/Class_6/Hindi_class6.pdf";
import physicalpdf6 from "../../assets/E_library/Class_6/Physical_Education_and_Well_Being_class6.pdf";
import sanskritpdf6 from "../../assets/E_library/Class_6/Sanskrit_class6.pdf";
import sciencepdf6 from "../../assets/E_library/Class_6/Science_class6.pdf";
import sstpdf6 from "../../assets/E_library/Class_6/Social_Science_class6.pdf";
import vocationalpdf6 from "../../assets/E_library/Class_6/Vocational_Education_class6.pdf";

// Class7
import mathpdf7_1 from "../../assets/E_library/Class_7/Mathematics_Part1_class7.pdf";
import mathpdf7_2 from "../../assets/E_library/Class_7/Mathematics_Part2_class7.pdf";
import englishpdf7 from "../../assets/E_library/Class_7/English_class7.pdf";
import hindipdf7 from "../../assets/E_library/Class_7/Hindi_class7.pdf";
import physicalpdf7 from "../../assets/E_library/Class_7/Physical_Education_and_Well_Being_class7.pdf";
import sanskritpdf7 from "../../assets/E_library/Class_7/Sanskrit_class7.pdf";
import sciencepdf7 from "../../assets/E_library/Class_7/Science_class7.pdf";
import sstpdf7_1 from "../../assets/E_library/Class_7/Social_Science_Part1_class7.pdf";
import sstpdf7_2 from "../../assets/E_library/Class_7/Social_Science_Part2_class7.pdf";
import vocationalpdf7 from "../../assets/E_library/Class_7/Vocational_Education_class7.pdf";

// Class8
import mathpdf8_1 from "../../assets/E_library/Class_8/Mathematics_Part1_class8.pdf";
import mathpdf8_2 from "../../assets/E_library/Class_8/Mathematics_Part2_class8.pdf";
import englishpdf8 from "../../assets/E_library/Class_8/English_class8.pdf";
import hindipdf8 from "../../assets/E_library/Class_8/Hindi_class8.pdf";
import physicalpdf8 from "../../assets/E_library/Class_8/Physical_Education_and_Well_Being_class8.pdf";
import sanskritpdf8 from "../../assets/E_library/Class_8/Sanskrit_class8.pdf";
import sciencepdf8 from "../../assets/E_library/Class_8/Science_class8.pdf";
import sstpdf8_1 from "../../assets/E_library/Class_8/Social_Science_Part1_class8.pdf";
import vocationalpdf8 from "../../assets/E_library/Class_8/Vocational_Education_class8.pdf";

// Importing Books image
// Class6
import math6 from "../../assets/E_library/Class_6/Mathematics_class6.jpg";
import english6 from "../../assets/E_library/Class_6/English_class6.jpg";
import hindi6 from "../../assets/E_library/Class_6/Hindi_class6.jpg";
import physical6 from "../../assets/E_library/Class_6/Physical_Education_and_Well_Being_class6.jpg";
import sanskrit6 from "../../assets/E_library/Class_6/Sanskrit_class6.jpg";
import science6 from "../../assets/E_library/Class_6/Science_class6.jpg";
import sst6 from "../../assets/E_library/Class_6/Social_Science_class6.jpg";
import vocational6 from "../../assets/E_library/Class_6/Vocational_Education_class6.jpg";

// CLass 7
import math7_1 from "../../assets/E_library/Class_7/Mathematics_Part1_class7.jpg";
import math7_2 from "../../assets/E_library/Class_7/Mathematics_Part2_class7.jpg";
import english7 from "../../assets/E_library/Class_7/English_class7.jpg";
import hindi7 from "../../assets/E_library/Class_7/Hindi_class7.jpg";
import physical7 from "../../assets/E_library/Class_7/Physical_Education_and_Well_Being_class7.jpg";
import sanskrit7 from "../../assets/E_library/Class_7/Sanskrit_class7.jpg";
import science7 from "../../assets/E_library/Class_7/Science_class7.jpg";
import sst7_1 from "../../assets/E_library/Class_7/Social_Science_Part1_class7.jpg";
import sst7_2 from "../../assets/E_library/Class_7/Social_Science_Part2_class7.jpg";
import vocational7 from "../../assets/E_library/Class_7/Vocational_Education_class7.jpg";

// CLass 8
import math8_1 from "../../assets/E_library/Class_8/Mathematics_Part1_class8.jpg";
import math8_2 from "../../assets/E_library/Class_8/Mathematics_Part2_class8.jpg";
import english8 from "../../assets/E_library/Class_8/English_class8.jpg";
import hindi8 from "../../assets/E_library/Class_8/Hindi_class8.jpg";
import physical8 from "../../assets/E_library/Class_8/Physical_Education_and_Well_Being_class8.jpg";
import sanskrit8 from "../../assets/E_library/Class_8/Sanskrit_class8.jpg";
import science8 from "../../assets/E_library/Class_8/Science_class8.jpg";
import sst8_1 from "../../assets/E_library/Class_8/Social_Science_Part1_class8.jpg";
import vocational8 from "../../assets/E_library/Class_8/Vocational_Education_class8.jpg";

import {
  Library,
  Download,
  Search,
  ExternalLink,
  X,
  Filter,
  ChevronDown,
} from "lucide-react";

export default function StudentEBook() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeClass, setActiveClass] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Books Data (Add 'class' property to your books objects)
  const books = [
    // CLass 6⬇️
    {
      id: 1,
      title: "Mathematics for Class 6",
      author: "B.S. Grewal",
      image: math6,
      category: "Mathematics",
      class: "6th",
      link: mathpdf6,
    },
    {
      id: 2,
      title: "English for Class 6",
      author: "H.C. Verma",
      image: english6,
      category: "English",
      class: "6th",
      link: englishpdf6,
    },
    {
      id: 3,
      title: "Hindi for Class 6",
      author: "B.S. Grewal",
      image: hindi6,
      category: "Hindi",
      class: "6th",
      link: hindipdf6,
    },
    {
      id: 4,
      title: "Physical Education and Well Being for Class 6",
      author: "H.C. Verma",
      image: physical6,
      category: "Physical Education",
      class: "6th",
      link: physicalpdf6,
    },
    {
      id: 5,
      title: "Social Science for Class 6",
      author: "B.S. Grewal",
      image: sst6,
      category: "Social Science",
      class: "6th",
      link: sstpdf6,
    },
    {
      id: 6,
      title: "Science for Class 6",
      author: "H.C. Verma",
      image: science6,
      category: "Science",
      class: "6th",
      link: sciencepdf6,
    },
    {
      id: 7,
      title: "Sanskrit for Class 6",
      author: "B.S. Grewal",
      image: sanskrit6,
      category: "Sanskrit",
      class: "6th",
      link: sanskritpdf6,
    },
    {
      id: 8,
      title: "Vocational Education for Class 6",
      author: "H.C. Verma",
      image: vocational6,
      category: "Vocational Education",
      class: "6th",
      link: vocationalpdf6,
    },
    // CLass 7⬇️
    {
      id: 9,
      title: "Mathematics for Class 7",
      author: "B.S. Grewal",
      image: math7_1,
      category: "Mathematics",
      class: "7th",
      link: mathpdf7_1,
    },
    {
      id: 10,
      title: "Mathematics for Class 7",
      author: "B.S. Grewal",
      image: math7_2,
      category: "Mathematics",
      class: "7th",
      link: mathpdf7_2,
    },
    {
      id: 11,
      title: "English for Class 7",
      author: "H.C. Verma",
      image: english7,
      category: "English",
      class: "7th",
      link: englishpdf7,
    },
    {
      id: 12,
      title: "Hindi for Class 7",
      author: "B.S. Grewal",
      image: hindi7,
      category: "Hindi",
      class: "7th",
      link: hindipdf7,
    },
    {
      id: 13,
      title: "Physical Education and Well Being for Class 7",
      author: "H.C. Verma",
      image: physical7,
      category: "Physical Education",
      class: "7th",
      link: physicalpdf7,
    },
    {
      id: 14,
      title: "Social Science for Class 7",
      author: "B.S. Grewal",
      image: sst7_1,
      category: "Social Science",
      class: "7th",
      link: sstpdf7_1,
    },
    {
      id: 15,
      title: "Social Science for Class 7",
      author: "B.S. Grewal",
      image: sst7_2,
      category: "Social Science",
      class: "7th",
      link: sstpdf7_2,
    },
    {
      id: 16,
      title: "Science for Class 7",
      author: "H.C. Verma",
      image: science7,
      category: "Science",
      class: "7th",
      link: sciencepdf7,
    },
    {
      id: 17,
      title: "Sanskrit for Class 7",
      author: "B.S. Grewal",
      image: sanskrit7,
      category: "Sanskrit",
      class: "7th",
      link: sanskritpdf7,
    },
    {
      id: 18,
      title: "Vocational Education for Class 7",
      author: "H.C. Verma",
      image: vocational7,
      category: "Vocational Education",
      class: "7th",
      link: vocationalpdf7,
    },
    // CLass 8⬇️
    {
      id: 19,
      title: "Mathematics (Part I) for Class 8",
      author: "B.S. Grewal",
      image: math8_1,
      category: "Mathematics",
      class: "8th",
      link: mathpdf8_1,
    },
    {
      id: 20,
      title: "Mathematics (Part II) for Class 8",
      author: "B.S. Grewal",
      image: math8_2,
      category: "Mathematics",
      class: "8th",
      link: mathpdf8_2,
    },
    {
      id: 21,
      title: "English for Class 8",
      author: "H.C. Verma",
      image: english8,
      category: "English",
      class: "8th",
      link: englishpdf8,
    },
    {
      id: 22,
      title: "Hindi for Class 8",
      author: "B.S. Grewal",
      image: hindi8,
      category: "Hindi",
      class: "8th",
      link: hindipdf8,
    },
    {
      id: 23,
      title: "Physical Education and Well Being for Class 8",
      author: "H.C. Verma",
      image: physical8,
      category: "Physical Education",
      class: "8th",
      link: physicalpdf8,
    },
    {
      id: 24,
      title: "Social Science for Class 8",
      author: "B.S. Grewal",
      image: sst8_1,
      category: "Social Science",
      class: "8th",
      link: sstpdf8_1,
    },
    {
      id: 25,
      title: "Science for Class 8",
      author: "H.C. Verma",
      image: science8,
      category: "Science",
      class: "8th",
      link: sciencepdf8,
    },
    {
      id: 26,
      title: "Sanskrit for Class 8",
      author: "B.S. Grewal",
      image: sanskrit8,
      category: "Sanskrit",
      class: "8th",
      link: sanskritpdf8,
    },
    {
      id: 27,
      title: "Sanskrit for Class 8",
      author: "B.S. Grewal",
      image: vocational8,
      category: "Vocational Education",
      class: "8th",
      link: vocationalpdf8,
    },
  ];

  const categories = [
    "All",
    "Mathematics",
    "Physics",
    "Chemistry",
    "English",
    "Hindi",
    "Science",
    "Social Science",
    "Sanskrit",
    "Vocational Education",
    "Physical Education",
  ];
  const classes = [
    "All",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
    "11th",
    "12th",
    "JEE",
    "NEET",
  ];

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchesCategory =
        activeCategory === "All" || book.category === activeCategory;
      const matchesClass = activeClass === "All" || book.class === activeClass;

      return matchesSearch && matchesCategory && matchesClass;
    });
  }, [searchTerm, activeCategory, activeClass]);

  return (
    <StudentLayout>
      <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 text-left">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-black text-slate-800 tracking-tight">
              <Library className="text-blue-600" size={32} />
              E-Library
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base">
              Access study material anywhere
            </p>
          </div>

          {/* SEARCH & FILTER CONTAINER */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* SEARCH BAR - Mobile pe flex-grow karega */}
            <div className="relative flex-grow md:w-80 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm font-medium text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-all"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* FILTER BUTTON - Search ke right mein */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center justify-center gap-2 h-[52px] px-4 md:px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                  isFilterOpen ||
                  activeCategory !== "All" ||
                  activeClass !== "All"
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Filter size={18} />
                <span className="hidden md:block">Filters</span>
                <ChevronDown
                  size={14}
                  className={`hidden md:block transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* DROPDOWN MENU (Same as before) */}
              <AnimatePresence>
                {isFilterOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsFilterOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-72 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 z-20 overflow-hidden"
                    >
                      <div className="space-y-6 text-left">
                        {/* Subject Section */}
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                            Subject
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                              <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3 py-1.5 rounded-xl text-[9px] font-bold transition-all border ${
                                  activeCategory === cat
                                    ? "bg-blue-50 border-blue-200 text-blue-600"
                                    : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Class Section */}
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                            Class / Exam
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {classes.map((cls) => (
                              <button
                                key={cls}
                                onClick={() => setActiveClass(cls)}
                                className={`px-3 py-1.5 rounded-xl text-[9px] font-bold transition-all border ${
                                  activeClass === cls
                                    ? "bg-blue-50 border-blue-200 text-blue-600"
                                    : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                                }`}
                              >
                                {cls}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => {
                              setActiveCategory("All");
                              setActiveClass("All");
                              setIsFilterOpen(false);
                            }}
                            className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => setIsFilterOpen(false)}
                            className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* BOOKS GRID */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 pb-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredBooks.map((book) => (
              <motion.div
                layout
                key={book.id}
                initial={{ opacity: 0 }} // Zoom (scale) hata diya
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ y: -5 }} // Slight lift animation rakha hai zoom ke bajaye
                className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                {/* IMAGE SECTION - Size Chhota kiya hai */}
                <div className="relative aspect-[4/5] p-3 bg-slate-50">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-xl shadow-sm transition-transform duration-500"
                  />
                  {/* <div className="absolute top-4 right-4 flex flex-col gap-1 items-end">
                    <span className="bg-white/90 backdrop-blur px-2 py-0.5 text-[8px] font-black text-blue-600 rounded-full border border-slate-100 shadow-sm uppercase">
                      {book.category}
                    </span>
                    <span className="bg-slate-800 text-white px-2 py-0.5 text-[8px] font-black rounded-full shadow-sm uppercase">
                      {book.class}
                    </span>
                  </div> */}
                </div>

                {/* CONTENT SECTION - Compact Padding */}
                <div className="p-4 text-left">
                  <h3 className="font-bold text-slate-800 text-sm mb-0.5 truncate group-hover:text-blue-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-3 italic">
                    {book.author}
                  </p>

                  <div className="flex gap-1.5">
                    {/* OPEN BOOK */}
                    <a
                      href={book.link}
                      target="_self"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-all active:scale-95"
                    >
                      <ExternalLink size={12} /> OPEN BOOK
                    </a>

                    {/* DOWNLOAD */}
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = book.link;
                        link.download = `${book.title}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold italic text-lg">
              No books found!
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All");
                setActiveClass("All");
              }}
              className="mt-4 text-blue-600 font-black uppercase text-xs hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
