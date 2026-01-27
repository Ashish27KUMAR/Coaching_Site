import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import AdminLayout from "./AdminLayout";
import {
  collection,
  setDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Eye,
  CheckCircle,
  XCircle,
  X,
  Phone,
  Mail,
  Book,
} from "lucide-react";

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // REAL-TIME LISTENER FOR DATA AND COUNTS
  useEffect(() => {
    setLoading(true);

    // 1. Setup Data Listener
    const collectionName =
      activeTab === "approved"
        ? "approved_admissions"
        : activeTab === "rejected"
          ? "rejected_admissions"
          : "admissions";

    const q = query(collection(db, collectionName));
    const unsubscribeData = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdmissions(data);
      setLoading(false);
    });

    // 2. Setup Count Listeners (For real-time tab badges)
    const unsubPending = onSnapshot(collection(db, "admissions"), (s) =>
      setCounts((prev) => ({ ...prev, pending: s.size })),
    );
    const unsubApproved = onSnapshot(
      collection(db, "approved_admissions"),
      (s) => setCounts((prev) => ({ ...prev, approved: s.size })),
    );
    const unsubRejected = onSnapshot(
      collection(db, "rejected_admissions"),
      (s) => setCounts((prev) => ({ ...prev, rejected: s.size })),
    );

    return () => {
      unsubscribeData();
      unsubPending();
      unsubApproved();
      unsubRejected();
    };
  }, [activeTab]);

  const handleApprove = async (student) => {
    if (window.confirm("Move this student to Approved?")) {
      try {
        const studentRef = doc(db, "approved_admissions", student.id);
        await setDoc(studentRef, {
          ...student,
          status: "approved",
          actionDate: new Date(),
        });
        await deleteDoc(doc(db, "admissions", student.id));
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  const handleReject = async (student) => {
    if (window.confirm("Move this student to Rejected?")) {
      try {
        const studentRef = doc(db, "rejected_admissions", student.id);
        await setDoc(studentRef, {
          ...student,
          status: "rejected",
          actionDate: new Date(),
        });
        await deleteDoc(doc(db, "admissions", student.id));
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-20 px-2 md:p-4">
        {/* Header aur Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 md:px-0">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
              {activeTab} List
            </h2>
            <p className="text-slate-500 font-medium text-sm md:text-base">
              Manage your database collections
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
            {["pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 md:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-md scale-105"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
                <span
                  className={`ml-1 px-2 py-0.5 rounded-md text-[9px] ${activeTab === tab ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"}`}
                >
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center font-bold text-slate-400 animate-pulse">
            SYNCING...
          </div>
        ) : (
          <div className="w-full">
            {/* MOBILE VIEW: Grey Box Container */}
            <div className="md:hidden bg-slate-100/60 border border-slate-200 rounded-[2.5rem] p-3 flex flex-col gap-3 h-auto">
              {admissions.map((student) => (
                <div
                  key={student.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      {student.firstName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate capitalize">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {student.course || "DCA"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="p-2 bg-slate-50 rounded-lg text-slate-400"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                  {activeTab === "pending" && (
                    <div className="flex gap-2 pt-3 border-t border-slate-50">
                      <button
                        onClick={() => handleApprove(student)}
                        className="flex-1 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(student)}
                        className="flex-1 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase border border-red-100"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {admissions.length === 0 && (
                <div className="py-10 text-center text-slate-400 text-[10px] font-black uppercase">
                  No Data
                </div>
              )}
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden md:block bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-6 text-[11px] font-black text-slate-400 uppercase">
                      Student
                    </th>
                    <th className="p-6 text-[11px] font-black text-slate-400 uppercase">
                      Course
                    </th>
                    <th className="p-6 text-right text-[11px] font-black text-slate-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {admissions.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/40 transition-colors"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black uppercase">
                            {student.firstName?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 capitalize leading-tight">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-[10px] font-black text-slate-600 uppercase bg-slate-100 px-3 py-1 rounded-full">
                          {student.course || "DCA"}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="p-2 bg-slate-100 text-slate-600 rounded-xl"
                          >
                            <Eye size={18} />
                          </button>
                          {activeTab === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(student)}
                                className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleReject(student)}
                                className="p-2 bg-red-50 text-red-600 rounded-xl"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Real-time Modal */}
        <AnimatePresence>
          {selectedStudent && (
            <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedStudent(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="relative bg-white w-full max-w-2xl rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden"
              >
                <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-black text-slate-800 uppercase text-sm">
                    Student Profile
                  </h3>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="p-2 bg-white rounded-full shadow-sm"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-3 no-scrollbar">
                  <DetailBox
                    icon={Users}
                    label="Full Name"
                    value={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                  />
                  <DetailBox
                    icon={Phone}
                    label="Phone"
                    value={selectedStudent.phone}
                  />
                  <DetailBox
                    icon={Mail}
                    label="Email"
                    value={selectedStudent.email}
                  />
                  <DetailBox
                    icon={Book}
                    label="Class"
                    value={selectedStudent.selectedClass}
                  />
                </div>
                {activeTab === "pending" && (
                  <div className="p-4 bg-white flex gap-3 border-t">
                    <button
                      onClick={() => {
                        handleApprove(selectedStudent);
                        setSelectedStudent(null);
                      }}
                      className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold active:scale-95 transition-transform"
                    >
                      Approve Now
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedStudent);
                        setSelectedStudent(null);
                      }}
                      className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-bold active:scale-95 transition-transform"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}

function DetailBox({ icon: Icon, label, value }) {
  return (
    <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-3">
      <div className="p-2 bg-slate-50 text-slate-400 rounded-xl">
        <Icon size={18} />
      </div>
      <div className="overflow-hidden">
        <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5 tracking-widest">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-700 truncate">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}
