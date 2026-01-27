import { useState } from "react";
import StudentNavbar from "./StudentNavbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { Calendar, CheckCircle, Clock, BookOpen } from "lucide-react";

export default function StudentAttendance() {
  const [showDateWise, setShowDateWise] = useState(false);

  const subjects = [
    { name: "Physics", present: 46, absent: 4 },
    { name: "Chemistry", present: 44, absent: 6 },
    { name: "Maths", present: 47.5, absent: 2.5 },
    { name: "Biology", present: 45, absent: 5 },
  ];

  const pieData = [
    { name: "Present", value: subjects.reduce((a, s) => a + s.present, 0) },
    { name: "Absent", value: subjects.reduce((a, s) => a + s.absent, 0) },
  ];

  const COLORS = ["#10b981", "#f43f5e"];

  // --- UPDATED DATES WITH YEAR ---
  const dateWise = [
    { date: "01-Oct-2025", P: "P", C: "P", M: "P", B: "A" },
    { date: "02-Oct-2025", P: "P", C: "P", M: "P", B: "P" },
    { date: "03-Oct-2025", P: "A", C: "P", M: "P", B: "P" },
    { date: "04-Oct-2025", P: "P", C: "A", M: "P", B: "P" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <StudentNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- HEADER --- */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">
              Attendance Dashboard
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Real-time tracking of your academic presence
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <QuickStat
              label="Total Hours"
              value="195"
              icon={<Clock size={16} />}
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <QuickStat
              label="Overall %"
              value="92.4%"
              icon={<CheckCircle size={16} />}
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
          </div>
        </div>

        {/* --- CHARTS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* BAR CHART */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen size={18} className="text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Subject-wise Hours
              </h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={subjects}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 600, fill: "#64748b" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 600, fill: "#64748b" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    content={<CustomTooltip />}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{
                      paddingBottom: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Bar
                    name="Present"
                    dataKey="present"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    barSize={35}
                  />
                  <Bar
                    name="Absent"
                    dataKey="absent"
                    fill="#f43f5e"
                    radius={[6, 6, 0, 0]}
                    barSize={35}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider self-start mb-4">
              Presence Share
            </h3>
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={75}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-3xl font-bold text-slate-800">92%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Average
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <LegendIndicator color="bg-emerald-500" label="Present" />
              <LegendIndicator color="bg-rose-500" label="Absent" />
            </div>
          </div>
        </div>

        {/* --- SUMMARY TABLE (FIXED) --- */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm mb-8 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Attendance Summary
            </h3>
          </div>
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="w-[35%] px-4 py-4 text-left text-[11px] font-bold text-slate-500 uppercase">
                  Subject
                </th>
                <th className="w-[20%] px-2 py-4 text-center text-[11px] font-bold text-slate-500 uppercase">
                  Present
                </th>
                <th className="w-[20%] px-2 py-4 text-center text-[11px] font-bold text-slate-500 uppercase">
                  Absent
                </th>
                <th className="w-[25%] px-4 py-4 text-right text-[11px] font-bold text-slate-500 uppercase">
                  Total %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {subjects.map((sub, i) => {
                const total = sub.present + sub.absent;
                const per = ((sub.present / total) * 100).toFixed(0);
                return (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-4 font-bold text-slate-700 text-sm truncate">
                      {sub.name}
                    </td>
                    <td className="px-2 py-4 text-center text-emerald-600 font-bold text-sm">
                      {sub.present}
                    </td>
                    <td className="px-2 py-4 text-center text-rose-500 font-bold text-sm">
                      {sub.absent}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${per >= 75 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                      >
                        {per}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* --- DATE WISE (WITH YEAR) --- */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setShowDateWise(!showDateWise)}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 mb-8"
          >
            <Calendar size={18} />
            {showDateWise ? "Hide Daily Logs" : "View Detailed Daily Logs"}
          </button>

          {showDateWise && (
            <div className="w-full bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-100">
                    <th className="w-[35%] p-4 pl-8 text-left">Date</th>

                    <th className="w-[16%] p-2 text-center">Phy</th>
                    <th className="w-[16%] p-2 text-center">Che</th>
                    <th className="w-[16%] p-2 text-center">Mat</th>
                    <th className="w-[17%] p-2 text-center">Bio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {dateWise.map((row, i) => (
                    <tr key={i} className="text-sm">
                      <td className="p-4 font-bold text-slate-600 text-xs sm:text-sm">
                        {row.date}
                      </td>
                      {[row.P, row.C, row.M, row.B].map((status, j) => (
                        <td key={j} className="p-2 text-center">
                          <span
                            className={`w-7 h-7 inline-flex items-center justify-center rounded-lg font-bold text-[11px] ${status === "P" ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}
                          >
                            {status}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="text-center mt-6 mb-4 text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">
          DCA • Student Portal • 2026
        </p>
      </div>
    </div>
  );
}

// Sub-components used (QuickStat, LegendIndicator, CustomTooltip) remain the same as above.
function QuickStat({ label, value, icon, color, bg }) {
  return (
    <div className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center shadow-sm">
      <div className={`p-2 rounded-xl mb-2 ${bg} ${color}`}>{icon}</div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
        {label}
      </p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}

function LegendIndicator({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-[11px] font-bold text-slate-500 uppercase">
        {label}
      </span>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl">
        <p className="text-xs font-bold text-slate-800 mb-2 border-b pb-1">
          {payload[0].payload.name}
        </p>
        <p className="text-xs font-bold text-emerald-600">
          Present: {payload[0].value}h
        </p>
        <p className="text-xs font-bold text-rose-500">
          Absent: {payload[1].value}h
        </p>
      </div>
    );
  }
  return null;
};
