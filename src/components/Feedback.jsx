import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  Star,
  Quote,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function Feedback() {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [limit, setLimit] = useState(6);
  const gridRef = useRef(null);

  useEffect(() => {
    // Responsive limit set karne ke liye
    const updateLimit = () => {
      if (window.innerWidth < 768) {
        setLimit(3); // Mobile par 3 cards
      } else {
        setLimit(6); // Desktop par 6 cards
      }
    };

    updateLimit();
    window.addEventListener("resize", updateLimit);

    // Firestore se real-time data fetch karna
    const q = query(collection(db, "feedbacks"), orderBy("time", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", updateLimit);
    };
  }, []);

  // Date Formatter with Year
  const formatDate = (timestamp) => {
    if (!timestamp) return "Just now";
    try {
      const date = timestamp.toDate();
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric", // "24 Jan 2026" format ke liye
      });
    } catch (e) {
      return "Recent";
    }
  };

  const handleToggle = () => {
    if (showAll) {
      // Wapas grid ke start par scroll karne ke liye
      const offset = window.innerWidth < 768 ? 50 : 100;
      window.scrollTo({
        top: gridRef.current.offsetTop - offset,
        behavior: "smooth",
      });
    }
    setShowAll(!showAll);
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, limit);

  return (
    <section
      ref={gridRef}
      className="bg-[#F8FAFC] py-12 sm:py-24 relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-50 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-50 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight px-2">
            Hear from our <span className="text-blue-600">Community</span>
          </h2>
          <p className="mt-4 text-slate-500 text-xs sm:text-base font-medium max-w-xl mx-auto">
            Real experiences from students who have transformed their careers
            with us.
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {displayedReviews.map((r) => {
            const currentRating = r.rating !== undefined ? r.rating : 5;
            return (
              <div
                key={r.id}
                className="break-inside-avoid bg-white border border-slate-100 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group relative"
              >
                {/* Quote Icon Overlay */}
                <div className="absolute top-5 right-6 sm:top-8 sm:right-8 text-slate-50 group-hover:text-blue-50 transition-colors duration-500">
                  <Quote
                    size={32}
                    className="sm:w-12 sm:h-12"
                    fill="currentColor"
                  />
                </div>

                {/* Star Rating */}
                <div className="flex gap-0.5 mb-3 sm:mb-5 relative z-10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={12}
                      className={`sm:w-4 sm:h-4 ${
                        star <= currentRating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Feedback Message */}
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-semibold relative z-10 italic">
                  "{r.message}"
                </p>

                <div className="h-px w-full bg-slate-50 my-4 sm:my-6"></div>

                {/* User Info & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Student Photo / Avatar */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center text-white shadow-lg border-2 border-white shrink-0">
                      {r.photo ? (
                        <img
                          src={r.photo}
                          alt={r.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : r.name ? (
                        <span className="text-xs sm:text-sm font-black uppercase">
                          {r.name.charAt(0)}
                        </span>
                      ) : (
                        <User size={18} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate tracking-tight">
                        {r.name || "Anonymous User"}
                      </h4>
                      <p className="text-[8px] sm:text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                        Verified Student
                      </p>
                    </div>
                  </div>

                  {/* Date with Year */}
                  <div className="flex items-center gap-1 text-slate-400 shrink-0">
                    <Calendar size={10} className="sm:w-3 sm:h-3" />
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-tighter">
                      {formatDate(r.time)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Toggle Button */}
        {reviews.length > limit && (
          <div className="mt-12 text-center">
            <button
              onClick={handleToggle}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 px-8 py-4 rounded-full text-[10px] sm:text-xs font-black text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 shadow-sm active:scale-95 uppercase tracking-widest"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Explore All {reviews.length} Reviews <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
