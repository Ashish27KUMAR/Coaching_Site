import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Info,
  GraduationCap,
  Phone,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

export default function StudentNavbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const menu = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "About", path: "/about", icon: <Info size={20} /> },
    {
      name: "Admission",
      path: "/admission",
      icon: <GraduationCap size={20} />,
    },
    { name: "Contact", path: "/contact", icon: <Phone size={20} /> },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-[100] h-18 flex items-center shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between w-full">
          {/* --- LOGO (LEFT) --- */}
          <Link to="/student" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-md">
              <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />
            </div>
            <div className="flex flex-col text-left">
              <p className="font-black text-blue-700 leading-none uppercase tracking-tight text-3xl">
                DCA
              </p>
            </div>
          </Link>

          {/* --- DESKTOP NAVIGATION (CENTER MENU + RIGHT TIME) --- */}
          <div className="hidden lg:flex items-center relative w-full">
            {/* CENTER MENU */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                {menu.map((item, i) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={i}
                      to={item.path}
                      className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                          : "text-slate-500 hover:text-blue-600 hover:bg-white/50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SIDE — SERVER TIME (MATCHED SIZE) */}
            <div className="ml-auto hidden xl:flex">
              <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 text-left">
                <div className="text-right border-r border-slate-900 pr-4">
                  <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">
                    Server Time
                  </p>
                  <p className="text-xs font-black text-slate-700 mt-1">
                    {currentTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- MOBILE TOGGLE (RIGHT) --- */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2.5 bg-slate-50 rounded-xl text-slate-700 border border-slate-100 active:scale-95 transition-all"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* --- SIDEBAR DRAWER (OPENS FROM RIGHT) --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop: Pehle se zyada smooth opacity transition */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[200]"
            />

            {/* Drawer: Width 280px (Balanced) aur Smooth Spring Physics */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-[280px] bg-white z-[201] shadow-2xl flex flex-col border-l border-slate-50"
            >
              {/* Header: Compact & Clean */}
              <div className="p-5 flex items-center justify-between border-b border-slate-50 bg-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-md">
                    <img
                      src={logo}
                      alt="Logo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div className="flex flex-col text-left leading-none">
                    <p className="text-3xl font-bold text-blue-700 leading-none tracking-tighter uppercase">
                      DCA
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Section: Adjusted Spacing */}
              <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                <p className="px-4 mb-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Navigation
                </p>

                {menu.map((item, i) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={i}
                      to={item.path}
                      className={`group flex items-center justify-between p-3.5 rounded-xl font-bold transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                          : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover:text-blue-600"
                          }
                        >
                          {item.icon}
                        </span>
                        <span className="text-xs uppercase tracking-wider font-bold">
                          {item.name}
                        </span>
                      </div>
                      <ChevronRight
                        size={14}
                        className={`transition-all duration-300 ${
                          isActive ? "opacity-100" : "opacity-0 -translate-x-2"
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>

              {/* Footer: Minimalist Style */}
              <div className="p-5 mt-auto bg-blue-100 border-t border-slate-100">
                {/* Support/WhatsApp Card */}
                <a
                  href="https://wa.me/919931190218" // Yahan apna WhatsApp number 91 ke saath daalein
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-transform active:scale-95"
                >
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-5 group hover:border-green-400 hover:bg-green-50/30 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[9px] font-black text-blue-600 uppercase group-hover:text-green-600 transition-colors">
                        Support
                      </p>
                      {/* Ek chota sa green dot ya icon branding ke liye */}
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight group-hover:text-slate-600">
                      Need help?{" "}
                      <span className="font-bold text-green-600">
                        Tap to chat
                      </span>{" "}
                      with us on WhatsApp.
                    </p>
                  </div>
                </a>

                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                      System Online
                    </span>
                  </div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                    © 2026 DCA Academy
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
