import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import AdminLayout from "./AdminLayout";
import {
  collection,
  setDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
// Auth Imports
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { initializeApp, getApp, getApps } from "firebase/app";
import { firebaseConfig } from "../../firebase/firebase";

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
  ClipboardList,
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

  useEffect(() => {
    setLoading(true);
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

    const unsubPending = onSnapshot(collection(db, "admissions"), (s) =>
      setCounts((prev) => ({ ...prev, pending: s.size })),
    );
    const unsubApproved = onSnapshot(
      collection(db, "approved_admissions"),
      (s) => setCounts((prev) => ({ ...prev, approved: s.size })),
    );
    const unsubRejected = onSnapshot(
      collection(db, "rejected_admissions"), // ✅ Single collection call
      (s) => setCounts((prev) => ({ ...prev, rejected: s.size })),
    );

    return () => {
      unsubscribeData();
      unsubPending();
      unsubApproved();
      unsubRejected();
    };
  }, [activeTab]);

  // --- New Custom Password Generator ---
  // Example: Ashish + 2004-05-12 => ASH2004
  const generateCustomPassword = (name, dob) => {
    const prefix = name.substring(0, 3).toUpperCase();
    const year = dob.match(/\d{4}/)?.[0] || "2024"; // Extract 4 digits year or default
    return `${prefix}${year}`;
  };

  const handleApprove = async (student) => {
    // Custom password generation
    const autoPassword = generateCustomPassword(student.firstName, student.dob);

    if (
      window.confirm(
        `Approve ${student.firstName}?\nStudent Account will be created.\nPassword: ${autoPassword}`,
      )
    ) {
      try {
        setLoading(true);

        // Manage Secondary Firebase Instance to prevent Admin Logout
        let secondaryApp;
        if (!getApps().find((app) => app.name === "SecondaryApp")) {
          secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
        } else {
          secondaryApp = getApp("SecondaryApp");
        }

        const secondaryAuth = getAuth(secondaryApp);

        // 1. Create Student Auth Account
        const userCredential = await createUserWithEmailAndPassword(
          secondaryAuth,
          student.email,
          autoPassword,
        );

        const uid = userCredential.user.uid;

        // 2. Save to Approved Collection
        const studentRef = doc(db, "approved_admissions", student.id);
        await setDoc(studentRef, {
          ...student,
          uid: uid,
          status: "approved",
          generatedPassword: autoPassword,
          actionDate: new Date(),
        });

        // 3. Remove from Pending
        await deleteDoc(doc(db, "admissions", student.id));

        // 4. Logout the newly created student from secondary instance & cleanup
        await signOut(secondaryAuth);

        alert(
          `Success! Account created for ${student.firstName}.\nID: ${student.email}\nPass: ${autoPassword}`,
        );
      } catch (error) {
        console.error(error);
        alert(
          "Error: " +
            (error.code === "auth/email-already-in-use"
              ? "Email already exists in Auth!"
              : error.message),
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const [previewImage, setPreviewImage] = useState(null);

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
        {/* Requested Header */}
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-black text-slate-800 tracking-tight">
            <ClipboardList className="text-blue-600" size={32} />
            Admission Forms
          </h1>
          <p className="text-slate-500 font-medium mb-10">
            All student submissions
          </p>
        </div>

        {/* Tabs section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="px-1">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
              {activeTab}
            </h2>
          </div>

          <div className="flex flex-wrap bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full md:w-auto">
            {["pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {tab}
                <span className="opacity-50 text-[9px]">({counts[tab]})</span>
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
            {/* MOBILE VIEW */}
            <div className="md:hidden bg-slate-100/60 border border-slate-200 rounded-[2.5rem] p-3 flex flex-col gap-3 h-auto">
              {admissions.map((student) => (
                <div
                  key={student.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                      {student.photoUrl ? (
                        <img
                          src={student.photoUrl}
                          alt="Student"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-blue-600">
                          {student.firstName?.[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate capitalize">
                        {student.firstName} {student.lastName}
                      </p>
                      <div className="flex gap-2 items-center">
                        <p className="text-[10px] text-slate-500 truncate">
                          Class: {student.selectedClass || "N/A"}
                        </p>
                        <span className="text-[10px] bg-slate-100 px-2 rounded font-bold text-blue-600 uppercase">
                          {activeTab}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-slate-50">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase"
                    >
                      <Eye size={14} /> View
                    </button>
                    {activeTab === "pending" && (
                      <>
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
                      </>
                    )}
                  </div>
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
                      Class
                    </th>
                    <th className="p-6 text-[11px] font-black text-slate-400 uppercase">
                      Status
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
                          <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-100 flex items-center justify-center shrink-0">
                            {student.photoUrl ? (
                              <img
                                src={student.photoUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="font-black text-blue-600 uppercase">
                                {student.firstName?.[0]}
                              </span>
                            )}
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
                          {student.selectedClass || "N/A"}
                        </span>
                      </td>
                      <td className="p-6">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-1 rounded ${
                            activeTab === "approved"
                              ? "bg-emerald-100 text-emerald-600"
                              : activeTab === "rejected"
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {activeTab}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200"
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

        {/* Modal Component */}
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
                className="relative bg-white w-full max-w-2xl rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h3 className="font-black text-slate-800 uppercase text-sm tracking-tight">
                      Student Profile
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Registration Details
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto space-y-8 no-scrollbar bg-slate-50/30">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative group cursor-pointer">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(selectedStudent.photoUrl);
                        }}
                      >
                        {selectedStudent.photoUrl ? (
                          <img
                            src={selectedStudent.photoUrl}
                            alt="Student"
                            className="w-24 h-24 rounded-[2rem] object-cover border-4 border-white shadow-xl hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-3xl shadow-lg">
                            {selectedStudent.firstName?.[0]}
                          </div>
                        )}
                      </div>
                    </div>
                    <h4 className="mt-4 text-2xl font-black text-slate-800 capitalize leading-tight">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h4>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter mt-1">
                      ID: {selectedStudent.id.slice(-6)} •{" "}
                      {selectedStudent.gender || "N/A"}
                    </span>
                  </div>

                  {/* Sections */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">
                      Personal Details
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <DetailBox
                        icon={Mail}
                        label="Email Address"
                        value={selectedStudent.email}
                      />
                      <DetailBox
                        icon={Phone}
                        label="Primary Phone"
                        value={selectedStudent.phone}
                      />
                      <DetailBox
                        icon={Book}
                        label="Date of Birth"
                        value={selectedStudent.dob}
                      />
                      <DetailBox
                        icon={ClipboardList}
                        label="Blood Group"
                        value={selectedStudent.bloodGroup}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">
                      Family Details
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <DetailBox
                        icon={Users}
                        label="Father's Name"
                        value={selectedStudent.fatherName}
                      />
                      <DetailBox
                        icon={Phone}
                        label="Father's Phone"
                        value={selectedStudent.fatherPhone}
                      />
                      <DetailBox
                        icon={Users}
                        label="Mother's Name"
                        value={selectedStudent.motherName}
                      />
                      <DetailBox
                        icon={Phone}
                        label="Mother's Phone"
                        value={selectedStudent.motherPhone}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">
                      Academic Info
                    </h5>
                    <div className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase">
                          Target Class
                        </span>
                        <span className="text-sm font-black text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-lg">
                          {selectedStudent.selectedClass}
                        </span>
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">
                        Enrolled Subjects
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.selectedSubjects?.map((sub, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg border border-slate-200 uppercase"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">
                      Residential Address
                    </h5>
                    <div className="space-y-3">
                      <DetailBox
                        icon={ClipboardList}
                        label="Temporary Address"
                        value={selectedStudent.tempAddress}
                      />
                      <DetailBox
                        icon={ClipboardList}
                        label="Permanent Address"
                        value={selectedStudent.permAddress}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">
                      Additional Info
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <DetailBox
                        icon={Users}
                        label="Heard From"
                        value={selectedStudent.heardFrom}
                      />
                      <DetailBox
                        icon={Phone}
                        label="Alt. Contact"
                        value={selectedStudent.altContact || "N/A"}
                      />
                    </div>
                    {selectedStudent.additionalNotes && (
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mt-2">
                        <p className="text-[9px] font-black text-amber-600 uppercase mb-1 tracking-widest">
                          Notes
                        </p>
                        <p className="text-sm text-slate-700 italic leading-relaxed">
                          "{selectedStudent.additionalNotes}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                {activeTab === "pending" && (
                  <div className="p-4 bg-white flex gap-3 border-t">
                    <button
                      onClick={() => {
                        handleApprove(selectedStudent);
                        setSelectedStudent(null);
                      }}
                      className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 transition"
                    >
                      Approve Now
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedStudent);
                        setSelectedStudent(null);
                      }}
                      className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-black uppercase text-xs tracking-widest border border-red-100 hover:bg-red-100 transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* Full Screen Image Preview */}
          <AnimatePresence>
            {previewImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPreviewImage(null)}
                className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-lg flex items-center justify-center p-2 md:p-10"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage(null);
                  }}
                  className="absolute top-4 right-4 md:top-10 md:right-10 p-2 md:p-4 bg-white/10 text-white rounded-full transition-all duration-300 hover:bg-red-600 hover:rotate-90 z-[310]"
                >
                  <X className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
                </button>

                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  src={previewImage}
                  className="w-auto h-auto max-w-[95vw] max-h-[80vh] md:max-h-[90vh] rounded-xl md:rounded-3xl shadow-2xl border-2 md:border-4 border-white/20 object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                  alt="Preview"
                />
              </motion.div>
            )}
          </AnimatePresence>
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
