import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { MdEmail } from "react-icons/md";
import {
  AiOutlinePhone,
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const countryOptions = [
  { value: "+91", label: "IN +91" },
  { value: "+1", label: "US +1" },
  { value: "+44", label: "UK +44" },
  { value: "+61", label: "AU +61" },
  { value: "+81", label: "JP +81" },
];

export default function Register() {
  const navigate = useNavigate();
  const [registerMethod, setRegisterMethod] = useState("email");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ← show/hide password
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [slideUp, setSlideUp] = useState(false);

  useEffect(() => {
    setTimeout(() => setSlideUp(true), 100); // slide-up on mount
  }, []);

  const handleClose = () => {
    setSlideUp(false); // slide-down animation
    setTimeout(() => navigate("/"), 500); // redirect after animation
  };

  const handleRegister = async () => {
    if (!firstName || !lastName) {
      alert("Please enter first and last name");
      return;
    }
    if (registerMethod === "email" && (!email || !password)) {
      alert("Fill all fields");
      return;
    }
    if (registerMethod === "phone" && !phone) {
      alert("Enter phone number");
      return;
    }

    try {
      if (registerMethod === "email") {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Registration Successful");
      } else if (registerMethod === "google") {
        alert("Google Registration Clicked!");
      } else {
        alert(`Phone Registration Clicked! ${countryCode} ${phone}`);
      }
      handleClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 overflow-hidden px-4">
      {/* 🌌 Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-800 overflow-hidden">
        <span className="floating-icon big top-12 left-10">📚</span>
        <span className="floating-icon mid top-1/4 right-16">✏️</span>
        <span className="floating-icon big bottom-24 left-1/3">🎓</span>
        <span className="floating-icon mid bottom-32 right-10">📝</span>
        <span className="floating-icon mid top-1/3 left-1/4">📖</span>
      </div>

      {/* Card */}
      <div
        className={`relative w-full max-w-md md:max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl text-white overflow-hidden
        transform transition-all duration-500 ease-out
        ${slideUp ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition text-2xl font-bold"
        >
          <AiOutlineClose />
        </button>

        {/* Header */}
        <div className="text-center mb-3">
          <div className="text-5xl mb-1">📝</div>
          <h2 className="text-2xl font-bold">Register</h2>
          <p className="text-sm text-white/70">Create your account</p>
        </div>

        {/* Name Fields */}
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="First Name"
            className="w-1/2 bg-white/20 border border-white/30 rounded-xl px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-white/40"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-1/2 bg-white/20 border border-white/30 rounded-xl px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-white/40"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* Email / Phone / Password */}
        {registerMethod === "email" && (
          <div className="space-y-2 relative">
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-white/40"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // show/hide password
                placeholder="••••••••"
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-white/40 pr-10"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-black/70 hover:text-black transition text-xl"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            <button
              onClick={handleRegister}
              className="w-full bg-blue-400 text-blue-900 hover:bg-blue-300 font-bold py-2.5 rounded-xl transition"
            >
              Register
            </button>
          </div>
        )}

        {registerMethod === "google" && (
          <div className="flex justify-center mt-2">
            <button
              onClick={handleRegister}
              className="bg-red-500 hover:bg-red-400 transition text-white font-bold px-5 py-2 rounded-xl flex items-center gap-2"
            >
              <FcGoogle size={18} /> Continue with Google
            </button>
          </div>
        )}

        {registerMethod === "phone" && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div style={{ minWidth: 110, flexShrink: 0 }}>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(
                    (option) => option.value === countryCode
                  )}
                  onChange={(selectedOption) =>
                    setCountryCode(selectedOption.value)
                  }
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "#5B4B8A",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      color: "white",
                      borderRadius: "0.75rem",
                      minHeight: "40px",
                    }),
                    menu: (provided) => ({
                      ...provided,
                      backgroundColor: "#5B4B8A",
                      color: "white",
                      borderRadius: "0.75rem",
                      marginTop: 2,
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isFocused ? "#483D79" : "#5B4B8A",
                      color: "white",
                      cursor: "pointer",
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: "white",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: "white",
                    }),
                    indicatorSeparator: () => ({ display: "none" }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#483D79",
                      primary: "white",
                    },
                  })}
                />
              </div>
              <input
                type="tel"
                placeholder="1234567890"
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-white/40"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button
              onClick={handleRegister}
              className="w-full bg-blue-400 text-blue-900 hover:bg-blue-300 font-bold py-2.5 rounded-xl transition"
            >
              Send OTP
            </button>
          </div>
        )}

        {/* Divider + More Options */}
        <div className="flex items-center gap-2 my-3">
          <hr className="flex-grow border-white/30" />
          <span className="text-white/70 text-sm">
            Register with more options
          </span>
          <hr className="flex-grow border-white/30" />
        </div>

        {/* Multiple login options */}
        <div className="flex justify-center gap-4 mt-2">
          <button
            onClick={() => setRegisterMethod("email")}
            className={`p-2.5 rounded-full border border-white/30 transition hover:bg-white/20 ${
              registerMethod === "email" ? "bg-white/20" : ""
            }`}
          >
            <MdEmail size={22} />
          </button>
          <button
            onClick={() => setRegisterMethod("google")}
            className={`p-2.5 rounded-full border border-white/30 transition hover:bg-white/20 ${
              registerMethod === "google" ? "bg-white/20" : ""
            }`}
          >
            <FcGoogle size={22} />
          </button>
          <button
            onClick={() => setRegisterMethod("phone")}
            className={`p-2.5 rounded-full border border-white/30 transition hover:bg-white/20 ${
              registerMethod === "phone" ? "bg-white/20" : ""
            }`}
          >
            <AiOutlinePhone size={22} />
          </button>
        </div>

        {/* Switch to Login */}
        <p className="text-center mt-3 text-white/70">
          Already have an account?{" "}
          <button
            onClick={() => {
              setSlideUp(false);
              setTimeout(() => navigate("/login"), 500);
            }}
            className="text-white font-semibold cursor-pointer hover:underline"
          >
            Login
          </button>
        </p>
      </div>

      {/* Animations */}
      <style>{`
        .floating-icon {
          position: absolute;
          opacity: 0.25;
          animation: float 16s ease-in-out infinite;
        }
        .floating-icon.big {
          font-size: 4rem;
        }
        .floating-icon.mid {
          font-size: 3rem;
        }

        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
