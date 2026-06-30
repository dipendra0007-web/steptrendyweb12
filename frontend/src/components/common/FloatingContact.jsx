import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone, Mail, Send } from 'lucide-react';

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  const options = [
    {
      icon: Send,
      label: 'WhatsApp',
      href: 'https://wa.me/919999999999?text=Hi, I need help with a project',
      color: '#25D366',
      bg: 'rgba(37,211,102,0.1)',
      border: 'rgba(37,211,102,0.2)',
    },
    {
      icon: Phone,
      label: 'Call Us',
      href: 'tel:+919999999999',
      color: '#5B8CFF',
      bg: 'rgba(91,140,255,0.1)',
      border: 'rgba(91,140,255,0.2)',
    },
    {
      icon: Mail,
      label: 'Email Us',
      href: 'mailto:info@steptrendy.com',
      color: '#00D4FF',
      bg: 'rgba(0,212,255,0.1)',
      border: 'rgba(0,212,255,0.2)',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="flex flex-col gap-2"
          >
            {options.map(({ icon: Icon, label, href, color, bg, border }, i) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-md text-white text-sm font-medium shadow-card hover:scale-105 transition-transform"
                style={{ background: bg, border: `1px solid ${border}` }}
              >
                <Icon size={18} style={{ color }} />
                <span>{label}</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        aria-label="Contact options"
        className="w-14 h-14 rounded-2xl btn-primary !p-0 flex items-center justify-center shadow-neon-blue"
        style={{ boxShadow: '0 0 30px rgba(91,140,255,0.4)' }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <MessageCircle size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
