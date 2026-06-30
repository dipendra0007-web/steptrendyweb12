import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Star, Crown } from 'lucide-react';
import { pricingAPI } from '../../utils/api';

const fallbackPlans = [
  { name: 'Starter', price: '15,000', currency: 'INR', tagline: 'Perfect for small businesses', color: '#5B8CFF', features: ['5-page responsive website', 'Mobile friendly design', 'Contact form', 'Basic SEO setup'] },
  { name: 'Professional', price: '45,000', currency: 'INR', tagline: 'Most popular for growing businesses', color: '#7C3AED', featured: true, features: ['10-page responsive website', 'Custom UI/UX design', 'Admin panel (CMS)', 'Advanced animations'] },
  { name: 'Enterprise', price: 'Custom', currency: 'USD', tagline: 'For large-scale enterprise needs', color: '#00D4FF', features: ['Unlimited pages', 'Custom software development', 'AI/ML integration'] }
];

export default function PricingSection() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await pricingAPI.getAll();
        setPlans(data.data?.length ? data.data : fallbackPlans);
      } catch {
        setPlans(fallbackPlans);
      }
    };
    fetchPlans();
  }, []);

  const getCurrencySymbol = (cur) => {
    if (cur === 'NPR') return 'रू';
    if (cur === 'USD') return '$';
    return '₹';
  };

  const getIcon = (idx) => {
    if (idx === 0) return Zap;
    if (idx === 1) return Star;
    return Crown;
  };

  return (
    <section id="pricing" className="py-24 bg-dark relative overflow-hidden">
      <div className="orb orb-purple w-96 h-96 top-0 right-0 opacity-10 absolute" aria-hidden="true" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="tag mb-4 mx-auto w-fit">Pricing</div>
          <h2 className="section-title text-white mb-5">
            Transparent <span className="gradient-text">Pricing Plans</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Flexible pricing to match your project scope and budget. No hidden fees.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {plans.map((item, i) => {
            const Icon = getIcon(i);
            const color = item.color || '#5B8CFF';
            const priceVal = item.price;
            const currencySymbol = getCurrencySymbol(item.currency);
            
            return (
              <motion.div
                key={item._id || item.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`pricing-card ${item.featured ? 'featured shadow-neon-blue' : ''}`}
              >
                {item.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white bg-primary">
                    Most Popular
                  </div>
                )}

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                  <Icon size={24} style={{ color }} />
                </div>

                <h3 className="text-white font-bold text-2xl mb-1 font-display">{item.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{item.tagline}</p>

                <div className="mb-6 flex items-baseline">
                  {priceVal !== 'Custom' && priceVal !== 'Contact Us' && (
                    <span className="text-2xl font-bold font-display text-white mr-1">{currencySymbol}</span>
                  )}
                  <span className="text-4xl font-bold font-display text-white">{priceVal}</span>
                  {priceVal !== 'Custom' && priceVal !== 'Contact Us' && item.period && (
                    <span className="text-gray-400 text-sm ml-2">/{item.period}</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {item.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
                        <Check size={12} style={{ color }} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`block text-center py-3.5 px-6 rounded-xl font-semibold text-sm transition-all ${
                    item.featured ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  Get Started →
                </motion.a>
              </motion.div>
            );
          })}
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 text-sm mt-10"
        >
          All pricing is shown transparently in INR/NPR/USD based on settings. Custom quotes available for complex projects.{' '}
          <a href="/contact" className="text-primary hover:underline font-semibold">Contact us</a> for a free estimate.
        </motion.p>
      </div>
    </section>
  );
}
