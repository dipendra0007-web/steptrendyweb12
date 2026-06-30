import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';
import { teamAPI } from '../utils/api';

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await teamAPI.getAll();
        setTeam(data.data || []);
      } catch (err) {
        console.error('Failed to load team', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="bg-dark min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="section-container">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="tag mb-4 mx-auto w-fit">Our Team</div>
              <h1 className="section-title text-white mb-4">Meet the <span className="gradient-text">Experts</span></h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our team is composed of passionate tech innovators, seasoned engineers, and creative designers dedicated to building digital excellence.
              </p>
            </motion.div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass-card p-6 flex flex-col items-center text-center group hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 mb-5 relative">
                    <img
                      src={member.photo || `https://ui-avatars.com/api/?name=${member.name}&background=5B8CFF&color=fff`}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <h3 className="text-white font-bold text-lg mb-1 font-display">{member.name}</h3>
                  <p className="text-primary text-sm font-semibold mb-4">{member.role}</p>

                  <div className="space-y-2 mb-6 text-xs text-gray-400 w-full truncate">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="flex items-center justify-center gap-1.5 hover:text-white transition-colors">
                        <Mail size={12} /> {member.email}
                      </a>
                    )}
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="flex items-center justify-center gap-1.5 hover:text-white transition-colors">
                        <Phone size={12} /> {member.phone}
                      </a>
                    )}
                  </div>

                  <div className="flex justify-center gap-3 border-t border-dark-border/40 pt-4 w-full mt-auto">
                    {member.socialLinks?.map((s, idx) => {
                      const Icon = s.name === 'LinkedIn' ? Linkedin : s.name === 'GitHub' ? Github : null;
                      if (!Icon) return null;
                      return (
                        <a
                          key={idx}
                          href={s.link}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all duration-200"
                        >
                          <Icon size={14} />
                        </a>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
              {team.length === 0 && (
                <div className="col-span-4 glass-card p-12 text-center">
                  <p className="text-gray-400">Our team is growing. Check back soon!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
