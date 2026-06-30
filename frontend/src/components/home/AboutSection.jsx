import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, Eye, CheckCircle, Award, Users, Globe, Briefcase, Calendar } from 'lucide-react';
import { aboutAPI, timelineAPI } from '../../utils/api';

const stats = [
  { value: 100, suffix: '+', label: 'Projects Completed', icon: Briefcase },
  { value: 50, suffix: '+', label: 'Happy Clients', icon: Users },
  { value: 10, suffix: '+', label: 'Countries Served', icon: Globe },
  { value: 5, suffix: '+', label: 'Years of Experience', icon: Calendar },
];

const fallbackAbout = [
  { topic: 'Our Mission', detail: 'To empower businesses worldwide with innovative digital solutions that drive growth, enhance user experience, and create lasting impact.' },
  { topic: 'Our Vision', detail: 'To be the most trusted technology partner for startups and enterprises globally, known for excellence, innovation, and exceptional results.' },
  { topic: 'Our Values', detail: 'Quality, transparency, innovation, and customer success are at the heart of everything we do. We build partnerships, not just products.' }
];

const fallbackTimeline = [
  { year: '2022', title: 'Founded', desc: 'StepTrendy was born with a vision to build world-class digital products.' },
  { year: '2024', title: 'First 50 Clients', desc: 'Delivered premium websites and apps for startups across India.' },
  { year: '2026', title: 'International Expansion', desc: 'Started serving clients globally with high-end digital agency models.' }
];

const whyUs = [
  { title: 'Premium Quality', desc: 'We never compromise on quality and deliver pixel-perfect designs.' },
  { title: 'On-Time Delivery', desc: 'We respect your time and deliver every project on schedule.' },
  { title: 'Transparent Process', desc: 'Complete visibility into every phase of your project.' },
  { title: 'Post-Launch Support', desc: '6 months of free support after every project delivery.' },
];

function Counter({ value, suffix, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = value / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <>{count}{suffix}</>;
}

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.2 });
  const [aboutItems, setAboutItems] = useState([]);
  const [timelineItems, setTimelineItems] = useState([]);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const abRes = await aboutAPI.getAll();
        setAboutItems(abRes.data.data?.length ? abRes.data.data : fallbackAbout);
      } catch {
        setAboutItems(fallbackAbout);
      }
      try {
        const tlRes = await timelineAPI.getAll();
        setTimelineItems(tlRes.data.data?.length ? tlRes.data.data : fallbackTimeline);
      } catch {
        setTimelineItems(fallbackTimeline);
      }
    };
    fetchAboutData();
  }, []);

  const getAboutIcon = (idx) => {
    if (idx === 0) return Target;
    if (idx === 1) return Eye;
    return Award;
  };

  const getAboutColor = (idx) => {
    if (idx === 0) return '#5B8CFF';
    if (idx === 1) return '#7C3AED';
    return '#00D4FF';
  };

  return (
    <section id="about" className="py-24 bg-dark relative overflow-hidden">
      <div className="orb orb-cyan w-64 h-64 top-0 left-0 opacity-10 absolute" aria-hidden="true" />
      <div className="orb orb-purple w-96 h-96 bottom-0 right-0 opacity-10 absolute" aria-hidden="true" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="tag mb-4 mx-auto w-fit">About Us</div>
          <h2 className="section-title text-white mb-5">
            We Are <span className="gradient-text">StepTrendy</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A team of passionate designers, developers, and strategists building the digital future.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {aboutItems.map((item, idx) => {
            const Icon = getAboutIcon(idx);
            const color = getAboutColor(idx);
            return (
              <motion.div
                key={item._id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="glass-card p-8 text-center"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                  <Icon size={26} style={{ color }} />
                </div>
                <h3 className="text-white font-bold text-xl mb-3 font-display">{item.topic}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.detail}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map(({ value, suffix, label, icon: Icon }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card p-8 text-center group hover:border-primary/20"
            >
              <Icon size={28} className="text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <div className="stat-number mb-2">
                <Counter value={value} suffix={suffix} inView={inView} />
              </div>
              <p className="text-gray-400 text-sm">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline + Why Us */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Timeline */}
          <div>
            <h3 className="text-white font-bold text-2xl mb-8">Our Journey</h3>
            <div className="space-y-6">
              {timelineItems.map(({ year, title, desc, _id }, i) => (
                <motion.div
                  key={_id || i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="timeline-item"
                >
                  <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-dark border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div className="glass-card p-5 hover:border-primary/20">
                    <div className="text-primary text-xs font-mono font-bold mb-1">{year}</div>
                    <div className="text-white font-semibold mb-1 font-display">{title}</div>
                    <div className="text-gray-400 text-sm">{desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div>
            <h3 className="text-white font-bold text-2xl mb-8">Why Choose StepTrendy?</h3>
            <div className="space-y-4">
              {whyUs.map(({ title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 glass-card p-5 hover:border-primary/20 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors mt-0.5">
                    <CheckCircle size={18} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 p-6 rounded-2xl neon-border bg-gradient-to-br from-primary/5 to-secondary/5"
            >
              <h4 className="text-white font-bold text-xl mb-2">Ready to Work Together?</h4>
              <p className="text-gray-400 text-sm mb-4">Book a free 30-minute consultation with our team.</p>
              <a href="/contact" className="btn-primary text-sm py-3 px-6 inline-flex">
                Book Free Consultation
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
