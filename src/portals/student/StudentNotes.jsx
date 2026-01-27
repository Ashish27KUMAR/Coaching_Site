import Guess from "../../assets/study_resources/Guess_paper.png";
import Notes from "../../assets/study_resources/Notes.png";
import PYQ from "../../assets/study_resources/Pyq.png";
import Videos from "../../assets/study_resources/Recorded_video.png";
import StudentNavbar from "./StudentNavbar";
import {
  BookOpen,
  Bell,
  ArrowUpRight,
  FileText,
  Video,
  Award,
} from "lucide-react";

export default function StudentNotes() {
  const resources = [
    {
      title: "Revision Notes",
      description: "Subject-wise notes uploaded by admin for quick revision.",
      link: "#",
      img: Notes,
      badge: "New",
      count: "12 PDFs",
      icon: <FileText size={18} className="text-blue-500" />,
      theme: "bg-blue-50",
    },
    {
      title: "PYQ Papers",
      description: "Previous year question papers for practice and exam prep.",
      link: "#",
      img: PYQ,
      badge: "Updated",
      count: "8 Papers",
      icon: <Award size={18} className="text-emerald-500" />,
      theme: "bg-emerald-50",
    },
    {
      title: "Guess Papers",
      description: "Important guess papers to focus on high-yield questions.",
      link: "#",
      img: Guess,
      badge: "Hot",
      count: "5 Papers",
      icon: <BookOpen size={18} className="text-rose-500" />,
      theme: "bg-rose-50",
    },
    {
      title: "Recorded Videos",
      description:
        "Lecture videos for all subjects to understand concepts better.",
      link: "#",
      img: Videos,
      badge: "New",
      count: "20 Videos",
      icon: <Video size={18} className="text-amber-500" />,
      theme: "bg-amber-50",
    },
  ];

  const announcements = [
    {
      text: "New Maths notes uploaded for Chapter 5.",
      date: "10 Jan 2026",
      type: "update",
    },
    {
      text: "PYQ papers for Chemistry 2025 added.",
      date: "08 Jan 2026",
      type: "new",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <StudentNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- HEADER --- */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">
              Study Resources
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Your centralized hub for notes, videos, and exam materials
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="px-4 py-2 bg-blue-50 rounded-2xl flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Updates Daily
              </span>
            </div>
          </div>
        </div>

        {/* --- ANNOUNCEMENTS SECTION --- */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={20} className="text-amber-500" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Latest Announcements
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {announcements.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                    {item.text}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-wider">
                    {item.date}
                  </span>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-slate-300 group-hover:text-blue-500 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* --- RESOURCE GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {resources.map((res, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group relative overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-slate-50 flex items-center justify-center">
                {res.badge && (
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest z-10 shadow-sm
                    ${
                      res.badge === "Hot"
                        ? "bg-rose-500 text-white"
                        : res.badge === "Updated"
                          ? "bg-emerald-500 text-white"
                          : "bg-blue-600 text-white"
                    }`}
                  >
                    {res.badge}
                  </span>
                )}
                <img
                  src={res.img}
                  alt={res.title}
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Text Content */}
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${res.theme}`}>
                  {res.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  {res.title}
                </h3>
              </div>

              <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4">
                {res.description}
              </p>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  {res.count}
                </span>
                <a
                  href={res.link}
                  className="flex items-center gap-1.5 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                  Access Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* --- FOOTER NOTE --- */}
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 text-center max-w-3xl mx-auto">
          <BookOpen className="mx-auto text-blue-500 mb-3" size={32} />
          <p className="text-blue-800 font-bold text-sm mb-1 uppercase tracking-widest">
            Administrator's Note
          </p>
          <p className="text-blue-600/80 text-sm font-medium">
            New study materials are verified and uploaded every weekend. If you
            cannot find a specific resource, please contact the department
            coordinator.
          </p>
        </div>
        <p className="text-center mt-6 mb-4 text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">
          DCA • Student Portal • 2026
        </p>
      </div>
    </div>
  );
}
