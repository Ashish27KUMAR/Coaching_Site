import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <>
      <TopBar />
      <Navbar />

      {/* CONTACT SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Contact Us
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Have questions about admissions, batches, or results? Visit our
              institute or reach out to us—we’re always happy to guide students
              and parents.
            </p>
          </div>

          {/* MAIN GRID */}
          <div className="grid lg:grid-cols-2 gap-10">
            {/* LEFT: CONTACT INFO */}
            <div className="bg-white rounded-xl p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Get in Touch
                </h2>

                <ContactItem
                  icon={<Phone size={18} />}
                  title="Phone"
                  value="+91 99311 90218"
                />
                <ContactItem
                  icon={<Mail size={18} />}
                  title="Email"
                  value="sunil@gmail.com"
                />
                <ContactItem
                  icon={<MapPin size={18} />}
                  title="Institute Address"
                  value="DCA Coaching Institute, Block Road, Ramgharwa"
                />
                <ContactItem
                  icon={<Clock size={18} />}
                  title="Class Timings"
                  value="Mon – Sat : 8:00 AM – 3:00 PM"
                />

                <p className="text-sm text-gray-500 mt-6">
                  📍 Parents and students are encouraged to visit the institute
                  for counselling and batch allocation.
                </p>
              </div>

              {/* QUICK ACTION BUTTONS */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="tel:+919931190218"
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  <Phone size={18} /> Call Now
                </a>

                <a
                  href="https://wa.me/919931190218"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
              </div>
            </div>

            {/* RIGHT: CONTACT FORM */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Admission Enquiry
              </h2>

              <form className="space-y-5">
                <input
                  type="text"
                  placeholder="Student / Parent Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="tel"
                  placeholder="Mobile Number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* CUSTOM SELECT */}
                <div className="relative">
                  <select className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select Course / Class</option>
                    <option>Class 10</option>
                    <option>Class 12</option>
                    <option>JEE</option>
                    <option>NEET</option>
                  </select>

                  {/* Custom Arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <textarea
                  rows="4"
                  placeholder="Your Message / Query"
                  className="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Submit Enquiry
                </button>
              </form>
            </div>
          </div>

          {/* GOOGLE MAP */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Find Us on Map
            </h2>
            <div className="w-full h-88 rounded-xl overflow-hidden shadow-sm">
              <iframe
                title="Institute Location"
                src="https://www.google.com/maps?q=Ramgharwa&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

/* CONTACT ITEM */
function ContactItem({ icon, title, value }) {
  return (
    <div className="flex items-start gap-4 mb-5">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-medium text-gray-700">{title}</p>
        <p className="text-gray-600 text-sm">{value}</p>
      </div>
    </div>
  );
}
