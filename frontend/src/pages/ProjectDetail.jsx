import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Eye, ExternalLink, Github, Calendar, Users, Code2, Clock } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { portfolioAPI } from '../utils/api';

const demoProject = {
  title: 'FinTech Dashboard', category: 'web', client: 'FinCorp Inc.',
  technologies: ['React.js', 'Node.js', 'MongoDB', 'Chart.js', 'Tailwind CSS'],
  description: 'A comprehensive financial analytics dashboard built for FinCorp Inc. This project involved creating a highly responsive, data-rich interface for real-time financial data visualization. We designed and developed the complete system from scratch, including custom charting components, real-time WebSocket updates, role-based access control, and a mobile-first design approach.',
  duration: '8 Weeks', likes: 234, views: 1520,
  coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
  images: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800',
  ],
  colorPalette: [
    { name: 'Primary', hex: '#5B8CFF' }, { name: 'Secondary', hex: '#7C3AED' },
    { name: 'Background', hex: '#080808' }, { name: 'Success', hex: '#22C55E' },
  ],
  liveUrl: 'https://example.com', githubUrl: 'https://github.com',
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await portfolioAPI.getOne(slug);
        setProject(data.data);
      } catch {
        setProject({ ...demoProject, slug });
      } finally { setLoading(false); }
    };
    fetch();
  }, [slug]);

  const handleLike = async () => {
    if (liked) return;
    try {
      await portfolioAPI.like(project._id);
      setProject(prev => ({ ...prev, likes: prev.likes + 1 }));
      setLiked(true);
    } catch { /* ignore */ }
  };

  if (loading) return (
    <div className="bg-dark min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!project) return null;

  const images = project.images?.length ? project.images : [project.coverImage];

  return (
    <div className="bg-dark min-h-screen">
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <div className="relative h-[60vh] overflow-hidden">
          <img src={images[activeImage] || project.coverImage} alt={project.title}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="section-container pb-12">
              <Link to="/portfolio" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm">
                <ArrowLeft size={16} /> Back to Portfolio
              </Link>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                <span className="tag mb-3 inline-flex capitalize">{project.category}</span>
                <h1 className="section-title text-white mb-4">{project.title}</h1>
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5"><Users size={14} /> {project.client}</span>
                  {project.duration && <span className="flex items-center gap-1.5"><Clock size={14} /> {project.duration}</span>}
                  <span className="flex items-center gap-1.5"><Eye size={14} /> {project.views} views</span>
                  <button onClick={handleLike} className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-red-400' : 'hover:text-red-400'}`}>
                    <Heart size={14} fill={liked ? 'currentColor' : 'none'} /> {project.likes}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="section-container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-white font-bold text-2xl mb-4">Project Overview</h2>
                <p className="text-gray-400 leading-relaxed">{project.description}</p>
              </motion.div>

              {/* Image Gallery */}
              {images.length > 1 && (
                <div>
                  <h2 className="text-white font-bold text-2xl mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {images.map((img, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setActiveImage(i)}
                        className={`relative h-40 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                          activeImage === i ? 'border-primary' : 'border-transparent'
                        }`}
                      >
                        <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Palette */}
              {project.colorPalette && (
                <div>
                  <h2 className="text-white font-bold text-2xl mb-4">Color Palette</h2>
                  <div className="flex flex-wrap gap-4">
                    {project.colorPalette.map(({ name, hex }) => (
                      <div key={name} className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-xl shadow-card border border-white/10" style={{ background: hex }} />
                        <span className="text-gray-400 text-xs">{name}</span>
                        <span className="text-gray-500 text-xs font-mono">{hex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Details */}
              <div className="glass-card p-6">
                <h3 className="text-white font-bold text-lg mb-5">Project Details</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Client', value: project.client, icon: Users },
                    { label: 'Category', value: project.category, icon: Code2 },
                    { label: 'Duration', value: project.duration || 'Custom', icon: Clock },
                    { label: 'Year', value: new Date(project.createdAt || Date.now()).getFullYear(), icon: Calendar },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={14} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">{label}</p>
                        <p className="text-white capitalize">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="glass-card p-6">
                <h3 className="text-white font-bold text-lg mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {(project.technologies || []).map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="glass-card p-6 space-y-3">
                <h3 className="text-white font-bold text-lg mb-4">Project Links</h3>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full text-center text-sm py-3 flex items-center justify-center gap-2">
                    <ExternalLink size={16} /> View Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline w-full text-center text-sm py-3 flex items-center justify-center gap-2">
                    <Github size={16} /> View on GitHub
                  </a>
                )}
                <Link to="/contact" className="block text-center text-sm text-primary hover:underline mt-2">
                  Start a similar project →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
