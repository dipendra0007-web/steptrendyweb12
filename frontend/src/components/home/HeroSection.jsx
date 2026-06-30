import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Play, Code2, Smartphone, Palette, Zap, Star, Users, Globe } from 'lucide-react';

const floatingIcons = [
  { icon: Code2, top: '15%', left: '8%', delay: 0, color: '#5B8CFF' },
  { icon: Smartphone, top: '70%', left: '6%', delay: 0.5, color: '#7C3AED' },
  { icon: Palette, top: '20%', right: '8%', delay: 1, color: '#00D4FF' },
  { icon: Zap, top: '65%', right: '10%', delay: 1.5, color: '#5B8CFF' },
  { icon: Star, top: '40%', left: '4%', delay: 2, color: '#00D4FF' },
  { icon: Globe, top: '80%', right: '5%', delay: 0.8, color: '#7C3AED' },
];

const stats = [
  { value: '100+', label: 'Projects', icon: '🚀' },
  { value: '50+', label: 'Clients', icon: '🌍' },
  { value: '10+', label: 'Countries', icon: '🏆' },
  { value: '5+', label: 'Years', icon: '⭐' },
];

export default function HeroSection() {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrame;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#5B8CFF' : '#7C3AED',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(91,140,255,${0.05 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', setSize);
    };
  }, []);

  // Mouse parallax
  const handleMouseMove = (e) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
    });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark"
      onMouseMove={handleMouseMove}
      id="hero"
    >
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" aria-hidden="true" />

      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ x: mousePos.x * 0.5, y: mousePos.y * 0.5 }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
          className="orb orb-blue w-[600px] h-[600px] -top-32 -left-32 opacity-20"
        />
        <motion.div
          animate={{ x: mousePos.x * -0.3, y: mousePos.y * -0.3 }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
          className="orb orb-purple w-[500px] h-[500px] top-1/2 right-0 opacity-20"
        />
        <motion.div
          animate={{ x: mousePos.x * 0.2, y: mousePos.y * 0.2 }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
          className="orb orb-cyan w-[300px] h-[300px] bottom-0 left-1/2 opacity-15"
        />
        {/* Grid */}
        <div className="absolute inset-0 grid-lines opacity-30" />
      </div>

      {/* Floating Tech Icons */}
      {floatingIcons.map(({ icon: Icon, top, left, right, delay, color }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
          transition={{ delay: delay + 1, duration: 4, y: { repeat: Infinity, duration: 4 + i * 0.5, ease: 'easeInOut' } }}
          className="absolute hidden lg:flex items-center justify-center w-12 h-12 rounded-xl"
          style={{
            top, left, right,
            background: `rgba(${color === '#5B8CFF' ? '91,140,255' : color === '#7C3AED' ? '124,58,237' : '0,212,255'}, 0.1)`,
            border: `1px solid ${color}30`,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Icon size={22} style={{ color }} />
        </motion.div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 section-container text-center pt-24 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Available for new projects
          <ArrowRight size={14} />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="section-title text-white mb-6 max-w-5xl mx-auto"
        >
          Building Digital Experiences{' '}
          <span className="gradient-text">That Inspire</span>
        </motion.h1>

        {/* Type Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-2xl text-gray-400 mb-6 font-light"
        >
          We build{' '}
          <span className="text-white font-semibold">
            <TypeAnimation
              sequence={[
                'stunning websites', 1500,
                'mobile applications', 1500,
                'beautiful UI/UX designs', 1500,
                'AI-powered products', 1500,
                'digital experiences', 1500,
                'scalable software', 1500,
              ]}
              repeat={Infinity}
              speed={50}
            />
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed text-base md:text-lg"
        >
          We design beautiful websites, mobile apps, UI/UX, branding, AI-powered products, and scalable software solutions for startups and enterprises worldwide.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            to="/contact"
            id="hero-cta-start"
            className="btn-primary text-base px-8 py-4 rounded-xl shadow-neon-blue"
          >
            Start Your Project <ArrowRight size={18} />
          </Link>
          <Link
            to="/portfolio"
            id="hero-cta-portfolio"
            className="btn-outline text-base px-8 py-4 rounded-xl flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Play size={14} className="ml-0.5" />
            </div>
            View Portfolio
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {stats.map(({ value, label, icon }) => (
            <div
              key={label}
              className="glass-card p-4 text-center border border-white/5 rounded-xl"
            >
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-2xl font-bold font-display gradient-text">{value}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Trusted By */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <p className="text-gray-500 text-sm">Trusted by teams worldwide</p>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-dark bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 text-yellow-400 ml-2">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <span className="text-gray-400 text-sm ml-1">5.0 (50+ reviews)</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.5, y: { repeat: Infinity, duration: 1.5 } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-gray-500 text-xs font-mono tracking-widest">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent" />
      </motion.div>
    </section>
  );
}
