import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import StudentLayout from "./StudentLayout"; // Custom Layout
import {
  Lock,
  Smartphone,
  EyeOff,
  AlertTriangle,
  Fingerprint,
  Verified,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

export default function StudentSafetyTips() {
  const [user, setUser] = useState(null);
  const [admission, setAdmission] = useState(null);
  const navigate = useNavigate();

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
      const q = query(
        collection(db, "admissions"),
        where("email", "==", email),
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) setAdmission(snapshot.docs[0].data());
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const safetyTips = [
    {
      icon: <Lock className="text-blue-600" size={24} />,
      title: "Strong Passwords",
      desc: "Use a mix of letters, numbers, and symbols. Avoid using your birth year or name.",
      color: "bg-blue-50",
    },
    {
      icon: <Smartphone className="text-emerald-600" size={24} />,
      title: "Two-Step Access",
      desc: "Always keep your registered mobile number active for OTP and important alerts.",
      color: "bg-emerald-50",
    },
    {
      icon: <EyeOff className="text-purple-600" size={24} />,
      title: "Public Wi-Fi",
      desc: "Avoid logging into your student portal using public or unprotected Wi-Fi networks.",
      color: "bg-purple-50",
    },
    {
      icon: <AlertTriangle className="text-amber-600" size={24} />,
      title: "Phishing Links",
      desc: "DCA will never ask for your password via email or SMS. Don't click suspicious links.",
      color: "bg-amber-50",
    },
  ];

  return (
    <StudentLayout>
      <div className="min-h-screen bg-[#F8FAFC] font-sans">
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
          {/* Header Section */}
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-black text-slate-800 tracking-tight">
              <ShieldCheck className="text-blue-600" size={32} />
              Safety Tips
            </h1>
            <p className="text-slate-500 font-medium mb-10">
              Keep your student portal account secure
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              {/* Cards Grid: 2 columns on mobile and desktop */}
              <div className="grid grid-cols-2 gap-4 sm:gap-8">
                {safetyTips.map((tip, i) => (
                  <motion.div
                    whileHover={{ y: -5 }}
                    key={i}
                    className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border border-slate-100 shadow-sm text-left relative overflow-hidden flex flex-col"
                  >
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 ${tip.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shrink-0`}
                    >
                      {tip.icon}
                    </div>
                    <h3 className="font-black text-slate-800 uppercase italic mb-2 sm:mb-3 tracking-tight text-[12px] sm:text-base">
                      {tip.title}
                    </h3>
                    <p className="text-slate-500 text-[10px] sm:text-sm font-medium leading-tight sm:leading-relaxed">
                      {tip.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Warning Banner */}
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-8 sm:p-10 text-slate-700 relative overflow-hidden">
                <div className="relative z-10 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldAlert className="text-red-500" />
                    <h4 className="font-black uppercase tracking-widest text-[10px] sm:text-xs text-red-500">
                      Official Warning
                    </h4>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black mb-4 italic uppercase text-slate-800">
                    Don't Share Your Credentials
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm font-bold mb-6 max-w-xl">
                    DCA Classes support staff will never ask for your password
                    or financial details over a call or WhatsApp.
                  </p>
                  <Link
                    to="/student/support"
                    className="inline-flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-blue-600 transition-all"
                  >
                    Report Activity
                  </Link>
                </div>
                <Fingerprint
                  size={180}
                  className="absolute -right-10 -bottom-10 text-slate-50 rotate-12 pointer-events-none"
                />
              </div>
            </div>

            {/* Sidebar Cards Area */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-left">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                  Security Checklist
                </h4>
                <div className="space-y-5">
                  {[
                    "Change password every 3 months",
                    "Always logout from public PCs",
                    "Keep your phone number updated",
                    "Verify official email links",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <Verified size={14} />
                      </div>
                      <span className="text-[10px] sm:text-xs font-black text-slate-600 uppercase">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
                <div className="relative z-10 text-left">
                  <h3 className="font-black text-lg uppercase italic mb-2">
                    Emergency?
                  </h3>
                  <p className="text-[10px] sm:text-xs text-blue-100 font-bold mb-6 opacity-80">
                    Account access issues? Call us now.
                  </p>
                  <a
                    href="tel:+919931190218"
                    className="flex items-center justify-center gap-3 w-full py-4 bg-white text-blue-700 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                  >
                    <Smartphone size={16} /> Get Help
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
