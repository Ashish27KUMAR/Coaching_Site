import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom"; // Hook add kiya
import {
  X,
  Download,
  Library,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
} from "lucide-react";

export default function StudentPDFReader() {
  const location = useLocation();
  const navigate = useNavigate();

  // Book data location state se le rahe hain
  const book = location.state?.book;

  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Agar book data nahi hai (direct link visit), toh wapas library bhej do
  useEffect(() => {
    if (!book) {
      navigate("/student/e-book"); // Apne route ke hisaab se change karein
    }
  }, [book, navigate]);

  const onClose = () => navigate(-1); // Pichle page pe wapas jane ke liye

  const onDownload = (bookData) => {
    const link = document.createElement("a");
    link.href = bookData.link;
    link.download = `${bookData.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Sidebar Resizing Logic
  const startResizing = useCallback(
    (mouseDownEvent) => {
      const startX = mouseDownEvent.clientX;
      const startWidth = sidebarWidth;

      const onMouseMove = (mouseMoveEvent) => {
        const newWidth = startWidth + (mouseMoveEvent.clientX - startX);
        if (newWidth > 160 && newWidth < 480) {
          setSidebarWidth(newWidth);
        }
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [sidebarWidth],
  );

  // Drive link ko preview link mein convert karne ka function
  const getEmbedUrl = (url) => {
    if (!url) return "";
    // Google Drive view link ko preview mein convert karta hai
    return url
      .replace(/\/view.*$/, "/preview")
      .replace(/\/edit.*$/, "/preview");
  };

  if (!book) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-[#121212] flex flex-col h-screen w-screen overflow-hidden"
    >
      {/* --- PREMIUM TOOLBAR --- */}
      <div className="h-16 bg-[#1e1e1e] border-b border-white/5 flex items-center justify-between px-5 shadow-2xl shrink-0">
        {/* Left: Controls */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 hover:bg-white/5 rounded-xl text-slate-400 transition-all active:scale-90"
          >
            {isSidebarOpen ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </button>
          <div className="hidden md:flex items-center gap-3 pl-2">
            <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-500">
              <Library size={18} />
            </div>
            <div className="h-4 w-[1px] bg-white/10"></div>
          </div>
        </div>

        {/* Center: Book Metadata */}
        <div className="flex flex-col items-center max-w-[40%] text-center">
          <h2 className="text-white font-bold text-sm truncate w-full tracking-wide">
            {book.title}
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded">
              {book.class}
            </span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
              {book.author}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <button
            onClick={() => onDownload(book)}
            className="flex items-center gap-2 bg-white/5 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border border-white/5 shadow-lg active:scale-95"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download</span>
          </button>
          <div className="h-8 w-[1px] bg-white/10 mx-1"></div>
          <button
            onClick={onClose}
            className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all active:scale-90 group"
          >
            <X
              size={20}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </button>
        </div>
      </div>

      {/* --- MAIN VIEWER BODY --- */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -sidebarWidth }}
              animate={{ x: 0 }}
              exit={{ x: -sidebarWidth }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{ width: `${sidebarWidth}px` }}
              className="relative bg-[#181818] border-r border-white/5 flex flex-col shrink-0"
            >
              <div className="p-4 border-b border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Table of Contents
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="aspect-[3/4] bg-[#252525] rounded-xl border-2 border-transparent group-hover:border-blue-600/50 transition-all flex items-center justify-center relative shadow-lg">
                      <span className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-600">
                        0{i}
                      </span>
                    </div>
                    <p className="text-center text-[10px] text-slate-600 mt-2 font-bold uppercase group-hover:text-blue-400">
                      Page {i}
                    </p>
                  </div>
                ))}
              </div>
              {/* Resize Handle */}
              <div
                onMouseDown={startResizing}
                className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-blue-600/40 transition-all group"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-white/10 group-hover:bg-blue-400 rounded-full"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* IFRAME VIEWER */}
        <div className="flex-1 bg-[#0f0f0f] relative overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center -z-10">
            <div className="w-10 h-10 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-[10px] text-slate-600 font-black mt-4 tracking-[0.3em] uppercase">
              Initializing Secure Reader
            </p>
          </div>
          <iframe
            src={getEmbedUrl(book.link)}
            className="w-full h-full border-none"
            allow="autoplay"
            title="PDF Reader"
          ></iframe>
        </div>
      </div>

      {/* FOOTER */}
      <div className="h-8 bg-[#181818] border-t border-white/5 px-4 flex items-center justify-between shrink-0">
        <p className="text-[9px] text-slate-500 font-medium tracking-tight">
          Safe Mode Active • Encrypted Connection
        </p>
        <p className="text-[9px] text-slate-500 font-medium uppercase tracking-widest">
          {book.category} Section
        </p>
      </div>

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
      `}</style>
    </motion.div>
  );
}
