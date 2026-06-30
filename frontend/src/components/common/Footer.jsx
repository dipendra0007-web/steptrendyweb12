import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { newsletterAPI, settingAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const footerLinks = {
  Services: [
    { name: 'Web Development', href: '/#services' },
    { name: 'Mobile Apps', href: '/#services' },
    { name: 'UI/UX Design', href: '/#services' },
    { name: 'AI Solutions', href: '/#services' },
    { name: 'Digital Marketing', href: '/#services' },
    { name: 'Branding', href: '/#services' },
  ],
  Company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/team' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await settingAPI.get();
        setSettings(data.data);
      } catch {
        // use defaults
      }
    };
    fetchSettings();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await newsletterAPI.subscribe(email);
      toast.success('Subscribed successfully! 🎉');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubscribing(false);
    }
  };

  const logo = settings?.logo || '/logo.png';
  const websiteName = settings?.websiteName || 'StepTrendy Technologies';
  const copyright = settings?.copyrightText || `© ${new Date().getFullYear()} ${websiteName}. All rights reserved.`;
  const emailVal = settings?.emails?.[0] || 'info@steptrendy.com';
  const phoneVal = settings?.phoneNumbers?.[0] || '+91 99999 99999';
  const addressVal = settings?.addresses?.[0] || 'Surat, Gujarat, India';
  const whatsappNum = settings?.whatsapp || '+9779800000000';
  const socialsList = settings?.socials?.length ? settings.socials : [
    { name: 'Twitter', icon: 'Twitter', link: 'https://twitter.com' },
    { name: 'LinkedIn', icon: 'Linkedin', link: 'https://linkedin.com' },
    { name: 'GitHub', icon: 'Github', link: 'https://github.com' }
  ];

  return (
    <footer className="relative bg-dark border-t border-dark-border overflow-hidden">
      {/* Background Orbs */}
      <div className="orb orb-blue w-96 h-96 -top-20 -left-20 opacity-10" />
      <div className="orb orb-purple w-96 h-96 -bottom-20 -right-20 opacity-10" />

      {/* CTA Banner */}
      <div className="relative border-b border-dark-border">
        <div className="section-container py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center justify-between gap-8"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-3 text-white">
                Ready to Build Something <span className="gradient-text">Amazing?</span>
              </h2>
              <p className="text-gray-400 text-lg">Let's turn your ideas into powerful digital products.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="btn-primary whitespace-nowrap">
                Start Your Project <Icons.ArrowRight size={16} />
              </Link>
              <a
                href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline whitespace-nowrap"
              >
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img src={logo} alt={websiteName} className="h-12 w-auto" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              {websiteName} is a premium software development agency crafting world-class digital experiences for startups and enterprises globally.
            </p>
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a href={`mailto:${emailVal}`} className="flex items-center gap-3 text-sm text-gray-400 hover:text-primary transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icons.Mail size={14} className="text-primary" />
                </div>
                {emailVal}
              </a>
              <a href={`tel:${phoneVal}`} className="flex items-center gap-3 text-sm text-gray-400 hover:text-primary transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icons.Phone size={14} className="text-primary" />
                </div>
                {phoneVal}
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icons.MapPin size={14} className="text-primary" />
                </div>
                {addressVal}
              </div>
            </div>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {socialsList.map((s, idx) => {
                const IconComponent = Icons[s.icon] || Icons.Share2;
                return (
                  <motion.a
                    key={idx}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all duration-200"
                  >
                    <IconComponent size={16} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-primary text-sm transition-colors duration-200 animated-underline font-display"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-dark-border">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold mb-1">Stay in the loop</h4>
              <p className="text-gray-400 text-sm">Get the latest updates, articles and resources.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full lg:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-dark text-sm py-3 min-w-0 flex-1 lg:w-72"
                required
              />
              <button type="submit" disabled={subscribing} className="btn-primary text-sm py-3 px-5 whitespace-nowrap">
                {subscribing ? 'Subscribing...' : <><Icons.Send size={16} /> Subscribe</>}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-border">
        <div className="section-container py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            <p className="font-display">{copyright}</p>
            <p className="flex items-center gap-1">
              Made with <span className="text-red-500">❤</span> by StepTrendy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
