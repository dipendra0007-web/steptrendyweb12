import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Search, Tag, ArrowRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { blogAPI } from '../utils/api';

const demoPosts = Array.from({ length: 9 }, (_, i) => ({
  _id: String(i + 1),
  title: ['Web Design Trends 2024', 'React Native vs Flutter', 'Building AI Apps', 'SEO Best Practices', 'UI/UX Principles', 'Node.js Performance', 'Mobile-First Design', 'DevOps for Startups', 'Brand Identity Guide'][i],
  slug: ['web-trends', 'react-native-flutter', 'building-ai', 'seo-2024', 'ux-principles', 'nodejs-perf', 'mobile-first', 'devops-startups', 'brand-guide'][i],
  category: ['Design', 'Development', 'AI', 'Marketing', 'Design', 'Development', 'Design', 'Development', 'Branding'][i],
  excerpt: 'Discover the latest trends and best practices that are shaping the digital landscape in 2024.',
  readTime: Math.floor(Math.random() * 8) + 4,
  author: 'StepTrendy Team',
  coverImage: `https://picsum.photos/600/400?random=${i + 30}`,
  createdAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
}));

const categoryColors = {
  Design: '#00D4FF', Development: '#5B8CFF', AI: '#7C3AED',
  Marketing: '#FF6B6B', Branding: '#FFD43B',
};

export default function Blog() {
  const [posts, setPosts] = useState(demoPosts);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState(['all', 'Design', 'Development', 'AI', 'Marketing', 'Branding']);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [postsRes] = await Promise.all([blogAPI.getAll({ limit: 50 })]);
        if (postsRes.data.data.length > 0) setPosts(postsRes.data.data);
      } catch { /* demo */ }
    };
    fetch();
  }, []);

  const filtered = posts.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-dark min-h-screen">
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-16 text-center relative overflow-hidden">
          <div className="orb orb-blue w-80 h-80 top-0 right-0 opacity-10 absolute" />
          <div className="section-container">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="tag mb-4 mx-auto w-fit">Blog</div>
              <h1 className="section-title text-white mb-4">Digital <span className="gradient-text">Insights</span></h1>
              <p className="text-gray-400 max-w-xl mx-auto">Tips, guides, and perspectives on web development, design, and digital marketing.</p>
            </motion.div>
          </div>
        </section>

        {/* Search + Filter */}
        <div className="section-container mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${activeCategory === cat ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 border border-white/10 hover:border-primary/30 hover:text-white'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..." className="input-dark pl-9 py-2.5 text-sm w-64" />
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="section-container pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => {
              const color = categoryColors[post.category] || '#5B8CFF';
              return (
                <motion.article key={post._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }} className="glass-card overflow-hidden group">
                  <Link to={`/blog/${post.slug}`} className="block relative h-52 overflow-hidden">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.src = `https://picsum.photos/600/300?random=${i + 40}`; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
                    <span className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>
                      <Tag size={10} /> {post.category}
                    </span>
                  </Link>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-gray-500 text-xs mb-3">
                      <span className="flex items-center gap-1"><Calendar size={11} />{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{post.readTime} min</span>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="text-white font-bold text-lg mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
                    </Link>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <Link to={`/blog/${post.slug}`} className="flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all">
                      Read More <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400">No articles found. Try a different search term.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
