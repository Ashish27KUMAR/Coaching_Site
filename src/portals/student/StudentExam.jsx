import React, { useState } from "react";
import {
  Bell,
  BellRing,
  ArrowLeft,
  GraduationCap,
  Rocket,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";

export default function StudentExam() {
  const navigate = useNavigate();
  const [isNotified, setIsNotified] = useState(false);

  const spinAnimationStyle = {
    animation: "spin-slow 8s linear infinite",
  };

  const keyframes = `
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-20deg); }
      75% { transform: rotate(20deg); }
    }
  `;

  const handleNotifyToggle = () => {
    if (!isNotified) {
      setIsNotified(true);
      alert("Awesome! 🚀 We'll ping you as soon as the exams go live.");
    } else {
      setIsNotified(false);
      alert("No problem! Notification turned off. ✅");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <style>{keyframes}</style>

      {/* Navbar fixed top */}
      <StudentNavbar />

      {/* Main Content Wrapper: flex-grow aur justify-center se gap control hoga */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[30%] h-[30%] bg-blue-100 rounded-full blur-[80px] opacity-30"></div>
          <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-indigo-100 rounded-full blur-[80px] opacity-30"></div>
        </div>

        {/* Content Box */}
        <div className="max-w-md w-full text-center relative z-10">
          {/* Icon - Margin bottom kam kiya */}
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-white rounded-[1.8rem] shadow-lg shadow-blue-200/30 flex items-center justify-center relative">
              <GraduationCap size={32} className="text-blue-600" />
              <div
                style={spinAnimationStyle}
                className="absolute -top-1 -right-1 bg-yellow-400 p-1 rounded-lg shadow-md"
              >
                <Sparkles size={14} className="text-white" />
              </div>
            </div>
          </div>

          {/* Heading Section - space-y-2 for tightness */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-0.5 rounded-full">
              <Rocket size={12} className="text-blue-600" />
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                Under Development
              </span>
            </div>

            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Exams are <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Coming Soon
              </span>
            </h1>

            <p className="text-slate-500 text-xs font-medium max-w-[280px] mx-auto leading-tight">
              We're building a smarter way for you to test your skills. Module
              live shortly.
            </p>
          </div>

          {/* Buttons - mt-6 */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Go Back
            </button>

            <button
              onClick={handleNotifyToggle}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border-2 ${
                isNotified
                  ? "bg-blue-600 border-blue-600 text-white shadow-blue-200"
                  : "bg-white border-slate-100 text-slate-600 hover:border-blue-600"
              }`}
            >
              {isNotified ? (
                <>
                  <BellRing size={14} className="animate-pulse" /> Alerts Active
                </>
              ) : (
                <>
                  <Bell size={14} /> Notify Me
                </>
              )}
            </button>
          </div>

          {/* Progress Section - mt-8 aur niche margin khatam */}
          <div className="mt-8 pt-4 border-t border-slate-100 max-w-[220px] mx-auto">
            <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
              <span>Progress</span>
              <span className="text-blue-600 font-bold">85%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-blue-600 rounded-full"></div>
            </div>
          </div>

          {/* Footer ko content ke JUST niche laya gaya hai */}
          <div className="mt-6">
            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.3em]">
              DCA • Student Portal • 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
