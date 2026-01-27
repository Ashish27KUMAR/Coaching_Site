import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiArrowRight,
  FiClock,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();

  const homeSections = [
    { name: "Home", id: "home" },
    { name: "Courses", id: "courses" },
    { name: "Gallery", id: "gallery" },
    { name: "Reference Books", id: "books" },
  ];

  const sitePages = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Admission", path: "/admission" },
    { name: "Contact Us", path: "/contact" },
  ];

  const handleScrollToSection = (id) => {
    if (id === "home") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
      return;
    }

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth",
          });
        }
      }, 500);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 pb-16 border-b border-slate-800">
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/75 bg-white p-1">
                <img
                  src={Logo}
                  alt="DCA Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                DCA
              </h3>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">
              Empowering students with strong academic foundations and expert
              guidance to excel in school and competitive exams.
            </p>
            <div className="flex gap-4">
              {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map(
                (Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ y: -3, scale: 1.1 }}
                    className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                  >
                    <Icon size={18} />
                  </motion.a>
                )
              )}
            </div>
          </div>

          {/* Column 2: Explore (Active State Added) */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Explore</h4>
            <ul className="space-y-4">
              {homeSections.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleScrollToSection(item.id)}
                    className={`flex items-center gap-2 transition-all group text-left w-full ${
                      location.pathname === "/" &&
                      location.hash === `#${item.id}`
                        ? "text-blue-500 font-semibold"
                        : "hover:text-blue-500"
                    }`}
                  >
                    <FiArrowRight
                      size={14}
                      className={`transition-all ${
                        location.pathname === "/" &&
                        location.hash === `#${item.id}`
                          ? "opacity-100 ml-0"
                          : "opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0"
                      }`}
                    />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Institution (Active State Added) */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Institution</h4>
            <ul className="space-y-4">
              {sitePages.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className={`flex items-center gap-2 transition-all group ${
                        isActive
                          ? "text-blue-500 font-semibold"
                          : "hover:text-blue-500"
                      }`}
                    >
                      <FiArrowRight
                        size={14}
                        className={`transition-all ${
                          isActive
                            ? "opacity-100 ml-0"
                            : "opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0"
                        }`}
                      />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
              <FiClock className="text-blue-500" size={18} />
              <div>
                <p className="font-bold text-slate-200">Office Hours</p>
                <p className="text-xs text-slate-500">Mon - Sat: 8AM - 5PM</p>
              </div>
            </div>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin
                  className="text-blue-500 mt-1 flex-shrink-0"
                  size={20}
                />
                <span>
                  Block Road, Ramgharwa
                  <br />
                  East Champaran, Bihar – 845433
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-blue-500 flex-shrink-0" size={20} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-xs">
                <FiMail className="text-blue-500 flex-shrink-0" size={18} />
                <span>info@dcaacademy.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower Footer */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 uppercase tracking-widest font-bold">
          <p>© {currentYear} DCA Academy. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
