import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// React Icons
import {
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [slideUp, setSlideUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setSlideUp(true), 100);
  }, []);

  const isAdmin = role === "admin";

  const handleClose = () => {
    setSlideUp(false);
    setTimeout(() => navigate("/"), 500);
  };

  const loginUser = async () => {
    if (!email || !password) {
      alert("Please enter email & password");
      return;
    }

    setLoading(true);
    try {
      // 1. Firebase Auth Sign-in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const user = userCredential.user;

      // 2. Role-based Collection Verification
      const collectionName = isAdmin ? "admins" : "approved_admissions";
      const q = query(
        collection(db, collectionName),
        where("email", "==", email.toLowerCase().trim()),
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await signOut(auth);
        alert(
          isAdmin
            ? "Access Denied: This email is not registered as an ADMIN."
            : "Access Denied: This email is not registered as a STUDENT.",
        );
        setLoading(false);
        return;
      }

      console.log("Login Success:", user.email);
      alert("Login successful.");

      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (err) {
      console.error("Login Error:", err.code);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found"
      ) {
        alert("Invalid email or password. Please check your credentials.");
      } else if (err.code === "auth/too-many-requests") {
        alert("Too many failed attempts. Try again later.");
      } else {
        alert("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Naya function Enter press handle karne ke liye
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Default reload stop karein
    loginUser();
  };

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center px-4 overflow-hidden
      transition-colors duration-700 ease-in-out
      ${
        isAdmin
          ? "bg-gradient-to-br from-green-900 via-emerald-800 to-green-600"
          : "bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600"
      }`}
    >
      {/* Background Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="floating-icon big top-16 left-10">📘</span>
        <span className="floating-icon mid top-1/3 left-1/4">📚</span>
        <span className="floating-icon big top-20 right-24">✏️</span>
        <span className="floating-icon mid bottom-32 right-20">📝</span>
        <span className="floating-icon big bottom-24 left-1/3">🎓</span>
        <span className="floating-icon mid top-1/2 right-1/3">📖</span>
      </div>

      {/* Card */}
      <div
        className={`relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl text-white z-10 overflow-hidden
        transform transition-all duration-500 ease-out
        ${slideUp ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition text-2xl font-bold"
        >
          <AiOutlineClose />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-1">{isAdmin ? "🛡️" : "🎓"}</div>
          <h1 className="text-2xl font-bold">
            {isAdmin ? "Admin Login" : "Welcome Back"}
          </h1>
          <p className="text-sm text-white/70">
            Login to continue your journey
          </p>
        </div>

        {/* Role Toggle */}
        <div className="relative flex bg-white/10 rounded-xl p-1 mb-6 overflow-hidden">
          <div
            className={`absolute top-1 bottom-1 w-1/2 rounded-lg transition-transform duration-500 ease-in-out
            ${
              isAdmin
                ? "translate-x-full bg-green-400"
                : "translate-x-0 bg-blue-400"
            }`}
          />
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`relative z-10 w-1/2 py-2 text-sm font-semibold transition-colors duration-300 ${
              !isAdmin ? "text-blue-900" : "text-white/70"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`relative z-10 w-1/2 py-2 text-sm font-semibold transition-colors duration-300 ${
              isAdmin ? "text-green-900" : "text-white/70"
            }`}
          >
            Admin
          </button>
        </div>

        {/* Wrapped in Form for Enter support */}
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70 ml-1">Email</label>
              <input
                required
                type="email"
                placeholder="you@example.com"
                className="w-full mt-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/40"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="relative">
              <label className="text-sm text-white/70 ml-1">Password</label>
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full mt-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/40 pr-10"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-white/70 hover:text-white transition text-xl"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>

          <div className="text-right mt-2 mb-6">
            <span className="text-sm text-white/70 hover:text-white cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          <button
            type="submit" // type="submit" enables Enter key
            disabled={loading}
            className={`w-full font-bold py-3 rounded-xl transition active:scale-[0.98] shadow-lg flex items-center justify-center
            ${
              isAdmin
                ? "bg-green-400 text-green-900 hover:bg-green-300 shadow-green-900/20"
                : "bg-blue-400 text-blue-900 hover:bg-blue-300 shadow-blue-900/20"
            } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Verifying..." : "Continue →"}
          </button>
        </form>

        {/* Register Section */}
        <p className="text-center text-sm mt-8 text-white/70 border-t border-white/10 pt-6">
          Didn’t apply yet?{" "}
          <span
            onClick={() => navigate("/admission")}
            className="text-white font-semibold cursor-pointer hover:underline"
          >
            Apply now
          </span>
        </p>
      </div>

      {/* Floating Animations */}
      <style>{`
        .floating-icon {
          position: absolute;
          opacity: 0.22;
          animation: float 16s ease-in-out infinite;
        }
        .floating-icon.big { font-size: 3.8rem; }
        .floating-icon.mid { font-size: 3.2rem; }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
