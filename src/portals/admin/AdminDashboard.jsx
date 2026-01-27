import AdminLayout from "./AdminLayout";
import { Users, FileText, BookOpen, LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-20 px-2 md:p-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-black text-slate-800 tracking-tight">
            <LayoutDashboard className="text-blue-600" size={32} />
            Admission Forms
          </h1>
          <p className="text-slate-500 font-medium mb-10">
            All student submissions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <p className="text-slate-500 font-bold text-sm uppercase">
              Total Students
            </p>
            <h3 className="text-4xl font-black text-slate-900 mt-1">1,240</h3>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen size={24} />
            </div>
            <p className="text-slate-500 font-bold text-sm uppercase">
              Active Courses
            </p>
            <h3 className="text-4xl font-black text-slate-900 mt-1">12</h3>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <FileText size={24} />
            </div>
            <p className="text-slate-500 font-bold text-sm uppercase">
              New Applications
            </p>
            <h3 className="text-4xl font-black text-slate-900 mt-1">28</h3>
          </div>
        </div>

        {/* Recent Activity Table or Placeholder */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Quick Actions
          </h3>
          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
              Upload New Notes
            </button>
            <button className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">
              View Site Analytics
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
