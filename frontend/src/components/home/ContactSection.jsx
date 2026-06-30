import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { contactAPI, settingAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const budgetOptions = [
  'Under ₹25,000', '₹25,000 - ₹50,000', '₹50,000 - ₹1,00,000',
  '₹1,00,000 - ₹5,00,000', '₹5,00,000+', 'Not sure'
];

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await settingAPI.get();
        setSettings(data.data);
      } catch {
        // use fallback/default settings
      }
    };
    fetchSettings();
  }, []);

  const onSubmit = async (data) => {
    try {
      await contactAPI.submit(data);
      setSubmitted(true);
      reset();
      toast.success('Message sent! We\'ll contact you within 24 hours.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Please try again.');
    }
  };

  const email = settings?.emails?.[0] || 'info@steptrendy.com';
  const phone = settings?.phoneNumbers?.[0] || '+977-9800000000';
  const address = settings?.addresses?.[0] || 'Surat, India';
  const whatsappNum = settings?.whatsapp || '+9779800000000';
  const workingHours = settings?.workingHours || [
    { days: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
    { days: 'Saturday', time: '10:00 AM - 4:00 PM' }
  ];

  return (
    <section id="contact" className="py-24 bg-dark-card relative overflow-hidden">
      <div className="orb orb-blue w-96 h-96 top-0 -right-20 opacity-10 absolute" aria-hidden="true" />
      <div className="orb orb-purple w-80 h-80 bottom-0 -left-20 opacity-10 absolute" aria-hidden="true" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="tag mb-4 mx-auto w-fit">Contact Us</div>
          <h2 className="section-title text-white mb-5">
            Let's Build Something <span className="gradient-text">Together</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have a project in mind? Fill out the form below and we'll get back to you within 24 hours with a detailed proposal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* Email Card */}
            <a href={`mailto:${email}`} className="glass-card p-6 flex items-center gap-5 hover:border-primary/20 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors bg-primary/10 border border-primary/25">
                <Mail size={22} className="text-primary" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Email Us</p>
                <p className="text-white font-medium group-hover:text-primary transition-colors font-display">{email}</p>
              </div>
            </a>

            {/* Phone Card */}
            <a href={`tel:${phone}`} className="glass-card p-6 flex items-center gap-5 hover:border-[#7C3AED]/20 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors bg-[#7C3AED]/10 border border-[#7C3AED]/25">
                <Phone size={22} className="text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Call Us</p>
                <p className="text-white font-medium group-hover:text-primary transition-colors font-display">{phone}</p>
              </div>
            </a>

            {/* Map Card */}
            <div className="glass-card p-6 flex items-center gap-5 hover:border-[#00D4FF]/20 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors bg-[#00D4FF]/10 border border-[#00D4FF]/25">
                <MapPin size={22} className="text-[#00D4FF]" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Visit Us</p>
                <p className="text-white font-medium group-hover:text-primary transition-colors font-display">{address}</p>
              </div>
            </div>

            {/* Social / WhatsApp */}
            <a
              href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-6 flex items-center gap-5 hover:border-green-500/30 group"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/25 flex items-center justify-center flex-shrink-0">
                <MessageSquare size={22} className="text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">WhatsApp</p>
                <p className="text-white font-medium group-hover:text-green-400 transition-colors">Chat on WhatsApp</p>
              </div>
            </a>

            {/* Working Hours */}
            <div className="glass-card p-6">
              <h4 className="text-white font-semibold mb-3 font-display">Working Hours</h4>
              <div className="space-y-1.5 text-sm text-gray-400">
                {workingHours.map((wh, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{wh.days}</span>
                    <span className="text-white font-medium">{wh.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-12 text-center h-full flex flex-col items-center justify-center gap-6"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle size={40} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-2xl mb-2 font-display">Message Sent!</h3>
                  <p className="text-gray-400">We'll get back to you within 24 hours with a detailed proposal.</p>
                </div>
                <button onClick={() => setSubmitted(false)} className="btn-outline py-2.5 px-6 text-sm">
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2" htmlFor="name">Full Name *</label>
                    <input
                      id="name"
                      {...register('name', { required: 'Name is required' })}
                      className="input-dark"
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2" htmlFor="email">Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                      className="input-dark"
                      placeholder="john@company.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2" htmlFor="phone">Phone Number</label>
                    <input id="phone" {...register('phone')} className="input-dark" placeholder="+91 99999 99999" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2" htmlFor="company">Company Name</label>
                    <input id="company" {...register('company')} className="input-dark" placeholder="Your Company" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2" htmlFor="budget">Project Budget</label>
                  <select id="budget" {...register('budget')} className="input-dark appearance-none">
                    <option value="">Select budget range</option>
                    {budgetOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2" htmlFor="projectDetails">Project Details *</label>
                  <textarea
                    id="projectDetails"
                    {...register('projectDetails', { required: 'Please describe your project' })}
                    className="input-dark resize-none"
                    rows={5}
                    placeholder="Tell us about your project — what you want to build, timeline, specific requirements..."
                  />
                  {errors.projectDetails && <p className="text-red-400 text-xs mt-1">{errors.projectDetails.message}</p>}
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="btn-primary w-full py-4 text-base justify-center"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={18} /> Send Message
                    </span>
                  )}
                </motion.button>
                <p className="text-gray-500 text-xs text-center">
                  By submitting, you agree to our Privacy Policy. We'll never share your information.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
