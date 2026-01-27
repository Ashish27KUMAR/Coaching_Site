import { useEffect, useState, useRef } from "react";
import { auth, db } from "../../firebase/firebase";
import {
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  updatePassword,
  signOut,
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
    try {
      // Changed collection to 'approved_admissions' as per database screenshot
      const q = query(
        collection(db, "approved_admissions"),
        where("email", "==", email),
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        // Mapping 'photoUrl' from Firestore to 'profilePic' for the UI
        setAdmission({
          ...data,
          id: snapshot.docs[0].id,
          profilePic: data.photoUrl,
        });
        if (data.notifications) setNotifs(data.notifications);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // --- VALIDATION LOGIC ---
  const getPasswordErrors = () => {
    const errors = {};
    const capitalRegex = /[A-Z]/;

    if (passFields.new) {
      if (passFields.new.length < 6) {
        errors.new = "Password must be at least 6 characters.";
      } else if (!capitalRegex.test(passFields.new)) {
        errors.new = "Must contain at least one capital letter.";
      }
    }

    if (passFields.confirm && passFields.new !== passFields.confirm) {
      errors.confirm = "Passwords do not match.";
    }

    return errors;
  };

  const passwordErrors = getPasswordErrors();

  const handleUpdatePassword = async () => {
    if (!passFields.old || !passFields.new || !passFields.confirm)
      return alert("All fields are required.");

    if (Object.keys(passwordErrors).length > 0)
      return alert("Please fix the errors before updating.");

    setIsUpdatingPass(true);
    try {
      // 1. Firebase Auth Re-authentication
      const credential = EmailAuthProvider.credential(
        user.email,
        passFields.old,
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // 2. Update Password in Firebase Authentication
      await updatePassword(auth.currentUser, passFields.new);

      // 3. Update 'generatedPassword' in Firestore (approved_admissions collection)
      // Hum yahan admission.id use kar rahe hain jo useEffect mein fetch ho chuka hai
      const studentDocRef = doc(db, "approved_admissions", admission.id);
      await updateDoc(studentDocRef, {
        generatedPassword: passFields.new, // Naya password yahan save ho jayega
      });

      alert("Password updated successfully in Auth and Database!");

      const stayLoggedIn = window.confirm(
        "Do you want to continue your session?",
      );

      if (!stayLoggedIn) {
        await signOut(auth);
        navigate("/login");
      } else {
        // Form fields clear kar rahe hain
        setPassFields({ old: "", new: "", confirm: "" });

        // Local state bhi update kar dete hain taaki UI sync rahe
        setAdmission((prev) => ({
          ...prev,
          generatedPassword: passFields.new,
        }));
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("Verification failed. Please check your current password.");
    } finally {
      setIsUpdatingPass(false);
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
      // Updating 'photoUrl' in Firestore to match database structure
      await updateDoc(doc(db, "approved_admissions", admission.id), {
        photoUrl: data.secure_url,
      });
      setAdmission({
        ...admission,
        profilePic: data.secure_url,
        photoUrl: data.secure_url,
      });
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
      await updateDoc(doc(db, "approved_admissions", admission.id), {
        photoUrl: "",
      });
      setAdmission({ ...admission, profilePic: "", photoUrl: "" });
      alert("Profile picture removed!");
    } catch (err) {
      alert("Error removing image.");
    } finally {
      setUploading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "approved_admissions", admission.id), {
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
        await deleteDoc(doc(db, "approved_admissions", admission.id));
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
      <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  {/* Profile Header */}
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 p-5 rounded-[2rem] flex flex-col sm:flex-row items-center gap-6 border border-slate-200/60 shadow-sm">
                    <div className="relative">
                      <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black border-4 border-white shadow-xl overflow-hidden uppercase">
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
                      <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <h3 className="text-xl font-black text-blue-600 uppercase tracking-tight">
                          {fullName || "Student Profile"}
                        </h3>
                        {/* <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[8px] font-black uppercase rounded-full border border-blue-200">
                          Active Student
                        </span> */}
                      </div>
                      <p className="text-[11px] text-slate-500 font-bold mt-1 uppercase tracking-wider">
                        {admission?.email}
                      </p>
                    </div>
                  </div>

                  {/* Section 1: Personal Information */}
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-2">
                      <User size={14} /> Personal Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        {
                          label: "First Name",
                          value: admission?.firstName,
                          icon: <User size={14} />,
                        },
                        {
                          label: "Last Name",
                          value: admission?.lastName,
                          icon: <User size={14} />,
                        },
                        {
                          label: "Gender",
                          value: admission?.gender,
                          icon: <User size={14} />,
                        },
                        {
                          label: "Date of Birth",
                          value: admission?.dob,
                          icon: <Settings size={14} />,
                        },
                        {
                          label: "Blood Group",
                          value: admission?.bloodGroup,
                          icon: <Zap size={14} />,
                        },
                      ].map((field, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm"
                        >
                          <label className="block text-[8px] font-black text-slate-400 uppercase mb-1">
                            {field.label}
                          </label>
                          <div className="font-bold text-slate-700 text-[12px] italic">
                            {field.value || "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 2: Academic Information */}
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-2">
                      <Laptop size={14} /> Academic Record
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        {
                          label: "Current Class",
                          value: admission?.selectedClass,
                          icon: <Settings size={14} />,
                        },
                        {
                          label: "Enrolled Subjects",
                          value: admission?.selectedSubjects?.join(", "),
                          icon: <Settings size={14} />,
                        },
                      ].map((field, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100"
                        >
                          <label className="block text-[8px] font-black text-slate-400 uppercase mb-1">
                            {field.label}
                          </label>
                          <div className="font-bold text-slate-700 text-[12px] italic">
                            {field.value || "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Contact & Family Details */}
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-2">
                      <Bell size={14} /> Contact & Family
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { label: "Student Phone", value: admission?.phone },
                        {
                          label: "Father's Name",
                          value: admission?.fatherName,
                        },
                        {
                          label: "Father's Phone",
                          value: admission?.fatherPhone,
                        },
                        {
                          label: "Mother's Name",
                          value: admission?.motherName,
                        },
                        {
                          label: "Emergency Contact",
                          value: admission?.motherPhone,
                        },
                      ].map((field, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm"
                        >
                          <label className="block text-[8px] font-black text-slate-400 uppercase mb-1">
                            {field.label}
                          </label>
                          <div className="font-bold text-slate-700 text-[12px] italic">
                            {field.value || "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Address Blocks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <label className="block text-[8px] font-black text-slate-400 uppercase mb-2">
                          Temporary Address
                        </label>
                        <div className="text-[11px] font-bold text-slate-600 italic">
                          {admission?.tempAddress || "N/A"}
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <label className="block text-[8px] font-black text-slate-400 uppercase mb-2">
                          Permanent Address
                        </label>
                        <div className="text-[11px] font-bold text-slate-600 italic">
                          {admission?.permAddress || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hidden Comments logic as it is */}
                  {/* <button onClick={() => fileInputRef.current.click()}>Update Photo</button> */}
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="sec"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-10"
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdatePassword();
                    }}
                  >
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
                        type="submit"
                        disabled={isUpdatingPass}
                        className={`hidden md:flex px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all items-center gap-2 ${
                          isUpdatingPass
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100"
                        } text-white`}
                      >
                        {isUpdatingPass ? "Updating..." : "Save Password"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: "old", label: "Current Password" },
                        { id: "new", label: "New Password" },
                        { id: "confirm", label: "Confirm Password" },
                      ].map((field) => (
                        <div key={field.id} className="relative">
                          <div className="relative flex items-center">
                            <input
                              required
                              type={showPass[field.id] ? "text" : "password"}
                              value={passFields[field.id]}
                              onChange={(e) =>
                                setPassFields({
                                  ...passFields,
                                  [field.id]: e.target.value,
                                })
                              }
                              placeholder=" "
                              className={`peer w-full p-5 pt-7 bg-slate-50 rounded-2xl border transition-all text-sm font-bold outline-none
                  ${
                    passwordErrors[field.id]
                      ? "border-red-400 animate-shake"
                      : "border-slate-100 focus:border-blue-300 focus:bg-white"
                  } 
                  required:border-orange-200`}
                            />

                            <label
                              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all 
                peer-focus:top-4 peer-focus:text-[8px] peer-focus:text-blue-600
                peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-[8px]"
                            >
                              {field.label}
                              <span className="text-red-500 ml-1">*</span>{" "}
                            </label>

                            <button
                              type="button"
                              onClick={() =>
                                setShowPass({
                                  ...showPass,
                                  [field.id]: !showPass[field.id],
                                })
                              }
                              className="absolute right-4 text-slate-400 hover:text-blue-600 z-10"
                            >
                              {showPass[field.id] ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                          {passwordErrors[field.id] && (
                            <p className="text-[9px] text-red-500 font-black uppercase tracking-tighter mt-1 ml-1">
                              {passwordErrors[field.id]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 md:hidden">
                      <button
                        type="submit"
                        disabled={isUpdatingPass}
                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                          isUpdatingPass
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 shadow-lg shadow-blue-100"
                        } text-white`}
                      >
                        {isUpdatingPass ? "Updating..." : "Save Password"}
                      </button>
                    </div>
                  </form>

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
                          window.confirm("Are you sure you want to log out?") &&
                          signOut(auth)
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
                          className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                            notifs[key] ? "bg-blue-600" : "bg-slate-300"
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                              notifs[key] ? "right-1" : "left-1"
                            }`}
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
                        {isDeleting ? "Processing..." : "Terminate Account"}
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
                <span>Device Status:</span>
                <span className="text-slate-600">Trusted Device</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
