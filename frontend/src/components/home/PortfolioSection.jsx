import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Heart, ExternalLink, Github, ArrowRight, Filter } from 'lucide-react';
import { portfolioAPI } from '../../utils/api';

const categories = ['all', 'web', 'mobile', 'ui-ux', 'branding', 'ai'];

// Demo data for when backend isn't connected
const demoProjects = [
  {
    _id: '1', title: 'FinTech Dashboard', category: 'web', client: 'FinCorp', slug: 'fintech-dashboard',
    technologies: ['React', 'Node.js', 'MongoDB'], likes: 234, views: 1520,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
    shortDescription: 'Modern financial analytics dashboard with real-time data visualization.'
  },
  {
    _id: '2', title: 'FoodieApp Mobile', category: 'mobile', client: 'FoodStartup', slug: 'foodie-app',
    technologies: ['React Native', 'Firebase'], likes: 189, views: 980,
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
    shortDescription: 'Cross-platform food delivery app with real-time tracking.'
  },
  {
    _id: '3', title: 'StyleBrand Identity', category: 'branding', client: 'StyleCo', slug: 'style-brand',
    technologies: ['Figma', 'Adobe XD', 'Illustrator'], likes: 312, views: 2100,
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
    shortDescription: 'Complete brand identity redesign with visual guidelines.'
  },
  {
    _id: '4', title: 'AI Chatbot Platform', category: 'ai', client: 'TechCorp', slug: 'ai-chatbot',
    technologies: ['Python', 'OpenAI', 'React'], likes: 445, views: 3200,
    coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600',
    shortDescription: 'Intelligent customer support chatbot powered by GPT-4.'
  },
  {
    _id: '5', title: 'SaaS Design System', category: 'ui-ux', client: 'SaaSCo', slug: 'saas-design',
    technologies: ['Figma', 'Storybook'], likes: 267, views: 1870,
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
    shortDescription: 'Comprehensive design system for enterprise SaaS platform.'
  },
  {
    _id: '6', title: 'E-Commerce Platform', category: 'web', client: 'ShopMax', slug: 'ecommerce-platform',
    technologies: ['Next.js', 'Stripe', 'MongoDB'], likes: 198, views: 1340,
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
    shortDescription: 'Full-featured e-commerce platform with payment gateway.'
  },
];

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [projects, setProjects] = useState(demoProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await portfolioAPI.getAll({ limit: 6 });
        if (data.data && data.data.length > 0) setProjects(data.data);
      } catch {
        // Use demo data
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 bg-dark-card relative overflow-hidden">
      <div className="orb orb-purple w-80 h-80 bottom-0 left-0 opacity-10 absolute" aria-hidden="true" />
      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="tag mb-4 mx-auto w-fit">Our Work</div>
          <h2 className="section-title text-white mb-5">
            Featured <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A showcase of our best work — from web apps to mobile experiences and brand identities.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 flex-wrap mb-10"
        >
          <Filter size={16} className="text-gray-500 mr-1" />
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-neon-blue'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-primary/30'
              }`}
            >
              {cat === 'ui-ux' ? 'UI/UX' : cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="portfolio-card group h-72"
              >
                <img
                  src={project.coverImage || `https://images.unsplash.com/photo-${1550000000000 + i * 1000}?w=600`}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { e.target.src = `https://picsum.photos/600/400?random=${i}`; }}
                />
                <div className="overlay" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
                  {/* Category */}
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20 mb-3 w-fit capitalize opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.category}
                  </span>

                  <h3 className="text-white font-bold text-xl mb-1 group-hover:text-gradient transition-all">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                    {project.shortDescription}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    {(project.technologies || []).slice(0, 3).map((tech) => (
                      <span key={tech} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center gap-3 text-gray-300 text-xs">
                      <span className="flex items-center gap-1"><Heart size={12} /> {project.likes}</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {project.views}</span>
                    </div>
                    <div className="flex gap-2">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                          <ExternalLink size={14} className="text-white" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                          <Github size={14} className="text-white" />
                        </a>
                      )}
                      <Link to={`/portfolio/${project.slug}`}
                        className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors">
                        <ArrowRight size={14} className="text-primary" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/portfolio" className="btn-outline px-8 py-3.5">
            View All Projects <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
