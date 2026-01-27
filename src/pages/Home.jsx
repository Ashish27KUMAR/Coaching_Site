import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Courses from "../components/Courses";
import Gallery from "../components/Gallery";
import ReferenceBooks from "../components/ReferenceBooks";
import Feedback from "../components/Feedback";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <TopBar />
      <Navbar />

      <section id="home">
        <Hero />
      </section>

      <section id="features">
        <Features />
      </section>

      <section id="courses">
        <Courses />
      </section>

      <section id="gallery">
        <Gallery />
      </section>

      <section id="books">
        <ReferenceBooks />
      </section>

      <Feedback />
      <Footer />
    </>
  );
}
