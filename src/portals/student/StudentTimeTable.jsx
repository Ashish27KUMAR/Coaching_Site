import { useState } from "react";
import StudentNavbar from "./StudentNavbar";
import {
  Calendar as CalendarIcon,
  Download,
  Filter,
  CheckCircle2,
  User,
  Clock,
} from "lucide-react";

export default function StudentTimeTable() {
  const [activeClass, setActiveClass] = useState("JEE");
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00"];
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const classOptions = [
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
    "JEE",
    "NEET",
  ];

  const colors = {
    math: "border-emerald-200 text-emerald-700 bg-emerald-50",
    sci: "border-blue-200 text-blue-700 bg-blue-50",
    eng: "border-purple-200 text-purple-700 bg-purple-50",
    sst: "border-amber-200 text-amber-700 bg-amber-50",
    hindi: "border-orange-200 text-orange-700 bg-orange-50",
    phys: "border-cyan-200 text-cyan-700 bg-cyan-50",
    chem: "border-indigo-200 text-indigo-700 bg-indigo-50",
    bio: "border-pink-200 text-pink-700 bg-pink-50",
    test: "border-rose-200 text-rose-700 bg-rose-50",
    extra: "border-slate-200 text-slate-700 bg-slate-100",
  };

  const dataStore = {
    "Class 6": {
      schedule: {
        "09:00-Mo": { subject: "Math", type: "Lec", color: colors.math },
        "10:00-Tu": { subject: "Science", type: "Lec", color: colors.sci },
        "11:00-We": { subject: "English", type: "Lec", color: colors.eng },
        "12:00-Th": { subject: "Hindi", type: "Lec", color: colors.hindi },
        "09:00-Fr": { subject: "SST", type: "Lec", color: colors.sst },
        "10:00-Sa": { subject: "Games", type: "Act", color: colors.extra },
      },
      teachers: [
        {
          name: "Mr. Rajesh Kumar",
          subject: "Math/Sci",
          role: "Class Teacher",
        },
      ],
    },
    "Class 7": {
      schedule: {
        "09:00-Mo": { subject: "English", type: "Lec", color: colors.eng },
        "10:00-Tu": { subject: "Math", type: "Lec", color: colors.math },
        "11:00-We": { subject: "SST", type: "Lec", color: colors.sst },
      },
      teachers: [
        { name: "Ms. Priya Sharma", subject: "English", role: "Class Teacher" },
      ],
    },
    "Class 8": {
      schedule: {
        "09:00-Mo": { subject: "Science", type: "Lab", color: colors.sci },
        "11:00-Th": { subject: "Math", type: "Lec", color: colors.math },
      },
      teachers: [
        { name: "Mr. Amit Verma", subject: "Science", role: "Class Teacher" },
      ],
    },
    "Class 9": {
      schedule: {
        "09:00-Mo": { subject: "Math", type: "Lec", color: colors.math },
        "10:00-Mo": { subject: "Physics", type: "Lec", color: colors.phys },
        "11:00-Mo": { subject: "Chem", type: "Lec", color: colors.chem },
        "09:00-Sa": { subject: "Quiz", type: "Test", color: colors.test },
      },
      teachers: [
        { name: "Dr. S. Mani", subject: "Physics", role: "Senior Faculty" },
      ],
    },
    "Class 10": {
      schedule: {
        "09:00-Mo": { subject: "Math", type: "Lec", color: colors.math },
        "10:00-Tu": { subject: "Science", type: "Lec", color: colors.sci },
        "11:00-We": { subject: "SST", type: "Lec", color: colors.sst },
        "09:00-Sa": { subject: "Pre-Board", type: "Exam", color: colors.test },
      },
      teachers: [
        {
          name: "Mrs. Kavita Rai",
          subject: "All Science",
          role: "HOD Middle School",
        },
      ],
    },
    "Class 11": {
      schedule: {
        "09:00-Mo": { subject: "Physics", type: "Lec", color: colors.phys },
        "10:00-Tu": { subject: "Chem", type: "Lec", color: colors.chem },
        "11:00-We": { subject: "Math/Bio", type: "Lec", color: colors.extra },
      },
      teachers: [
        {
          name: "Prof. S.P. Verma",
          subject: "Physics",
          role: "Senior Faculty",
        },
      ],
    },
    "Class 12": {
      schedule: {
        "09:00-Mo": { subject: "Math", type: "Lec", color: colors.math },
        "11:00-Mo": { subject: "Chem", type: "Lab", color: colors.chem },
        "09:00-Sa": { subject: "Board Mock", type: "Exam", color: colors.test },
      },
      teachers: [
        { name: "Dr. A.K. Singh", subject: "Mathematics", role: "HOD Math" },
      ],
    },
    JEE: {
      schedule: {
        "09:00-Mo": { subject: "Math", type: "Lec", color: colors.math },
        "10:00-Mo": { subject: "Phys", type: "Lec", color: colors.phys },
        "11:00-Tu": { subject: "Chem", type: "Lec", color: colors.chem },
        "09:00-Sa": { subject: "JEE Mock", type: "Test", color: colors.test },
        "11:00-Sa": { subject: "Analysis", type: "Ses", color: colors.extra },
      },
      teachers: [
        { name: "Dr. A.K. Singh", subject: "Mathematics", role: "HOD Math" },
        {
          name: "Prof. S.P. Verma",
          subject: "Physics",
          role: "Senior Faculty",
        },
        { name: "Dr. M.K. Jha", subject: "Chemistry", role: "Expert Faculty" },
      ],
    },
    NEET: {
      schedule: {
        "09:00-Mo": { subject: "Bio", type: "Lec", color: colors.bio },
        "10:00-Mo": { subject: "Bio", type: "Lab", color: colors.bio },
        "11:00-Tu": { subject: "Chem", type: "Lec", color: colors.chem },
        "09:00-Sa": { subject: "NEET Mock", type: "Test", color: colors.test },
      },
      teachers: [
        { name: "Ms. Anjali Iyer", subject: "Biology", role: "Specialist" },
        { name: "Dr. M.K. Jha", subject: "Chemistry", role: "Expert Faculty" },
      ],
    },
  };

  const currentData = dataStore[activeClass] || dataStore["JEE"];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <StudentNavbar />
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6">
        {/* --- PREMIUM HEADER --- */}
        <div className="bg-white border border-slate-200 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 mb-6 flex flex-col md:flex-row justify-between items-center shadow-sm gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            <div className="w-14 h-14 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-lg shrink-0">
              <CalendarIcon size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight">
                Academic Portal
              </h1>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" />{" "}
                {activeClass} Batch • 2026
              </p>
            </div>
          </div>
          <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg z-10">
            <Download size={16} /> Download PDF Schedule
          </button>
        </div>

        {/* --- CLASS SELECTOR --- */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-3 px-2 mb-3 border-b border-slate-50 pb-2">
            <Filter size={16} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Select Your Course
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {classOptions.map((cls) => (
              <button
                key={cls}
                onClick={() => setActiveClass(cls)}
                className={`flex-1 min-w-[85px] sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all border
                  ${activeClass === cls ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105" : "bg-slate-50 text-slate-500 border-transparent hover:border-slate-200"}`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* --- THE GRID (Optimized for no scroll) --- */}
        <div className="bg-white border border-slate-200 rounded-[2rem] sm:rounded-[2.5rem] p-2 sm:p-8 shadow-sm overflow-hidden mb-6">
          <div className="grid grid-cols-7 mb-6 border-b border-slate-50 pb-4">
            <div className="col-span-1 flex items-center justify-center text-slate-300">
              <Clock size={18} />
            </div>
            {days.map((day) => (
              <div key={day} className="text-center">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {day}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {timeSlots.map((time) => (
              <div
                key={time}
                className="grid grid-cols-7 items-center gap-1.5 sm:gap-4"
              >
                <div className="col-span-1 text-right pr-2">
                  <span className="text-[11px] sm:text-sm font-black text-slate-800 tracking-tighter">
                    {time}
                  </span>
                </div>
                {days.map((day) => {
                  const slotData = currentData.schedule[`${time}-${day}`];
                  return (
                    <div
                      key={day}
                      className={`h-14 sm:h-20 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center text-center p-1 transition-all
                        ${slotData ? `${slotData.color} shadow-sm border-current/20` : "border-slate-50 bg-slate-50/30 text-slate-200"}`}
                    >
                      {slotData ? (
                        <>
                          <span className="text-[9px] sm:text-xs font-black leading-none">
                            {slotData.subject}
                          </span>
                          <span className="text-[7px] sm:text-[9px] font-bold uppercase opacity-60 mt-1">
                            {slotData.type}
                          </span>
                        </>
                      ) : (
                        <span className="text-[8px] opacity-20">-</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* --- FACULTY MEMBERS --- */}
        <div className="bg-white border border-slate-200 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8 text-sm font-black text-slate-800 uppercase tracking-[0.2em]">
            <User size={20} className="text-blue-600" /> Subject Experts •{" "}
            {activeClass}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {currentData.teachers.map((teacher, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-400 hover:bg-white transition-all"
              >
                <img
                  className="w-12 h-12 rounded-2xl shadow-md"
                  src={`https://ui-avatars.com/api/?name=${teacher.name}&background=0284c7&color=fff`}
                  alt="faculty"
                />
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-800 truncate">
                    {teacher.name}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    {teacher.subject}
                  </p>
                  <span className="px-2 py-0.5 bg-blue-100/50 text-blue-600 text-[8px] font-black rounded-md uppercase">
                    {teacher.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center mt-6 mb-4 text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">
          DCA • Student Portal • 2026
        </p>
      </div>
    </div>
  );
}
