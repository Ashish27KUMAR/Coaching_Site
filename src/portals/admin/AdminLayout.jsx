import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo.png";
import {
  LogOut,
  LayoutDashboard,
  Users,
  FileUp,
  UserPlus,
  BookOpen,
  LineChart,
  Settings,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [adminData, setAdminData] = useState(null); // Admin info from Firestore
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchAdminData(currentUser.email);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Firestore se Admin ki details fetch karna (Just like student)
  const fetchAdminData = async (email) => {
    try {
      const q = query(collection(db, "admins"), where("email", "==", email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setAdminData(snapshot.docs[0].data());
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout from Admin Panel?")) {
      await signOut(auth);
      navigate("/login");
    }
  };

  // Profile Logic (Same as your student portal)
  const adminName = adminData ? `${adminData.name}` : "Administrator";
  const firstLetter = adminData?.name ? adminData.name[0].toUpperCase() : "A";
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      section: "Main Menu",
    },
    {
      name: "Admissions",
      path: "/admin/admissions",
      icon: Users,
      section: "Main Menu",
    },
    {
      name: "Add Admin",
      path: "/admin/add-admin",
      icon: UserPlus,
      section: "Main Menu",
    },

    {
      name: "Upload Notes",
      path: "/admin/notes",
      icon: FileUp,
      section: "Support",
    },
    {
      name: "Manage Courses",
      path: "/admin/courses",
      icon: BookOpen,
      section: "Support",
    },
    {
      name: "Analytics",
      path: "/admin/stats",
      icon: LineChart,
      section: "Support",
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
      section: "Support",
    },
  ];

  return (
    <div className="fixed inset-0 w-full h-full bg-[#F8FAFC] flex overflow-hidden font-sans">
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      {/* --- SIDEBAR --- */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-[150] w-72 bg-white border-r transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-full flex-shrink-0 shadow-xl lg:shadow-none`}
      >
        <div className="p-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
              D
            </div>
            <div className="text-left">
              <h2 className="text-lg font-black text-slate-800 leading-none">
                DCA CLASSES
              </h2>
              <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">
                Admin Portal
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

        {/* Dynamic Profile Section (Same as Student) */}
        <div className="px-6 mb-8 flex-shrink-0">
          <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold shadow-sm border border-slate-200 uppercase overflow-hidden">
              {adminData?.profilePic ? (
                <img
                  src={adminData.profilePic}
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              ) : (
                firstLetter
              )}
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-sm font-bold text-slate-700 truncate capitalize">
                {adminName}
              </p>
              <p className="text-[10px] text-slate-400 font-medium truncate italic">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-6 text-left overflow-y-auto pb-6 no-scrollbar">
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

        <div className="p-6 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all"
          >
            <LogOut size={20} /> Logout Admin
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        <header className="lg:hidden flex-shrink-0 h-20 px-4 flex items-center bg-white border-b border-slate-100 z-[100] w-full">
          <div className="grid grid-cols-3 items-center w-full">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 bg-slate-50 rounded-xl text-slate-700 w-fit"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center justify-center gap-2.5">
              <img src={logo} alt="Logo" className="w-9 h-9 object-contain" />
              <h1 className="font-black text-blue-700 text-3xl tracking-tighter">
                DCA
              </h1>
            </div>
            <div className="flex justify-end">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black uppercase overflow-hidden border border-blue-700/10">
                {adminData?.profilePic ? (
                  <img
                    src={adminData.profilePic}
                    alt="Admin"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  firstLetter
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-[#F8FAFC] scroll-smooth no-scrollbar">
          <div className="p-6 lg:p-10">{children}</div>
        </main>
      </div>

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
