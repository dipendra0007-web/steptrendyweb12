import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ContactSection from '../components/home/ContactSection';
import { motion } from 'framer-motion';
import { settingAPI } from '../utils/api';

export default function ContactPage() {
  const [address, setAddress] = useState('Surat, Gujarat, India');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await settingAPI.get();
        if (data.data?.addresses?.[0]) {
          setAddress(data.data.addresses[0]);
        }
      } catch {
        // use default
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="bg-dark min-h-screen">
      <Navbar />
      <main className="pt-24">
        <section className="py-16 text-center relative overflow-hidden">
          <div className="orb orb-blue w-80 h-80 top-0 right-0 opacity-10 absolute" />
          <div className="section-container">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="tag mb-4 mx-auto w-fit">Get In Touch</div>
              <h1 className="section-title text-white mb-4">Let's Start a <span className="gradient-text">Conversation</span></h1>
              <p className="text-gray-400 max-w-2xl mx-auto">Have a project in mind? We'd love to hear about it. Send us a message and we'll get back to you within 24 hours.</p>
            </motion.div>
          </div>
        </section>
        <ContactSection />
        {/* Google Maps Placeholder */}
        <section className="py-0">
          <div className="w-full h-64 bg-dark-card border-t border-dark-border flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3">📍</div>
              <p className="text-gray-400 font-display">{address}</p>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline mt-1 inline-block font-semibold">
                View on Google Maps →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
