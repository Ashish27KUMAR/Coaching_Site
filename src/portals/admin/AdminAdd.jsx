import { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  UserPlus,
  Loader2,
  KeyRound,
  BookOpen,
  Users,
  Smartphone,
  Home,
  CheckSquare,
  Square,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "./AdminLayout";
import emailjs from "@emailjs/browser";

export default function AdminAdd() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    altPhone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    teachingClass: "",
    teachingSubject: "",
    designation: "",
    tempAddress: "",
    permAddress: "",
  });

  const [isSameAddress, setIsSameAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  useEffect(() => {
    if (isSameAddress) {
      setFormData((prev) => ({ ...prev, permAddress: prev.tempAddress }));
    }
  }, [isSameAddress, formData.tempAddress]);

  const generateFormatPassword = (name, dob) => {
    if (!name || !dob) return "ADMIN@123";
    const firstThree = name.replace(/\s/g, "").substring(0, 3).toUpperCase();
    const birthYear = dob.split("-")[0];
    return `${firstThree}${birthYear}`;
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const fullName = `${formData.firstName} ${formData.lastName}`;
    const formattedPassword = generateFormatPassword(
      formData.firstName,
      formData.dob,
    );

    if (
      !window.confirm(
        `Confirm Registration for ${fullName}?\nPassword: ${formattedPassword}`,
      )
    )
      return;

    setLoading(true);
    try {
      const q = query(
        collection(db, "admins"),
        where("email", "==", formData.email.toLowerCase().trim()),
      );
      const checkSnap = await getDocs(q);
      if (!checkSnap.empty) throw new Error("Email already exists!");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.toLowerCase().trim(),
        formattedPassword,
      );

      await addDoc(collection(db, "admins"), {
        uid: userCredential.user.uid,
        ...formData,
        name: fullName,
        role: "admin",
        createdAt: serverTimestamp(),
      });

      await emailjs.send(
        "service_zuocjby",
        "template_kipbe9k",
        {
          to_name: fullName,
          to_email: formData.email,
          admin_password: formattedPassword,
          designation: formData.designation,
        },
        "6Jyb3jiw7AcgP0POu",
      );

      setStatus({ type: "success", msg: "Staff Registered Successfully!" });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        altPhone: "",
        dob: "",
        gender: "",
        bloodGroup: "",
        teachingClass: "",
        teachingSubject: "",
        designation: "",
        tempAddress: "",
        permAddress: "",
      });
      setIsSameAddress(false);
    } catch (error) {
      setStatus({ type: "error", msg: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-20 px-2 md:p-4">
        {/* Header Section */}
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-black text-slate-800 tracking-tight">
            <UserPlus className="text-blue-600" size={32} />
            Admission Forms
          </h1>
          <p className="text-slate-500 font-medium mb-10">
            All student submissions
          </p>
        </div>

        <form onSubmit={handleAddAdmin} className="space-y-8">
          {/* Section 1: Personal Identity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-wrapper"
          >
            <h2 className="section-title">
              <Users size={18} /> Personal Identity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="label-style">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  className="input-style"
                  type="text"
                  placeholder="Enter First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="label-style">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  className="input-style"
                  type="text"
                  placeholder="Enter Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="label-style">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  className="input-style"
                  type="date"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="label-style">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    className="input-style pr-10"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="label-style">Blood Group</label>
                <div className="relative">
                  <select
                    className="input-style pr-10"
                    value={formData.bloodGroup}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodGroup: e.target.value })
                    }
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-wrapper"
          >
            <h2 className="section-title">
              <Smartphone size={18} /> Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="label-style">
                  Official Email <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  className="input-style"
                  type="email"
                  placeholder="example@school.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label-style">
                  Primary Phone <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  className="input-style"
                  type="tel"
                  placeholder="91XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label-style">Alt Phone</label>
                <input
                  className="input-style"
                  type="tel"
                  placeholder="Optional Number"
                  value={formData.altPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, altPhone: e.target.value })
                  }
                />
              </div>
            </div>
          </motion.div>

          {/* Section 3: Professional Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-wrapper"
          >
            <h2 className="section-title">
              <BookOpen size={18} /> Professional Role
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="label-style">
                  Designation <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  placeholder="HOD, Teacher, Admin..."
                  className="input-style"
                  type="text"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label-style">
                  Teaching Class <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    className="input-style pr-10"
                    value={formData.teachingClass}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        teachingClass: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Class</option>
                    <option value="Primary">Primary</option>
                    <option value="6th - 8th">6th - 8th</option>
                    <option value="9th - 10th">9th - 10th</option>
                    <option value="11th - 12th">11th - 12th</option>
                    <option value="All">All Classes</option>
                    <option value="None">Not Applicable</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>
              <div>
                <label className="label-style">
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    className="input-style pr-10"
                    value={formData.teachingSubject}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        teachingSubject: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="None">Not Applicable</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 4: Address Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-wrapper border-l-4 border-l-indigo-500"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="section-title !mb-0">
                <Home size={18} /> Address Details
              </h2>
              <button
                type="button"
                onClick={() => setIsSameAddress(!isSameAddress)}
                className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                {isSameAddress ? (
                  <CheckSquare size={16} className="text-indigo-600" />
                ) : (
                  <Square size={16} />
                )}
                Same as Temporary Address
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label-style">
                  Temporary Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Street, City, State, Pincode"
                  className="input-style py-3 h-24 resize-none"
                  value={formData.tempAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, tempAddress: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label-style">
                  Permanent Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows="3"
                  disabled={isSameAddress}
                  placeholder="Street, City, State, Pincode"
                  className={`input-style py-3 h-24 resize-none ${isSameAddress ? "bg-slate-100 opacity-70 cursor-not-allowed" : ""}`}
                  value={formData.permAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, permAddress: e.target.value })
                  }
                />
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {status.msg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-xl text-sm font-bold border flex items-center gap-3 ${status.type === "success" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${status.type === "success" ? "bg-green-500" : "bg-red-500"}`}
                  />
                  {status.msg}
                </motion.div>
              )}
            </AnimatePresence>
            <button
              disabled={loading}
              type="submit"
              className="btn-primary-admin group shadow-xl shadow-indigo-100"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <KeyRound
                    size={20}
                    className="group-hover:rotate-12 transition-transform"
                  />{" "}
                  Confirm & Register Staff
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .card-wrapper { background: white; padding: 2rem; border-radius: 2rem; border: 1px solid #f1f5f9; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.02); }
        .section-title { font-size: 0.9rem; font-weight: 800; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
        .label-style { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 0.5rem; margin-left: 0.25rem; }
        .input-style { width: 100%; padding: 0.8rem 1.2rem; background: #f8fafc; border: 2px solid #f1f5f9; border-radius: 1rem; font-weight: 600; color: #1e293b; outline: none; transition: all 0.2s; appearance: none; }
        .input-style:focus { border-color: #4f46e5; background: white; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }
        .btn-primary-admin { width: 100%; padding: 1.25rem; background: #4f46e5; color: white; border-radius: 1.25rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.3s; border: none; cursor: pointer; }
        .btn-primary-admin:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3); }
        .btn-primary-admin:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </AdminLayout>
  );
}
