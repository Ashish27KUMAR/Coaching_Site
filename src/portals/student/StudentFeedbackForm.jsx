import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  MessageSquare,
  Send,
  User,
  CheckCircle,
  Info,
  X,
  Star,
} from "lucide-react";
import StudentNavbar from "./StudentNavbar";
import { useNavigate } from "react-router-dom";

export default function StudentFeedbackForm() {
  const [msg, setMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentPhoto, setStudentPhoto] = useState(""); // Image state add ki
  const [fetchingName, setFetchingName] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  // 1. Auth state track karna
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setFetchingName(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Real-time Name aur Image Fetching
  useEffect(() => {
    if (!currentUser?.email) return;

    const q = query(
      collection(db, "approved_admissions"),
      where("email", "==", currentUser.email),
    );

    const unsubscribeSnapshot = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setStudentName(`${data.firstName} ${data.lastName}`);
          setStudentPhoto(data.photoUrl || ""); // Database se photo fetch ki
        } else {
          setStudentName(
            currentUser.displayName || currentUser.email.split("@")[0],
          );
          setStudentPhoto(currentUser.photoURL || "");
        }
        setFetchingName(false);
      },
      (error) => {
        console.error("Profile Fetch Error:", error);
        setFetchingName(false);
      },
    );

    return () => unsubscribeSnapshot();
  }, [currentUser]);

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (rating === 0 || !msg.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "feedbacks"), {
        name: studentName,
        photo: studentPhoto, // Firebase feedbacks collection mein image store hogi
        message: msg.trim(),
        rating: rating,
        time: serverTimestamp(),
        uid: currentUser?.uid || null,
        email: currentUser?.email || null,
        status: "active",
      });

      setMsg("");
      alert("✅ Thank you! Your feedback has been posted.");
      navigate("/student");
    } catch (err) {
      console.error(err);
      alert("Error sending feedback.");
    }
    setLoading(false);
  };

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col overflow-hidden font-sans">
      <div className="sticky top-0 z-[100] bg-white shadow-sm">
        <StudentNavbar />
      </div>

      <div className="flex-grow overflow-y-auto px-4 py-6 flex flex-col items-center">
        <div className="w-full max-w-lg animate-in fade-in zoom-in duration-300 mb-8 mt-4">
          <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden relative">
            {/* Header */}
            <div className="bg-slate-900 p-6 text-center relative">
              <button
                type="button"
                onClick={() => navigate("/student")}
                className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
              >
                <X size={22} strokeWidth={2.5} />
              </button>

              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 text-white shadow-lg shadow-blue-500/20">
                <MessageSquare size={24} />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Share Experience
              </h2>
            </div>

            <div className="p-6 sm:p-8">
              {/* Profile Chip (Show Fetched Image) */}
              <div className="mb-6 flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-500 shadow-sm border border-slate-100 overflow-hidden">
                    {studentPhoto ? (
                      <img
                        src={studentPhoto}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Verified Profile
                    </p>
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {fetchingName ? (
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          Checking...
                        </span>
                      ) : (
                        studentName
                      )}
                    </div>
                  </div>
                </div>
                {!fetchingName && (
                  <CheckCircle size={14} className="text-emerald-500" />
                )}
              </div>

              <form onSubmit={submitFeedback} className="space-y-5">
                {/* Rating Input */}
                <div className="space-y-2 text-center sm:text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Rating *
                  </label>
                  <div className="flex items-center gap-1 justify-center sm:justify-start">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110 active:scale-90 p-1"
                      >
                        <Star
                          size={28}
                          fill={
                            (hoverRating || rating) >= star
                              ? "#EAB308"
                              : "transparent"
                          }
                          className={
                            (hoverRating || rating) >= star
                              ? "text-yellow-500"
                              : "text-slate-200"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Info size={12} /> Message *
                  </label>
                  <textarea
                    required
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="How can we improve?"
                    className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-600 rounded-2xl p-4 min-h-[110px] text-sm font-semibold text-slate-700 focus:outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    loading || fetchingName || !msg.trim() || rating === 0
                  }
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                    ${
                      loading || fetchingName || !msg.trim() || rating === 0
                        ? "bg-slate-100 text-slate-300"
                        : "bg-slate-900 text-white hover:bg-blue-600 shadow-lg"
                    }`}
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      Post Feedback <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
