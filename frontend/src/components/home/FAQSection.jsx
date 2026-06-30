import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqAPI } from '../../utils/api';

const fallbackFaqs = [
  { question: 'What technologies do you use?', answer: 'We primarily use React.js, Next.js, Node.js, MongoDB, and Tailwind CSS for web. For mobile, we use React Native and Flutter. We also work with Python for AI/ML projects.' },
  { question: 'Do you provide post-launch support?', answer: 'Yes! All our plans include free support. Starter plan includes 1 month, Professional includes 3 months, and Enterprise clients get 12 months of priority support.' },
  { question: 'Will my website be mobile-friendly?', answer: 'Every project we deliver is 100% responsive and tested across all major devices — desktop, laptop, tablet, and mobile (iOS and Android).' }
];

function FAQItem({ q, a, isOpen, onClick }) {
  return (
    <div className="faq-item border-b border-white/5 py-4" onClick={onClick}>
      <div className="flex items-center justify-between gap-4 cursor-pointer">
        <h3 className={`font-medium text-sm md:text-base transition-colors font-display ${isOpen ? 'text-primary' : 'text-white'}`}>
          {q}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={18} className={isOpen ? 'text-primary' : 'text-gray-500'} />
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 text-sm leading-relaxed pt-4 whitespace-pre-line">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data } = await faqAPI.getAll();
        setFaqs(data.data?.length ? data.data : fallbackFaqs);
      } catch {
        setFaqs(fallbackFaqs);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <section id="faq" className="py-24 bg-dark-card relative overflow-hidden">
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="tag mb-4 mx-auto w-fit">FAQ</div>
          <h2 className="section-title text-white mb-5">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Have questions? We have answers. If you don't find what you're looking for, feel free to contact us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* FAQ List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            {faqs.map((faq, i) => (
              <FAQItem
                key={faq._id || i}
                q={faq.question}
                a={faq.answer}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <div className="glass-card p-8 neon-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <HelpCircle size={24} className="text-primary" />
              </div>
              <h3 className="text-white font-bold text-xl mb-3">Still have questions?</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Can't find the answer you're looking for? Book a free 30-minute consultation call with our team and get all your questions answered.
              </p>
              <div className="flex flex-col gap-3">
                <a href="/contact" className="btn-primary text-center py-3.5 font-semibold">
                  Book Free Consultation
                </a>
                <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="btn-outline text-center py-3.5 font-semibold">
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Response Time', value: '< 2 Hours', emoji: '⚡' },
                { label: 'Satisfaction Rate', value: '99%', emoji: '🌟' },
              ].map(({ label, value, emoji }) => (
                <div key={label} className="glass-card p-5 text-center">
                  <div className="text-2xl mb-2">{emoji}</div>
                  <div className="text-white font-bold text-lg">{value}</div>
                  <div className="text-gray-400 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
