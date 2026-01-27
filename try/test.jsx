import { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase/firebase";
import {
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  updatePassword,
} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import StudentLayout from "./StudentLayout";
import {
  Settings,
  Camera,
  Bell,
  Laptop,
  AlertTriangle,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Trash2,
  Zap,
  Lock,
} from "lucide-react";

export default function StudentSettings() {
  const [user, setUser] = useState(null);
  const [admission, setAdmission] = useState(null);
  const [activeTab, setActiveTab] = useState("account");

  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notifs, setNotifs] = useState({
    email: true,
    classes: true,
    portal: true,
  });

  // Password States
  const [passFields, setPassFields] = useState({
    old: "",
    new: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  // Deletion States
  const [delPassword, setDelPassword] = useState("");
  const [showDelPass, setShowDelPass] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef();
  const navigate = useNavigate();

  const CLOUD_NAME = "dsiwf1ane";
  const UPLOAD_PRESET = "Student_photos";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchAdmission(currentUser.email);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchAdmission = async (email) => {
    const q = query(collection(db, "admissions"), where("email", "==", email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      setAdmission({ ...data, id: snapshot.docs[0].id });
      if (data.notifications) setNotifs(data.notifications);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/"))
      return alert("Please select a valid image!");

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();
      await updateDoc(doc(db, "admissions", admission.id), {
        profilePic: data.secure_url,
      });
      setAdmission({ ...admission, profilePic: data.secure_url });
      alert("Profile picture updated!");
    } catch (err) {
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm("Are you sure?")) return;
    setUploading(true);
    try {
      await updateDoc(doc(db, "admissions", admission.id), { profilePic: "" });
      setAdmission({ ...admission, profilePic: "" });
      alert("Profile picture removed!");
    } catch (err) {
      alert("Error removing image.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passFields.old || !passFields.new || !passFields.confirm)
      return alert("All fields are required.");
    if (passFields.new !== passFields.confirm)
      return alert("New passwords do not match!");
    if (passFields.new.length < 6)
      return alert("Password must be at least 6 characters.");

    setIsUpdatingPass(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        passFields.old,
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passFields.new);
      alert("Password updated successfully!");
      setPassFields({ old: "", new: "", confirm: "" });
    } catch (err) {
      alert("Verification failed. Please check your current password.");
    } finally {
      setIsUpdatingPass(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "admissions", admission.id), {
        notifications: notifs,
      });
      alert("Preferences saved!");
    } catch (err) {
      alert("Error saving data.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!delPassword) return alert("Enter password.");
    setIsDeleting(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, delPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      if (window.confirm("FINAL WARNING: Proceed with account deletion?")) {
        await deleteDoc(doc(db, "admissions", admission.id));
        await deleteUser(auth.currentUser);
        navigate("/login");
      }
    } catch (err) {
      alert("Invalid password.");
    } finally {
      setIsDeleting(false);
    }
  };

  const fullName = admission
    ? `${admission.firstName} ${admission.lastName}`
    : "";

  return (
    <StudentLayout>
      <div className="p-6 sm:p-10 lg:p-12 max-w-7xl mx-auto w-full font-sans">
        {/* HEADER SECTION */}
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-3xl font-black text-slate-800 tracking-tight">
            <Settings className="text-blue-600" size={32} /> Settings
          </h1>
          <p className="text-slate-500 font-medium">
            Manage your account & preferences
          </p>
        </div>

        {/* TABS Navigation */}
        <div className="grid grid-cols-2 sm:flex sm:flex-nowrap gap-2 sm:gap-1 border-b border-slate-200 pb-2 mb-10">
          {[
            { id: "account", label: "Profile", icon: <User size={14} /> },
            {
              id: "security",
              label: "Security",
              icon: <ShieldCheck size={14} />,
            },
            { id: "notif", label: "Alerts", icon: <Bell size={14} /> },
            {
              id: "danger",
              label: "Account Delete",
              icon: <AlertTriangle size={14} />,
            },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-3 px-4 py-3 sm:py-4 text-[10px] font-black uppercase tracking-widest transition-all justify-start w-full rounded-xl border border-slate-100 sm:justify-start sm:w-auto sm:px-5 sm:rounded-none sm:border-none sm:border-b-2 ${
                activeTab === t.id
                  ? "bg-blue-50 text-blue-600 border-blue-200 sm:bg-transparent sm:border-blue-600"
                  : "bg-white text-slate-400 sm:bg-transparent sm:border-transparent"
              }`}
            >
              <span className="shrink-0">{t.icon}</span>
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* LEFT: MAIN CONTENT CARD */}
          <div className="w-full lg:max-w-3xl bg-white border border-slate-100 rounded-[2.5rem] p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "account" && (
                <motion.div
                  key="acc"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-10"
                >
                  <div className="bg-slate-50/50 p-6 sm:p-8 rounded-[2.4rem] flex flex-col sm:flex-row items-center gap-8 border border-slate-100/50">
                    <div className="relative">
                      <div className="w-28 h-28 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black border-4 border-white shadow-2xl overflow-hidden uppercase">
                        {admission?.profilePic ? (
                          <img
                            src={admission.profilePic}
                            className="w-full h-full object-cover"
                            alt="Profile"
                          />
                        ) : (
                          admission?.firstName?.[0]
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRef.current.click()}
                        className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl border-2 border-white hover:bg-blue-700 transition-all shadow-xl"
                      >
                        <Camera size={18} />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <h3 className="text-2xl font-black text-slate-800 uppercase italic leading-none">
                        {fullName || "Student Profile"}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-2">
                        Verified student photo for campus identification.
                      </p>

                      <div className="flex flex-wrap gap-3 mt-6 justify-center sm:justify-start">
                        <button
                          disabled={uploading}
                          onClick={() => fileInputRef.current.click()}
                          className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center gap-3 shadow-lg shadow-blue-100 ${
                            uploading
                              ? "bg-blue-400 text-white cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                          }`}
                        >
                          {uploading ? (
                            <>
                              <svg
                                className="animate-spin h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Uploading...
                            </>
                          ) : (
                            "Update Photo"
                          )}
                        </button>

                        {admission?.profilePic && !uploading && (
                          <button
                            onClick={handleRemoveImage}
                            className="px-6 py-3 bg-white text-red-600 border border-red-100 text-[10px] font-black uppercase rounded-2xl hover:bg-red-50 transition-all flex items-center gap-2"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Full Name
                      </label>
                      <div className="p-5 bg-slate-50 rounded-3xl font-bold text-slate-700 text-[13px] border border-slate-100 italic capitalize">
                        {fullName || "Not Provided"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Student Email
                      </label>
                      <div className="p-5 bg-slate-50 rounded-3xl font-bold text-slate-700 text-[13px] border border-slate-100 truncate">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="sec"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-10"
                >
                  {/* Password Change Section */}
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-lg font-black text-slate-800 uppercase italic">
                          Update Password
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                          Reset your login access
                        </p>
                      </div>
                      <button
                        onClick={handleUpdatePassword}
                        disabled={isUpdatingPass}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isUpdatingPass ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100"} text-white`}
                      >
                        {isUpdatingPass ? "Updating..." : "Save Password"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          id: "old",
                          label: "Current Password",
                          placeholder: "Password",
                        },
                        {
                          id: "new",
                          label: "New Password",
                          placeholder: "Enter a new Password",
                        },
                        {
                          id: "confirm",
                          label: "Confirm Password",
                          placeholder: "Confirm your new Password",
                        },
                      ].map((field) => (
                        <div key={field.id} className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            {field.label}
                          </label>
                          <div className="relative">
                            <input
                              type={showPass[field.id] ? "text" : "password"}
                              value={passFields[field.id]}
                              onChange={(e) =>
                                setPassFields({
                                  ...passFields,
                                  [field.id]: e.target.value,
                                })
                              }
                              placeholder={field.placeholder}
                              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold outline-none focus:border-blue-300 focus:bg-white transition-all"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPass({
                                  ...showPass,
                                  [field.id]: !showPass[field.id],
                                })
                              }
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                            >
                              {showPass[field.id] ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Instance Section */}
                  <div className="pt-10 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-black text-slate-800 uppercase italic">
                        Session Control
                      </h3>
                      <span className="px-3 py-1 bg-green-100 text-green-600 text-[9px] font-black rounded-full uppercase">
                        Safe Environment
                      </span>
                    </div>
                    <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 group">
                      <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-white rounded-2xl text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                          <Laptop size={22} />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm">
                            Active Instance
                          </p>
                          <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                            Connected Now
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          window.confirm("Logout?") && auth.signOut()
                        }
                        className="w-full sm:w-auto px-6 py-2.5 bg-white text-red-600 text-[10px] font-black uppercase rounded-xl border border-red-100 hover:bg-red-600 hover:text-white transition-all"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "notif" && (
                <motion.div
                  key="not"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-slate-800 uppercase italic">
                      Communication
                    </h3>
                    <button
                      onClick={saveSettings}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg shadow-blue-100"
                    >
                      {isSaving ? "Saving..." : "Save Preferences"}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {["email", "classes", "portal"].map((key) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100"
                      >
                        <span className="text-[11px] font-black text-slate-700 uppercase">
                          {key} Notifications
                        </span>
                        <button
                          onClick={() =>
                            setNotifs({ ...notifs, [key]: !notifs[key] })
                          }
                          className={`w-12 h-6 rounded-full relative transition-all duration-300 ${notifs[key] ? "bg-blue-600" : "bg-slate-300"}`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifs[key] ? "right-1" : "left-1"}`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "danger" && (
                <motion.div
                  key="dan"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100">
                    <div className="flex items-center gap-3 text-red-600 mb-4">
                      <AlertTriangle size={24} />
                      <h3 className="text-lg font-black uppercase italic">
                        Permanent Deletion
                      </h3>
                    </div>
                    <div className="max-w-md space-y-4">
                      <div className="relative">
                        <input
                          type={showDelPass ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={delPassword}
                          onChange={(e) => setDelPassword(e.target.value)}
                          className="w-full p-4 bg-white rounded-2xl border border-red-100 text-sm font-bold outline-none"
                        />
                        <button
                          onClick={() => setShowDelPass(!showDelPass)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-red-300 hover:text-red-600"
                        >
                          {showDelPass ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="w-full py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                      >
                        {isDeleting && (
                          <svg
                            className="animate-spin h-3 w-3 text-white"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        )}
                        Terminate Account
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: MESSAGE BOX */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="p-8 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[2.5rem] text-white shadow-xl shadow-blue-200/50 relative overflow-hidden group">
              <Zap className="absolute -right-6 -top-6 w-28 h-28 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">
                    Security Guard
                  </h4>
                </div>
                <h3 className="text-xl font-black italic mb-3 leading-tight">
                  Keep Your Data Safe
                </h3>
                <p className="text-[11px] font-medium leading-relaxed text-blue-50/90">
                  Your settings here are fully encrypted. After any major
                  change, the system automatically syncs.
                  <br />
                  <br />
                  If you see any suspicious activity, reset your password
                  immediately and inform the support team.
                </p>
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-400/30 border border-white/20 backdrop-blur-sm flex items-center justify-center text-[10px]">
                      🛡️
                    </div>
                    <div className="w-8 h-8 rounded-full bg-indigo-400/30 border border-white/20 backdrop-blur-sm flex items-center justify-center text-[10px]">
                      🔑
                    </div>
                  </div>
                  <span className="text-[12px] font-black text-blue-100 uppercase tracking-tighter italic">
                    Student Protection Active
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 px-6 space-y-1 opacity-60">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic flex justify-between">
                <span>Last Login:</span>
                <span className="text-slate-600">
                  {new Date().toLocaleDateString()}
                </span>
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic flex justify-between">
                <span>Access IP:</span>
                <span className="text-slate-600">192.168.1.1</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
