import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore"; // FIX: onSnapshot add kiya real-time ke liye
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import StudentLayout from "./StudentLayout";
import {
  BookOpen,
  BarChart2,
  LayoutDashboard,
  User,
  FileText,
  Calendar,
  MessageSquare,
  Bell,
  UserCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function StudentDashboard() {
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // FIX: Collection ka naam "approved_admissions" kiya gaya hai
        const q = query(
          collection(db, "approved_admissions"),
          where("email", "==", currentUser.email),
        );

        // onSnapshot use kiya taaki data hamesha up-to-date rahe
        const unsubscribeData = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            setAdmission(snapshot.docs[0].data());
          }
          setLoading(false);
        });

        fetchAnnouncements();
        return () => unsubscribeData();
      } else {
        navigate("/login");
      }
    });

    return () => {
      unsubscribeAuth();
      clearInterval(timer);
    };
  }, [navigate]);

  const fetchAnnouncements = async () => {
    try {
      const snapshot = await getDocs(collection(db, "announcements"));
      setAnnouncements(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const quickActions = [
    {
      title: "Notes",
      icon: <BookOpen />,
      link: "/student/notes",
      color: "bg-blue-500",
    },
    {
      title: "Attendance",
      icon: <BarChart2 />,
      link: "/student/attendance",
      color: "bg-emerald-500",
    },
    {
      title: "Timetable",
      icon: <Calendar />,
      link: "/student/timetable",
      color: "bg-amber-500",
    },
    {
      title: "Profile",
      icon: <User />,
      link: "/student/profile",
      color: "bg-purple-500",
    },
    {
      title: "Exams",
      icon: <FileText />,
      link: "/student/exams",
      color: "bg-rose-500",
    },
    {
      title: "Feedback",
      icon: <MessageSquare />,
      link: "/student/feedback",
      color: "bg-indigo-500",
    },
  ];

  const isActive =
    admission?.status?.toLowerCase() === "approved" ||
    admission?.status?.toLowerCase() === "active";

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium animate-pulse">
          Syncing Portal...
        </p>
      </div>
    );

  return (
    <StudentLayout>
      <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
        {/* TOP BAR */}
        <div className="hidden lg:flex justify-between items-center mb-8">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-black text-slate-800 tracking-tight">
              <LayoutDashboard className="text-blue-600" size={32} />
              Student Overview
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Welcome back, happy learning!
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-right border-r pr-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Time
              </p>
              <p className="text-sm font-black text-slate-700">
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6 text-left">
            {/* HERO CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-900 rounded-[2rem] p-6 sm:p-10 text-white relative overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 right-0 p-4 opacity-6 pointer-events-none">
                <UserCircle
                  size={200}
                  className="rotate-12 translate-x-12 -translate-y-8"
                />
              </div>

              <div className="relative z-10">
                <div className="mb-5">
                  <span className="bg-amber-400 text-blue-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                    Time to learn
                  </span>
                </div>

                <div className="flex items-stretch gap-5 sm:gap-8">
                  <div className="shrink-0">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-2 border-white/30 bg-white/10 backdrop-blur-md overflow-hidden flex items-center justify-center text-3xl sm:text-5xl font-black uppercase shadow-2xl relative">
                      {/* FIX: profilePic ko photoUrl kiya gaya hai */}
                      {admission?.photoUrl ? (
                        <img
                          src={admission.photoUrl}
                          alt="Student"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        admission?.firstName?.[0] || "S"
                      )}
                      <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-indigo-900 bg-emerald-400"></div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                    <div>
                      <h2 className="text-xl sm:text-4xl font-black leading-tight capitalize truncate drop-shadow-md">
                        {admission?.firstName} {admission?.lastName || ""}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-400" : "bg-rose-500"}`}
                        ></span>
                        <span
                          className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${isActive ? "text-emerald-300" : "text-rose-400"}`}
                        >
                          {admission?.status || "Pending Verification"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3 bg-white/15 backdrop-blur-xl w-fit px-5 py-2 rounded-xl border border-white/20 shadow-lg">
                      <div className="p-1.5 bg-amber-400 rounded-lg">
                        <User size={14} className="text-blue-900" />
                      </div>
                      <span className="text-sm sm:text-lg font-black leading-tight">
                        {admission?.selectedClass || "Not Set"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  to={action.link}
                  className="group bg-white p-5 rounded-[1.8rem] border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all text-center relative overflow-hidden"
                >
                  <div
                    className={`${action.color} w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}
                  >
                    {action.icon}
                  </div>
                  <h3 className="font-bold text-slate-700 text-xs sm:text-sm">
                    {action.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6 text-left">
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                Portal Status
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      Status
                    </p>
                    <p
                      className={`font-black text-xs sm:text-sm ${isActive ? "text-emerald-600" : "text-rose-500"}`}
                    >
                      {admission?.status || "PENDING"}
                    </p>
                  </div>
                  {isActive ? (
                    <CheckCircle size={20} className="text-emerald-500" />
                  ) : (
                    <Clock size={20} className="text-rose-500" />
                  )}
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Assigned Course
                  </p>
                  <p className="font-black text-slate-700 text-xs sm:text-sm">
                    {admission?.selectedClass || "Awaiting Update"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                  <Bell className="text-rose-500" size={20} /> Notice Board
                </h3>
              </div>
              <div className="space-y-4">
                {announcements.length > 0 ? (
                  announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className="p-3 rounded-xl hover:bg-slate-50 transition-colors border-l-4 border-blue-500"
                    >
                      <p className="text-slate-700 text-xs sm:text-sm font-bold line-clamp-2">
                        {ann.title || ann.text}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">
                        Published: {ann.date || "Just now"}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <MessageSquare
                      size={32}
                      className="mx-auto text-slate-200 mb-2"
                    />
                    <p className="text-slate-400 text-xs italic">
                      No active announcements
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
