import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AboutSection from '../components/home/AboutSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import TechnologiesSection from '../components/home/TechnologiesSection';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="bg-dark min-h-screen">
      <Navbar />
      <main className="pt-24">
        <section className="py-16 text-center relative overflow-hidden">
          <div className="orb orb-purple w-80 h-80 top-0 left-0 opacity-10 absolute" />
          <div className="section-container">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="tag mb-4 mx-auto w-fit">Our Story</div>
              <h1 className="section-title text-white mb-4">About <span className="gradient-text">StepTrendy</span></h1>
              <p className="text-gray-400 max-w-2xl mx-auto">We're a team of passionate designers, developers, and digital strategists building the future of software.</p>
            </motion.div>
          </div>
        </section>
        <AboutSection />
        <TechnologiesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
