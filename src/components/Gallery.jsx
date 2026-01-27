import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiMinusCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// 1. IMPORT ALL IMAGES (Ensure paths are correct)
import img1 from "../assets/Gallery_img/Gallery1.jpeg";
import img2 from "../assets/Gallery_img/Gallery2.jpeg";
import img3 from "../assets/Gallery_img/Gallery3.jpeg";
import img4 from "../assets/Gallery_img/Gallery4.jpeg";
import img5 from "../assets/Gallery_img/Gallery5.jpeg";
import img6 from "../assets/Gallery_img/Gallery6.jpeg";
import img7 from "../assets/Gallery_img/Gallery7.jpeg";
import img8 from "../assets/Gallery_img/Gallery8.jpeg";
import img9 from "../assets/Gallery_img/Gallery9.jpeg";
import img10 from "../assets/Gallery_img/Gallery10.jpeg";
import img11 from "../assets/Gallery_img/Gallery11.jpeg";
import img12 from "../assets/Gallery_img/Gallery12.jpeg";
import img13 from "../assets/Gallery_img/Gallery13.jpeg";
import img14 from "../assets/Gallery_img/Gallery14.jpeg";
import img15 from "../assets/Gallery_img/Gallery15.jpeg";
import img16 from "../assets/Gallery_img/Gallery16.jpeg";
import img17 from "../assets/Gallery_img/Gallery17.jpeg";
import img18 from "../assets/Gallery_img/Gallery18.jpeg";
import img19 from "../assets/Gallery_img/Gallery19.jpeg";
import img20 from "../assets/Gallery_img/Gallery20.jpeg";
import img21 from "../assets/Gallery_img/Gallery21.jpeg";
import img22 from "../assets/Gallery_img/Gallery22.jpeg";
import img23 from "../assets/Gallery_img/Gallery23.jpeg";
import img24 from "../assets/Gallery_img/Gallery24.jpeg";
import img25 from "../assets/Gallery_img/Gallery25.jpeg";
import img26 from "../assets/Gallery_img/Gallery26.jpeg";
import img27 from "../assets/Gallery_img/Gallery27.jpeg";
import img28 from "../assets/Gallery_img/Gallery28.jpeg";
import img29 from "../assets/Gallery_img/Gallery29.jpeg";
import img30 from "../assets/Gallery_img/Gallery30.jpeg";

export default function Gallery() {
  // 2. ARRAY DEFINITION (Sab variables yahan hone chahiye)
  const images = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
    img13,
    img14,
    img15,
    img16,
    img17,
    img18,
    img19,
    img20,
    img21,
    img22,
    img23,
    img24,
    img25,
    img26,
    img27,
    img28,
    img29,
    img30,
  ];

  const [activeIndex, setActiveIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const initialLimit = 8;
  const displayImages = showAll ? images : images.slice(0, initialLimit);

  const closeModal = useCallback(() => setActiveIndex(null), []);

  const nextImage = useCallback(
    (e) => {
      e?.stopPropagation();
      setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    },
    [images.length]
  );

  const prevImage = useCallback(
    (e) => {
      e?.stopPropagation();
      setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    },
    [images.length]
  );

  // 3. KEYBOARD SUPPORT
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeIndex === null) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, closeModal, nextImage, prevImage]);

  return (
    <section id="gallery" className="bg-white py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Our <span className="text-blue-600">Gallery</span>
        </h2>

        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto italic">
          Dive into our visual journey of growth, learning, and inspiring
          moments.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayImages.map((img, i) => {
            const isLastVisible = !showAll && i === initialLimit - 1;
            return (
              <motion.div
                key={i}
                layout
                className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer shadow-md group border border-slate-100"
                onClick={() =>
                  isLastVisible ? setShowAll(true) : setActiveIndex(i)
                }
              >
                <img
                  src={img}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  alt="Gallery"
                />
                {isLastVisible && (
                  <div className="absolute inset-0 bg-blue-700/90 flex flex-col items-center justify-center text-white">
                    <span className="text-4xl font-bold">
                      +{images.length - initialLimit}
                    </span>
                    <span className="text-sm font-bold uppercase mt-1">
                      View More
                    </span>
                  </div>
                )}
                {!isLastVisible && (
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <FiMaximize2 className="text-white text-3xl" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        {showAll && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => {
                setShowAll(false);
                document
                  .getElementById("gallery")
                  .scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-2xl hover:bg-red-600 transition-all"
            >
              <FiMinusCircle /> Show Less
            </button>
          </div>
        )}
      </div>

      {/* 4. MODAL WITH PORTAL */}
      {activeIndex !== null &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.95)",
                zIndex: 999999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
              onClick={closeModal}
            >
              {/* CLOSE BUTTON WITH RED HOVER */}
              <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  position: "absolute",
                  top: "30px",
                  right: "30px",
                  color: isHovered ? "#ef4444" : "white",
                  cursor: "pointer",
                  zIndex: 1000000,
                  transition: "color 0.3s ease",
                  background: "transparent",
                  border: "none",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
              >
                <FiX size={45} />
              </button>

              {/* NAV BUTTONS */}
              <button
                style={{ ...navBtnStyle, left: "30px" }}
                onClick={prevImage}
                className="hidden md:block hover:opacity-100"
              >
                <FiChevronLeft size={60} />
              </button>
              <button
                style={{ ...navBtnStyle, right: "30px" }}
                onClick={nextImage}
                className="hidden md:block hover:opacity-100"
              >
                <FiChevronRight size={60} />
              </button>

              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col items-center"
              >
                <img
                  src={images[activeIndex]}
                  style={{
                    maxHeight: "82vh",
                    maxWidth: "90vw",
                    borderRadius: "12px",
                    objectFit: "contain",
                  }}
                  alt="Fullscreen"
                />
                <p className="text-white/40 mt-6 tracking-widest text-sm uppercase">
                  Image {activeIndex + 1} / {images.length}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}

const navBtnStyle = {
  position: "absolute",
  color: "white",
  opacity: 0.3,
  cursor: "pointer",
  background: "transparent",
  border: "none",
  transition: "opacity 0.3s ease",
  zIndex: 1000000,
};
