import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Briefcase, MapPin, Clock, ChevronDown, ChevronUp, Send, X, Upload } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { careerAPI } from '../utils/api';
import toast from 'react-hot-toast';

const demoJobs = [
  { _id: '1', title: 'Senior React Developer', department: 'Engineering', location: 'Remote / Surat', type: 'full-time', experience: '3-5 years', salary: '₹8-15 LPA', description: 'We are looking for a talented React developer to join our growing team.', requirements: ['Strong React.js skills', 'Node.js experience', 'TypeScript knowledge', 'Team player'], skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'] },
  { _id: '2', title: 'UI/UX Designer', department: 'Design', location: 'Remote', type: 'full-time', experience: '2-4 years', salary: '₹5-10 LPA', description: 'Creative UI/UX designer to craft beautiful digital experiences.', requirements: ['Figma expertise', 'Design systems', 'Prototyping skills', 'Portfolio required'], skills: ['Figma', 'Adobe XD', 'Prototyping', 'Design Systems'] },
  { _id: '3', title: 'Flutter Developer', department: 'Mobile', location: 'Surat / Remote', type: 'full-time', experience: '1-3 years', salary: '₹4-8 LPA', description: 'Flutter developer to build cross-platform mobile applications.', requirements: ['Flutter/Dart skills', 'Firebase knowledge', 'REST API integration'], skills: ['Flutter', 'Dart', 'Firebase', 'REST APIs'] },
  { _id: '4', title: 'Digital Marketing Executive', department: 'Marketing', location: 'Surat', type: 'full-time', experience: '1-2 years', salary: '₹2.5-4 LPA', description: 'SEO/Social Media specialist to drive organic growth.', requirements: ['SEO knowledge', 'Social media management', 'Content writing', 'Google Analytics'], skills: ['SEO', 'Social Media', 'Google Ads', 'Content Writing'] },
];

function JobCard({ job, onApply }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-6">
      <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">{job.type}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">{job.department}</span>
          </div>
          <h3 className="text-white font-bold text-xl mb-2">{job.title}</h3>
          <div className="flex flex-wrap gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><MapPin size={13} /> {job.location}</span>
            <span className="flex items-center gap-1.5"><Clock size={13} /> {job.experience}</span>
            <span className="flex items-center gap-1.5"><Briefcase size={13} /> {job.salary}</span>
          </div>
        </div>
        <div className="text-gray-400 flex-shrink-0 mt-1">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pt-6 border-t border-dark-border mt-5">
              <p className="text-gray-400 text-sm mb-4">{job.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <h4 className="text-white font-semibold text-sm mb-2">Requirements</h4>
                  <ul className="space-y-1">
                    {(job.requirements || []).map((r) => (
                      <li key={r} className="text-gray-400 text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />{r}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(job.skills || []).map((s) => (
                      <span key={s} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => onApply(job)} className="btn-primary text-sm py-2.5 px-6">
                Apply Now →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ApplyModal({ job, onClose }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await careerAPI.apply(job._id, data);
      toast.success('Application submitted! We\'ll review and get back to you.');
      reset();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative glass-card p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-bold text-xl">Apply for Position</h3>
            <p className="text-gray-400 text-sm">{job.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><X size={20} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="block text-gray-400 text-sm mb-1.5">Full Name *</label>
            <input {...register('name', { required: 'Required' })} className="input-dark" placeholder="Your Name" />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div><label className="block text-gray-400 text-sm mb-1.5">Email *</label>
            <input type="email" {...register('email', { required: 'Required' })} className="input-dark" placeholder="your@email.com" />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div><label className="block text-gray-400 text-sm mb-1.5">Phone *</label>
            <input {...register('phone', { required: 'Required' })} className="input-dark" placeholder="+91 99999 99999" />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div><label className="block text-gray-400 text-sm mb-1.5">Portfolio URL</label>
            <input {...register('portfolioUrl')} className="input-dark" placeholder="https://yourportfolio.com" />
          </div>
          <div><label className="block text-gray-400 text-sm mb-1.5">LinkedIn URL</label>
            <input {...register('linkedinUrl')} className="input-dark" placeholder="https://linkedin.com/in/you" />
          </div>
          <div><label className="block text-gray-400 text-sm mb-1.5">Cover Letter</label>
            <textarea {...register('coverLetter')} className="input-dark resize-none" rows={4} placeholder="Tell us why you're a great fit..." />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 justify-center flex gap-2 items-center">
            {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : <><Send size={16} />Submit Application</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function Careers() {
  const [jobs, setJobs] = useState(demoJobs);
  const [applyJob, setApplyJob] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await careerAPI.getJobs();
        if (data.data.length > 0) setJobs(data.data);
      } catch { /* demo */ }
    };
    fetch();
  }, []);

  return (
    <div className="bg-dark min-h-screen">
      <Navbar />
      <main className="pt-24">
        <section className="py-16 text-center relative overflow-hidden">
          <div className="orb orb-purple w-80 h-80 top-0 left-0 opacity-10 absolute" />
          <div className="section-container">
            <div className="tag mb-4 mx-auto w-fit">Join Our Team</div>
            <h1 className="section-title text-white mb-4">Build the Future with <span className="gradient-text">StepTrendy</span></h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">We're always looking for talented people to join our growing team. Remote-first, collaborative, and impact-driven.</p>
          </div>
        </section>

        <div className="section-container pb-16">
          <div className="mb-6">
            <h2 className="text-white font-bold text-2xl mb-1">Open Positions</h2>
            <p className="text-gray-400 text-sm">{jobs.length} position{jobs.length !== 1 ? 's' : ''} available</p>
          </div>
          <div className="space-y-4">
            {jobs.map((job) => <JobCard key={job._id} job={job} onApply={setApplyJob} />)}
          </div>
          {jobs.length === 0 && (
            <div className="text-center py-20 glass-card">
              <p className="text-gray-400">No open positions currently. Check back soon!</p>
              <a href="mailto:careers@steptrendy.com" className="btn-primary mt-4 inline-flex">Send Open Application</a>
            </div>
          )}
        </div>
      </main>
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
      <Footer />
    </div>
  );
}
