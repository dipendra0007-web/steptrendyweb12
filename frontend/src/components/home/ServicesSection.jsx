import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as Icons from 'lucide-react';
import { serviceAPI } from '../../utils/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ServicesSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await serviceAPI.getAll();
        setServices(data.data || []);
      } catch (err) {
        console.error('Failed to fetch services', err);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-dark">
      {/* BG */}
      <div className="absolute inset-0 dot-grid opacity-30" aria-hidden="true" />
      <div className="orb orb-blue w-80 h-80 top-0 right-0 opacity-10 absolute" aria-hidden="true" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="tag mb-4 mx-auto w-fit">Our Services</div>
          <h2 className="section-title text-white mb-5">
            Everything You Need to{' '}
            <span className="gradient-text">Build & Grow</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            From idea to launch, we provide end-to-end digital services that help businesses thrive in the modern world.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((item) => {
            const Icon = Icons[item.icon] || Icons.HelpCircle;
            const color = item.color || '#5B8CFF';
            const desc = item.shortDescription || item.description;
            return (
              <motion.div
                key={item._id || item.title}
                variants={itemVariants}
                className="service-card group"
                whileHover={{ scale: 1.02 }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 relative"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                >
                  <Icon size={22} style={{ color }} />
                  {/* Glow effect on hover */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
                    style={{ background: `${color}20` }}
                  />
                </div>

                {/* Category tag */}
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full mb-3 inline-block font-display uppercase tracking-wider"
                  style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
                >
                  {item.category}
                </span>

                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-primary transition-colors font-display">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>

                {/* Hover arrow */}
                <div className="mt-4 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color }}>
                  Learn more →
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
