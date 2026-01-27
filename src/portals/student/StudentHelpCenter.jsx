import { useEffect, useState, useRef } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import StudentLayout from "./StudentLayout";
import {
  LifeBuoy,
  Phone,
  MessageCircle,
  Send,
  CheckCircle,
  Ticket,
  Clock,
  HelpCircle,
} from "lucide-react";

export default function StudentHelpCenter() {
  const [formStatus, setFormStatus] = useState("idle");
  const [ticketId, setTicketId] = useState("");
  const formRef = useRef();

  // Initialization
  useEffect(() => {
    // EmailJS Key initialization
    emailjs.init("YOUR_PUBLIC_KEY");
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("sending");

    const newId =
      "DCA-" + Math.random().toString(36).substr(2, 6).toUpperCase();
    setTicketId(newId);

    // Form data direct grab kar rahe hain
    const formData = new FormData(formRef.current);
    const subject = formData.get("subject");
    const message = formData.get("message");

    try {
      // Firebase mein ticket save karna
      await addDoc(collection(db, "support_tickets"), {
        ticketId: newId,
        subject: subject,
        message: message,
        status: "open",
        createdAt: serverTimestamp(),
        // Note: Layout file already user ka email/name handle kar rahi hai sidebar mein
      });

      // EmailJS sending
      await emailjs.sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        formRef.current,
        "YOUR_PUBLIC_KEY",
      );

      setFormStatus("success");
      setTimeout(() => {
        setFormStatus("idle");
        setTicketId("");
        formRef.current.reset();
      }, 5000);
    } catch (err) {
      console.error("Support Error:", err);
      setFormStatus("idle");
      alert("Failed to send request.");
    }
  };

  return (
    <StudentLayout>
      {/* Is div ke andar ka content ab sirf scroll hoga, 
         sidebar aur mobile header fixed rahenge.
      */}
      <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-black text-slate-800 tracking-tight">
            <LifeBuoy className="text-blue-600" size={32} />
            Help Center
          </h1>
          <p className="text-slate-500 font-medium mb-10">
            Premium Support for our Students
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* TICKET FORM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 bg-white border border-slate-100 rounded-[3rem] p-8 sm:p-12 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Ticket size={120} className="rotate-12" />
            </div>
            <div className="relative z-10 text-left">
              <h3 className="text-xl font-black text-slate-800 italic mb-8 uppercase">
                Create Support Ticket
              </h3>

              <form
                ref={formRef}
                onSubmit={handleFormSubmit}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Query Subject
                    </label>
                    <select
                      name="subject"
                      required
                      className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all cursor-pointer shadow-sm"
                    >
                      <option>Technical Issue</option>
                      <option>Academic Support</option>
                      <option>Fee Management</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                    Describe Problem
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    required
                    placeholder="Describe your issue..."
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-medium text-slate-700 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all resize-none shadow-sm"
                  ></textarea>
                </div>

                <button
                  disabled={formStatus !== "idle"}
                  className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-xl ${
                    formStatus === "success"
                      ? "bg-emerald-500 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {formStatus === "sending" ? (
                    "Processing..."
                  ) : formStatus === "success" ? (
                    <>
                      <CheckCircle size={18} /> Ticket Raised: {ticketId}
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Raise Ticket
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* SIDEBAR CARDS */}
          <div className="lg:col-span-4 space-y-6 pb-12">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-left">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                Connect Direct
              </h4>
              <div className="space-y-6">
                <a
                  href="tel:+919931190218"
                  className="flex items-center gap-4 group/item"
                >
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-all shadow-inner">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                      Call Us
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      +91 99311 90218
                    </p>
                  </div>
                </a>
                <a
                  href="https://wa.me/919931190218"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 group/item"
                >
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover/item:bg-emerald-600 group-hover/item:text-white transition-all shadow-inner">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                      WhatsApp
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      Chat with us
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-700 to-indigo-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden text-left">
              <Clock size={32} className="mb-6 text-blue-200" />
              <h3 className="font-black text-lg mb-2 italic uppercase">
                Response Time
              </h3>
              <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-70">
                Mon - Sat | 10am - 6pm
              </p>
              <p className="text-xs font-medium leading-relaxed opacity-80">
                Our team usually responds within 2 business hours.
              </p>
              <HelpCircle className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 rotate-12" />
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
