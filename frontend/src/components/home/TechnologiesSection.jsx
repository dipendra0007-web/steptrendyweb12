import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { techStackAPI } from '../../utils/api';

const fallbackTech = [
  { name: 'React.js', photo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: '#61DAFB' },
  { name: 'Node.js', photo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: '#68A063' },
  { name: 'Flutter', photo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', color: '#54C5F8' },
  { name: 'Figma', photo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', color: '#F24E1E' },
  { name: 'Tailwind CSS', photo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', color: '#38BDF8' },
  { name: 'MongoDB', photo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', color: '#47A248' }
];

export default function TechnologiesSection() {
  const [techList, setTechList] = useState([]);

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const { data } = await techStackAPI.getAll();
        setTechList(data.data?.length ? data.data : fallbackTech);
      } catch {
        setTechList(fallbackTech);
      }
    };
    fetchTech();
  }, []);

  return (
    <section id="technologies" className="py-24 bg-dark-card relative overflow-hidden">
      <div className="orb orb-blue w-80 h-80 top-10 right-10 opacity-10 absolute" aria-hidden="true" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="tag mb-4 mx-auto w-fit">Tech Stack</div>
          <h2 className="section-title text-white mb-5">
            Technologies We <span className="gradient-text">Master</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We work with the most powerful and modern technologies to build scalable, fast, and beautiful products.
          </p>
        </motion.div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {techList.map((item, i) => (
            <motion.div
              key={item._id || item.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8, scale: 1.05 }}
              className="tech-logo flex flex-col items-center justify-center p-4 rounded-2xl glass-card border border-white/5 hover:border-primary/20"
              title={item.name}
            >
              <div className="w-12 h-12 mb-3 flex items-center justify-center">
                <img src={item.photo} alt={item.name} className="max-w-full max-h-full object-contain" />
              </div>
              <span className="text-xs text-gray-300 text-center font-medium leading-tight font-display">{item.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Marquee strip */}
        <div className="mt-16 overflow-hidden">
          <p className="text-center text-gray-500 text-sm mb-6">And many more modern tools & frameworks</p>
          <div className="flex gap-6 animate-marquee">
            {['TypeScript', 'Redux', 'Prisma', 'Supabase', 'Vercel', 'Netlify', 'Stripe', 'Twilio', 'SendGrid', 'Cloudinary', 'Redis', 'Kubernetes'].map((tech) => (
              <span key={tech} className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm font-mono">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  );
}
