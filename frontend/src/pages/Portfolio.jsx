import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Heart, ExternalLink, Github, ArrowRight, Filter, Search } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { portfolioAPI } from '../utils/api';

const categories = [
  { value: 'all', label: 'All Projects' },
  { value: 'web', label: 'Web' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'ui-ux', label: 'UI/UX' },
  { value: 'branding', label: 'Branding' },
  { value: 'ai', label: 'AI' },
];

const demoProjects = Array.from({ length: 12 }, (_, i) => ({
  _id: String(i + 1),
  title: ['FinTech Dashboard', 'FoodieApp', 'StyleBrand', 'AI Chatbot', 'SaaS System', 'E-Commerce', 'TravelApp', 'CRM Platform', 'EdTech Portal', 'HealthTrack', 'LogoDesign', 'MusicApp'][i],
  category: ['web', 'mobile', 'branding', 'ai', 'web', 'web', 'mobile', 'software', 'web', 'mobile', 'branding', 'mobile'][i],
  client: ['FinCorp', 'FoodieX', 'StyleCo', 'TechCorp', 'SaaSCo', 'ShopMax', 'TravelX', 'SalesCo', 'EduTech', 'HealthCo', 'BrandX', 'MusicCo'][i],
  slug: ['fintech-dashboard', 'foodie-app', 'style-brand', 'ai-chatbot', 'saas-system', 'ecommerce', 'travel-app', 'crm-platform', 'edtech-portal', 'health-track', 'logo-design', 'music-app'][i],
  technologies: [['React', 'Node.js'], ['Flutter', 'Firebase'], ['Figma', 'Adobe XD'], ['Python', 'OpenAI'], ['React', 'MongoDB'], ['Next.js', 'Stripe'], ['React Native'], ['Node.js', 'MongoDB'], ['React', 'Express'], ['Flutter'], ['Figma'], ['React Native']][i],
  likes: Math.floor(Math.random() * 400) + 50,
  views: Math.floor(Math.random() * 3000) + 500,
  coverImage: `https://picsum.photos/600/400?random=${i + 1}`,
  shortDescription: 'A premium digital project delivered with quality and precision for our valued client.',
}));

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState(demoProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await portfolioAPI.getAll({ limit: 50 });
        if (data.data && data.data.length > 0) setProjects(data.data);
      } catch { /* demo */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = projects.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-dark min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16 relative overflow-hidden">
          <div className="orb orb-blue w-80 h-80 top-0 right-0 opacity-10 absolute" />
          <div className="section-container text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="tag mb-4 mx-auto w-fit">Our Portfolio</div>
              <h1 className="section-title text-white mb-5">Our Best <span className="gradient-text">Work</span></h1>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">Explore our portfolio of 100+ projects across web, mobile, UI/UX, branding, and AI.</p>
            </motion.div>
          </div>
        </section>

        {/* Filters + Search */}
        <div className="section-container mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={16} className="text-gray-500" />
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.value ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 border border-white/10 hover:border-primary/30 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className="input-dark pl-9 py-2.5 text-sm w-64"
              />
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-3">{filtered.length} project{filtered.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Grid */}
        <div className="section-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchTerm}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((project, i) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="portfolio-card group h-72"
                >
                  <img src={project.coverImage} alt={project.title} className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.target.src = `https://picsum.photos/600/400?random=${i + 20}`; }} />
                  <div className="overlay" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20 mb-2 w-fit capitalize opacity-0 group-hover:opacity-100 transition-opacity">
                      {project.category}
                    </span>
                    <h3 className="text-white font-bold text-lg mb-1">{project.title}</h3>
                    <p className="text-gray-300 text-xs mb-3 opacity-0 group-hover:opacity-100 transition-opacity">Client: {project.client}</p>
                    <div className="flex flex-wrap gap-1 mb-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {(project.technologies || []).slice(0, 3).map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-3 text-gray-300 text-xs">
                        <span className="flex items-center gap-1"><Heart size={12} /> {project.likes}</span>
                        <span className="flex items-center gap-1"><Eye size={12} /> {project.views}</span>
                      </div>
                      <Link to={`/portfolio/${project.slug}`} className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors">
                        <ArrowRight size={14} className="text-primary" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
