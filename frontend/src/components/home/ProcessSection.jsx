import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { processAPI } from '../../utils/api';

const fallbackSteps = [
  { step: '01', photo: 'Search', name: 'Requirement Analysis', description: 'Deep dive into your business goals, target audience, and project requirements.' },
  { step: '02', photo: 'FileText', name: 'Research & Strategy', description: 'Market research, competitor analysis, and strategic planning for your project.' },
  { step: '03', photo: 'Layout', name: 'Wireframing', description: 'Low-fidelity wireframes to map out the information architecture and user flows.' },
  { step: '04', photo: 'Palette', name: 'UI Design', description: 'High-fidelity pixel-perfect designs with your brand identity and design system.' }
];

export default function ProcessSection() {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const { data } = await processAPI.getAll();
        setSteps(data.data?.length ? data.data : fallbackSteps);
      } catch {
        setSteps(fallbackSteps);
      }
    };
    fetchSteps();
  }, []);

  return (
    <section id="process" className="py-24 bg-dark relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-20" aria-hidden="true" />
      <div className="orb orb-blue w-80 h-80 bottom-0 right-0 opacity-10 absolute" aria-hidden="true" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="tag mb-4 mx-auto w-fit">Our Process</div>
          <h2 className="section-title text-white mb-5">
            How We <span className="gradient-text">Work</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A structured, proven process that ensures quality delivery on time, every time.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, i) => {
            const Icon = Icons[item.photo] || Icons.HelpCircle;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="relative glass-card p-7 group"
              >
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-dark border border-primary/40 flex items-center justify-center">
                  <span className="text-xs font-bold font-mono text-primary">{item.step}</span>
                </div>

                {/* Connector line on larger screens */}
                {i < steps.length - 1 && (i + 1) % 4 !== 0 && (
                  <div className="hidden lg:block absolute top-10 -right-3 w-6 h-px bg-gradient-to-r from-primary/50 to-transparent z-20" />
                )}

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Icon size={22} className="text-primary" />
                </div>

                <h3 className="text-white font-semibold text-base mb-2 group-hover:text-primary transition-colors font-display">
                  {item.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <p className="text-gray-400 mb-4">Ready to start your project journey?</p>
          <a href="/contact" className="btn-primary px-8 py-3.5">
            Get Started Today →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
