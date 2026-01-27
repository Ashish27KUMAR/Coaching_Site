import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo.png";
import {
  LogOut,
  LayoutDashboard,
  Library,
  LifeBuoy,
  ShieldCheck,
  Settings,
  Menu,
  X,
} from "lucide-react";

export default function StudentLayout({ children }) {
  const [user, setUser] = useState(null);
  const [admission, setAdmission] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user data from approved_admissions
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

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await signOut(auth);
      navigate("/login");
    }
  };

  const fullName = admission?.firstName
    ? `${admission.firstName} ${admission.lastName || ""}`
    : "Loading...";

  const firstLetter = admission?.firstName
    ? admission.firstName[0].toUpperCase()
    : "S";
  const profileImage = admission?.photoUrl;
  const userEmail = user?.email || "";
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      name: "Dashboard",
      path: "/student",
      icon: LayoutDashboard,
      section: "Main Menu",
    },
    {
      name: "E-Library",
      path: "/student/resources",
      icon: Library,
      section: "Main Menu",
    },
    {
      name: "Help Center",
      path: "/student/support",
      icon: LifeBuoy,
      section: "Support",
    },
    {
      name: "Safety Tips",
      path: "/student/security",
      icon: ShieldCheck,
      section: "Support",
    },
    {
      name: "Settings",
      path: "/student/settings",
      icon: Settings,
      section: "Support",
    },
  ];

  return (
    <div className="fixed inset-0 w-full h-full bg-[#F8FAFC] flex overflow-hidden font-sans">
      {/* --- SIDEBAR --- */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-[150] w-72 bg-white border-r transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-full flex-shrink-0 shadow-xl lg:shadow-none`}
      >
        <div className="p-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
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
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Profile Card */}
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

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-6 text-left overflow-y-auto pb-6 custom-scrollbar">
          {["Main Menu", "Support"].map((section) => (
            <div key={section} className="mb-6">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                {section}
              </p>
              <div className="space-y-1">
                {menuItems
                  .filter((item) => item.section === section)
                  .map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                        isActive(item.path)
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <item.icon size={18} /> {item.name}
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-6 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex-shrink-0 h-20 px-4 flex items-center bg-white border-b border-slate-100 z-[100] w-full">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => setSidebarOpen(true)} // Fixed: variable name corrected
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
              <h1 className="font-black text-blue-700 leading-none text-3xl tracking-tighter">
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
        </header>

        <main className="flex-1 w-full overflow-y-auto bg-[#F8FAFC]">
          {children}
        </main>
      </div>

      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[140] lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
