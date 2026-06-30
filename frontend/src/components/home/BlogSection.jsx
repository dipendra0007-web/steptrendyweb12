import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { blogAPI } from '../../utils/api';

const demoPosts = [
  {
    _id: '1', title: '10 Web Design Trends Dominating 2024', slug: 'web-design-trends-2024',
    category: 'Design', readTime: 5, author: 'StepTrendy Team',
    excerpt: 'Discover the latest web design trends from glassmorphism to AI-generated art that are shaping the digital landscape in 2024.',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
    createdAt: '2024-01-15',
  },
  {
    _id: '2', title: 'Why React Native is the Future of Mobile Development', slug: 'react-native-future',
    category: 'Development', readTime: 7, author: 'StepTrendy Team',
    excerpt: 'An in-depth look at why React Native continues to dominate cross-platform mobile development with its powerful ecosystem.',
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600',
    createdAt: '2024-01-08',
  },
  {
    _id: '3', title: 'Building AI-Powered Apps: A Complete Guide', slug: 'ai-powered-apps-guide',
    category: 'AI', readTime: 10, author: 'StepTrendy Team',
    excerpt: 'From ChatGPT integration to custom ML models — everything you need to know about building AI-first applications.',
    coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600',
    createdAt: '2024-01-01',
  },
];

const categoryColors = {
  Design: '#00D4FF', Development: '#5B8CFF', AI: '#7C3AED',
  Marketing: '#FF6B6B', Branding: '#FFD43B', Mobile: '#68A063',
};

export default function BlogSection() {
  const [posts, setPosts] = useState(demoPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await blogAPI.getAll({ limit: 3 });
        if (data.data && data.data.length > 0) setPosts(data.data);
      } catch { /* use demo */ }
    };
    fetchPosts();
  }, []);

  return (
    <section id="blog" className="py-24 bg-dark relative overflow-hidden">
      <div className="orb orb-blue w-80 h-80 top-0 right-0 opacity-10 absolute" aria-hidden="true" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <div className="tag mb-4 w-fit">Blog</div>
            <h2 className="section-title text-white">
              Latest <span className="gradient-text">Insights</span>
            </h2>
          </div>
          <Link to="/blog" className="btn-outline text-sm py-2.5 px-5 whitespace-nowrap">
            View All Articles <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => {
            const color = categoryColors[post.category] || '#5B8CFF';
            return (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass-card overflow-hidden group"
              >
                {/* Cover Image */}
                <Link to={`/blog/${post.slug}`} className="block relative h-52 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = `https://picsum.photos/600/300?random=${i + 10}`; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
                  <span
                    className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}
                  >
                    <Tag size={10} /> {post.category}
                  </span>
                </Link>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-gray-500 text-xs mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {post.readTime} min read
                    </span>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-white font-bold text-lg mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>

                  <Link to={`/blog/${post.slug}`} className="flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all">
                    Read Article <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
