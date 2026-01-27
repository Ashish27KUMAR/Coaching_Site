import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { GraduationCap, Users, Award, BookOpen } from "lucide-react";

export default function About() {
  return (
    <>
      <TopBar />
      <Navbar />

      {/* ABOUT SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              About Our Coaching Institute
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              We are a trusted offline coaching institute dedicated to helping
              students of Class 10th, 12th, JEE, and NEET achieve academic
              excellence through expert guidance, disciplined learning, and
              personal attention.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Our Coaching?
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            <Feature
              icon={<GraduationCap />}
              title="Expert Faculty"
              desc="Highly experienced teachers with deep subject knowledge and proven teaching methods."
            />
            <Feature
              icon={<Users />}
              title="Small Batches"
              desc="Limited students per batch to ensure individual attention and doubt-clearing."
            />
            <Feature
              icon={<BookOpen />}
              title="Structured Learning"
              desc="Well-planned syllabus, regular tests, and clear concept-building approach."
            />
            <Feature
              icon={<Award />}
              title="Proven Results"
              desc="Consistent academic results and satisfied students over the years."
            />
          </div>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our mission is to provide quality education in a disciplined and
                supportive environment where students can build strong
                fundamentals, gain confidence, and achieve their academic goals.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe in offline teaching because personal interaction,
                classroom discipline, and direct mentorship play a crucial role
                in a student’s success.
              </p>
            </div>

            <div className="bg-blue-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">
                What Makes Us Different?
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>✔ Daily doubt-solving support</li>
                <li>✔ Regular tests & performance analysis</li>
                <li>✔ Personal mentorship & guidance</li>
                <li>✔ Focus on concepts, not rote learning</li>
                <li>✔ Parent–teacher communication</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Your Journey Towards Success
          </h2>
          <p className="max-w-2xl mx-auto mb-6 text-blue-100">
            Join our coaching institute today and experience structured
            learning, expert guidance, and a supportive classroom environment
            designed for real results.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Contact Us Today
          </a>
        </div>
      </section>
      <Footer />
    </>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
      <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}
