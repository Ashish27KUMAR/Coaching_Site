import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  User,
  Phone,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  Mail,
  Zap,
  TrendingUp,
} from "lucide-react";
import StudentNavbar from "./StudentNavbar";

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [rankData, setRankData] = useState({ rank: "-", total: "-" });
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user?.email) return;

      try {
        // Query from approved_admissions
        const q = query(
          collection(db, "approved_admissions"),
          where("email", "==", user.email),
        );
        const snap = await getDocs(q);

        if (!snap.empty) {
          const studentData = snap.docs[0].data();
          setStudent(studentData);

          // Get class-wise leaderboard
          const classQ = query(
            collection(db, "approved_admissions"),
            where("selectedClass", "==", studentData.selectedClass),
          );
          const classSnap = await getDocs(classQ);

          const students = classSnap.docs
            .map((d) => ({
              ...d.data(),
              // Use real score if exists, else mock for UI feel
              score: d.data().score || Math.floor(Math.random() * 30) + 70,
            }))
            .sort((a, b) => b.score - a.score);

          setRankData({
            rank: students.findIndex((s) => s.email === user.email) + 1,
            total: students.length,
          });
          setTopStudents(students.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const displayData = student || {};

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <StudentNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* --- DYNAMIC HEADER --- */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto text-center sm:text-left">
            {/* Profile Pic */}
            <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-4xl font-black shrink-0 shadow-xl shadow-blue-100 overflow-hidden border-4 border-white">
              {displayData.photoUrl ? (
                <img
                  src={displayData.photoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                displayData.firstName?.charAt(0) || <User size={40} />
              )}
            </div>

            {/* Info Section: Name -> Email -> Class */}
            <div className="flex flex-col space-y-2">
              {/* 1. Name */}
              <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase leading-none">
                {displayData.firstName} {displayData.lastName}
              </h1>

              {/* 2. Email */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-500 font-bold text-sm">
                <Mail size={14} className="text-slate-400" />
                <span>{displayData.email}</span>
              </div>

              {/* 3. Class Badge */}
              <div className="flex justify-center sm:justify-start">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-md shadow-blue-100">
                  {displayData.selectedClass || "Class Not Assigned"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0">
            <QuickStat
              label="Rank"
              value={`#${rankData.rank}`}
              color="text-blue-600"
            />
            <QuickStat
              label="Attendance"
              value="94%"
              color="text-emerald-500"
            />
            <QuickStat label="GPA" value="8.2" color="text-indigo-600" />
          </div>
        </div>

        {/* --- RESPONSIVE DASHBOARD GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. IDENTITY BRIEF (Personal Info) */}
          <SectionCard
            title="Identity Brief"
            icon={<User size={18} className="text-blue-600" />}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoField label="First Name" value={displayData.firstName} />
                <InfoField label="Last Name" value={displayData.lastName} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoField
                  label="Birth Date"
                  value={displayData.dob}
                  icon={<Calendar size={14} />}
                />
                <InfoField label="Gender" value={displayData.gender} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoField label="Blood Type" value={displayData.bloodGroup} />
                <InfoField label="Class" value={displayData.selectedClass} />
              </div>
            </div>
          </SectionCard>

          {/* 2. FAMILY CONNECT (Parents Details) */}
          <SectionCard
            title="Family Connect"
            icon={<Award size={18} className="text-amber-500" />}
          >
            <div className="space-y-4">
              <InfoField label="Father's Name" value={displayData.fatherName} />
              <InfoField
                label="Father's Phone"
                value={displayData.fatherPhone}
                icon={<Phone size={14} />}
              />
              <div className="border-t/50 border-t border-slate-200 pt-2">
                <InfoField
                  label="Mother's Name"
                  value={displayData.motherName}
                />
                <InfoField
                  label="Mother's Phone"
                  value={displayData.motherPhone}
                  icon={<Phone size={14} />}
                />
              </div>
            </div>
          </SectionCard>

          {/* 3. CONTACT & SOURCE (New Fields) */}
          <SectionCard
            title="Contact & Reach"
            icon={<Phone size={18} className="text-emerald-500" />}
          >
            <div className="space-y-4">
              <InfoField
                label="Email"
                value={displayData.email}
                icon={<Mail size={14} />}
              />
              <InfoField label="Primary Phone" value={displayData.phone} />
              <InfoField
                label="Alt Contact"
                value={displayData.altContact || "N/A"}
              />
              <div className="bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                <p className="text-[9px] font-black text-slate-400 uppercase">
                  Heard From
                </p>
                <p className="text-xs font-bold text-blue-600">
                  {displayData.heardFrom}
                </p>
              </div>
            </div>
          </SectionCard>

          {/* 6. LOCATION (Address Details) */}
          <SectionCard
            title="Location"
            icon={<MapPin size={18} className="text-red-500" />}
          >
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border-l-4 border-blue-600">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                  Current
                </p>
                <p className="text-[11px] font-bold text-slate-700 leading-tight">
                  {displayData.tempAddress}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border-l-4 border-slate-300">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                  Permanent
                </p>
                <p className="text-[11px] font-bold text-slate-700 leading-tight">
                  {displayData.permAddress || displayData.tempAddress}
                </p>
              </div>
            </div>
          </SectionCard>

          {/* 8. CURRICULUM & SUBJECTS (New Card) */}
          <SectionCard
            title="Academic Focus"
            icon={<BookOpen size={18} className="text-blue-600" />}
          >
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  Chosen Subjects
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {displayData.selectedSubjects?.map((sub, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-[10px] font-black border border-blue-100"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
              {displayData.additionalNotes && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <p className="text-[9px] font-black text-amber-600 uppercase">
                    Special Instructions
                  </p>
                  <p className="text-[11px] text-amber-800 italic">
                    {displayData.additionalNotes}
                  </p>
                </div>
              )}
            </div>
          </SectionCard>

          {/* 5. TOP PERFORMERS (Old Field) */}
          <SectionCard
            title="Top Performers"
            icon={<Award size={18} className="text-amber-500" />}
          >
            <div className="space-y-3">
              {topStudents.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-xl text-[11px] font-black shadow-sm ${i === 0 ? "bg-amber-400 text-white" : "bg-white text-slate-500"}`}
                    >
                      {i + 1}
                    </div>
                    <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                      {s.firstName} {s.lastName?.charAt(0)}.
                    </p>
                  </div>
                  <p className="text-sm font-black text-slate-900">
                    {s.score}%
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 4. PERFORMANCE TREND (Old Field) */}
          <SectionCard
            title="Performance Trend"
            icon={<TrendingUp size={18} className="text-emerald-500" />}
          >
            <div className="h-48 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockProgress}>
                  <XAxis dataKey="m" hide />
                  <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "15px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="s"
                    stroke="#2563eb"
                    strokeWidth={4}
                    dot={{ fill: "#2563eb", r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl mt-4 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                Consistency
              </span>
              <span className="text-sm font-bold text-blue-600">
                High (92%)
              </span>
            </div>
          </SectionCard>

          {/* 7. SKILL ANALYSIS (Old Field) */}
          <SectionCard
            title="Skill Analysis"
            icon={<Zap size={18} className="text-indigo-500" />}
          >
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={mockRadar}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="sub"
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                  />
                  <Radar
                    dataKey="v"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* 9. ACADEMIC ALERTS (Notice Box) */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-black italic mb-4 uppercase tracking-tighter">
                Academic Alerts
              </h3>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <p className="text-[10px] font-bold opacity-70 uppercase">
                    Portal Status
                  </p>
                  <p className="text-xs font-medium">
                    Application: {displayData.status || "Approved"}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <p className="text-[10px] font-bold opacity-70 uppercase">
                    Library
                  </p>
                  <p className="text-xs font-medium">
                    Clear your dues by this weekend.
                  </p>
                </div>
              </div>
            </div>
            <button className="mt-8 w-full py-4 bg-white text-blue-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all">
              Open Portal Notices
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center opacity-40 px-4 gap-4">
          <p className="text-[9px] font-black uppercase tracking-[0.3em]">
            SECURE ACCESS • {new Date().getFullYear()}
          </p>
          <div className="flex gap-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- REUSABLE ATOMS ---

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[2.2rem] p-7 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        {icon && <span className="p-2 bg-slate-50 rounded-xl">{icon}</span>}
        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest leading-none">
          {title}
        </h3>
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );
}

function InfoField({ label, value, icon }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </span>
      <div className="flex items-center gap-2 mt-1">
        {icon && <span className="text-slate-300">{icon}</span>}
        <span className="text-[13px] font-bold text-slate-700 italic">
          {value || "Not Specified"}
        </span>
      </div>
    </div>
  );
}

function QuickStat({ label, value, color }) {
  return (
    <div className="text-center px-2 py-1">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">
        {label}
      </p>
      <p
        className={`text-xl sm:text-2xl font-black italic tracking-tighter ${color}`}
      >
        {value}
      </p>
    </div>
  );
}

const mockProgress = [
  { m: 1, s: 65 },
  { m: 2, s: 72 },
  { m: 3, s: 68 },
  { m: 4, s: 85 },
  { m: 5, s: 82 },
];
const mockRadar = [
  { sub: "PHY", v: 85 },
  { sub: "CHE", v: 75 },
  { sub: "MAT", v: 98 },
  { sub: "ENG", v: 90 },
  { sub: "CS", v: 95 },
];
