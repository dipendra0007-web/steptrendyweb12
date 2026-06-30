import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonialAPI } from '../../utils/api';

const demoTestimonials = [
  {
    _id: '1', name: 'Sarah Johnson', role: 'CEO', company: 'TechVentures Inc', rating: 5,
    feedback: "StepTrendy delivered an exceptional product that exceeded all our expectations. Their attention to detail and technical expertise is unmatched. The team was professional, responsive, and truly understood our vision.",
    avatar: 'https://i.pravatar.cc/100?img=1', project: 'SaaS Dashboard'
  },
  {
    _id: '2', name: 'Michael Chen', role: 'CTO', company: 'FinEdge', rating: 5,
    feedback: "Working with StepTrendy was a game-changer for our startup. They built our entire fintech platform in record time without compromising quality. Highly recommend for complex technical projects!",
    avatar: 'https://i.pravatar.cc/100?img=7', project: 'FinTech Platform'
  },
  {
    _id: '3', name: 'Priya Sharma', role: 'Founder', company: 'StyleBrand', rating: 5,
    feedback: "The brand identity they created for us is absolutely stunning. They captured our vision perfectly and delivered more than we expected. Our brand recognition has increased significantly since the redesign.",
    avatar: 'https://i.pravatar.cc/100?img=5', project: 'Brand Identity'
  },
  {
    _id: '4', name: 'David Williams', role: 'Product Manager', company: 'AppLaunch', rating: 5,
    feedback: "StepTrendy built our mobile app from scratch and it's performing beautifully. Their UI/UX expertise and development skills resulted in an app our users love. 5-star experience all around!",
    avatar: 'https://i.pravatar.cc/100?img=12', project: 'Mobile App'
  },
  {
    _id: '5', name: 'Emma Thompson', role: 'Marketing Director', company: 'GrowthCo', rating: 5,
    feedback: "The digital marketing and SEO strategies implemented by StepTrendy doubled our organic traffic in just 3 months. Their data-driven approach and reporting were excellent throughout.",
    avatar: 'https://i.pravatar.cc/100?img=9', project: 'Digital Marketing'
  },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(demoTestimonials);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await testimonialAPI.getAll({ featured: true });
        if (data.data && data.data.length > 0) setTestimonials(data.data);
      } catch { /* use demo */ }
    };
    fetchTestimonials();
  }, []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goTo = (i) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };

  const prev = () => { setDirection(-1); setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length); };
  const next = () => { setDirection(1); setCurrent((c) => (c + 1) % testimonials.length); };

  const t = testimonials[current] || { rating: 5, feedback: 'Loading feedback...', name: 'Loading...', role: 'Client', company: 'Partner', avatar: '' };

  return (
    <section id="testimonials" className="py-24 bg-dark-card relative overflow-hidden">
      <div className="orb orb-purple w-80 h-80 top-0 left-0 opacity-10 absolute" aria-hidden="true" />
      <div className="orb orb-cyan w-64 h-64 bottom-0 right-0 opacity-10 absolute" aria-hidden="true" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="tag mb-4 mx-auto w-fit">Testimonials</div>
          <h2 className="section-title text-white mb-5">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Don't take our word for it — hear from the amazing people we've worked with.
          </p>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Quote icon */}
            <div className="absolute -top-4 left-6 z-20 w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Quote size={18} className="text-primary" />
            </div>

            {/* Card */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 60 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="glass-card p-10 md:p-12"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={18} className="text-yellow-400" fill="currentColor" />
                    ))}
                  </div>

                  {/* Feedback */}
                  <p className="text-gray-200 text-lg leading-relaxed mb-8 italic">
                    "{t.feedback}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-14 h-14 rounded-full border-2 border-primary/30 object-cover"
                      onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${t.name}&background=5B8CFF&color=fff`; }}
                    />
                    <div>
                      <div className="text-white font-bold">{t.name}</div>
                      <div className="text-gray-400 text-sm">{t.role} at {t.company}</div>
                      {t.project && (
                        <span className="text-xs text-primary mt-0.5 inline-block">Project: {t.project}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`transition-all duration-300 rounded-full h-2 ${
                      i === current ? 'w-8 bg-primary' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={prev} aria-label="Previous" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-primary/40 hover:bg-primary/10 transition-all">
                  <ChevronLeft size={18} className="text-white" />
                </button>
                <button onClick={next} aria-label="Next" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-primary/40 hover:bg-primary/10 transition-all">
                  <ChevronRight size={18} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mini cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { label: '5-star', value: 'Reviews', num: '50+' },
            { label: 'Client', value: 'Satisfaction', num: '99%' },
            { label: 'On-time', value: 'Delivery', num: '98%' },
            { label: 'Repeat', value: 'Clients', num: '80%' },
          ].map(({ label, value, num }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-5 text-center"
            >
              <div className="text-2xl font-bold gradient-text font-display">{num}</div>
              <div className="text-gray-400 text-xs mt-1">{label} {value}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
