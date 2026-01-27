import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import logo from "../../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  BarChart2,
  User,
  FileText,
  Calendar,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

export default function StudentNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time Data States
  const [user, setUser] = useState(null);
  const [admission, setAdmission] = useState(null);

  // Auth and Data Fetching Logic
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const q = query(
          collection(db, "approved_admissions"),
          where("email", "==", currentUser.email),
        );

        const unsubscribeData = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            setAdmission(snapshot.docs[0].data());
          }
        });

        return () => unsubscribeData();
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // Derived Values - Fixes for undefined variables
  const fullName = admission?.firstName
    ? `${admission.firstName} ${admission.lastName || ""}`
    : "Student";

  const firstLetter = admission?.firstName
    ? admission.firstName[0].toUpperCase()
    : user?.email
      ? user.email[0].toUpperCase()
      : "S";

  const profileImage = admission?.photoUrl;
  const userEmail = user?.email || "";

  const menu = [
    {
      name: "Dashboard",
      path: "/student",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Notes", path: "/student/notes", icon: <BookOpen size={20} /> },
    {
      name: "Attendance",
      path: "/student/attendance",
      icon: <BarChart2 size={20} />,
    },
    {
      name: "Timetable",
      path: "/student/timetable",
      icon: <Calendar size={20} />,
    },
    { name: "Profile", path: "/student/profile", icon: <User size={20} /> },
    { name: "Exams", path: "/student/exams", icon: <FileText size={20} /> },
    {
      name: "Feedback",
      path: "/student/feedback",
      icon: <Calendar size={20} />,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await signOut(auth);
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-[100] h-20 flex items-center shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* --- MOBILE & TABLET HEADER --- */}
        <div className="lg:hidden flex items-center justify-between w-full">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2.5 bg-slate-50 rounded-xl text-slate-700 border border-slate-100 active:scale-95 transition-all"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center justify-center mr-1 gap-2.5">
            <img
              src={logo}
              alt="Logo"
              className="w-9 h-9 rounded-xl object-contain shadow-sm"
            />
            <h1 className="font-black text-blue-700 leading-none text-3xl tracking-tighter drop-shadow-sm">
              DCA
            </h1>
          </div>

          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black shadow-md border-2 border-white ring-1 ring-slate-100 overflow-hidden">
            {profileImage ? (
              <img
                src={profileImage}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              firstLetter
            )}
          </div>
        </div>

        {/* --- DESKTOP HEADER --- */}
        <div className="hidden lg:flex items-center justify-between w-full">
          <Link to="/student" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-md">
              <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />
            </div>
            <div className="flex flex-col text-left">
              <p className="font-black text-blue-700 leading-none uppercase tracking-tight text-xl">
                DCA
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Portal
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 mx-4">
            {menu.map((item, i) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={i}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500 hover:text-blue-600 hover:bg-white/50"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 text-left">
              <div className="text-right border-r pr-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Server Time
                </p>
                <p className="text-sm font-black text-slate-700">
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100 group"
              title="Logout"
            >
              <LogOut
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>

      {/* --- SIDEBAR DRAWER --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-full max-w-[300px] bg-white z-[201] shadow-2xl flex flex-col"
            >
              <div className="p-8 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-md">
                    <img
                      src={logo}
                      alt="DCA Logo"
                      className="w-12 h-12 rounded-lg object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-black text-blue-700 leading-none">
                      DCA CLASSES
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">
                      Student Portal
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="lg:hidden p-2 text-slate-500"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="px-6 mb-8 flex-shrink-0">
                <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 flex items-center gap-3">
                  <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-blue-600 font-black shadow-sm border border-slate-200 uppercase overflow-hidden ring-2 ring-blue-50">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">{firstLetter}</span>
                    )}
                  </div>
                  <div className="overflow-hidden text-left">
                    <p className="text-sm font-black text-slate-700 truncate capitalize">
                      {fullName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold truncate italic">
                      {userEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 px-4 space-y-1 overflow-y-auto text-left">
                {menu.map((item, i) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={i}
                      to={item.path}
                      className={`flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                          : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={isActive ? "text-white" : "text-slate-400"}
                        >
                          {item.icon}
                        </span>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <ChevronRight
                        size={16}
                        className={isActive ? "opacity-100" : "opacity-30"}
                      />
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 border-t border-slate-50 bg-white">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all active:scale-[0.98]"
                >
                  <LogOut size={20} />
                  Logout Account
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
