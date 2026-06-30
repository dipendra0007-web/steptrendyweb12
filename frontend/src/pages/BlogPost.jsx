import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2 } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { blogAPI } from '../utils/api';
import toast from 'react-hot-toast';

const demoPost = {
  title: 'Web Design Trends Dominating 2024',
  category: 'Design', author: 'StepTrendy Team', readTime: 6,
  createdAt: new Date().toISOString(),
  coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200',
  content: `
## Introduction

The web design landscape continues to evolve at a rapid pace. In 2024, we're seeing a convergence of aesthetics and functionality that's pushing creative boundaries further than ever before.

## 1. Glassmorphism & Frosted Glass Effects

Glassmorphism has moved beyond a trend to become a design staple. The frosted glass effect creates depth and hierarchy in interfaces while maintaining a clean, modern look.

## 2. Dark Mode by Default

With the majority of users preferring dark interfaces, designing for dark mode first has become best practice. Dark themes reduce eye strain and save battery on OLED screens.

## 3. Micro-Animations

Subtle animations that respond to user actions create a sense of aliveness. From button hover effects to page transitions, micro-animations improve UX significantly.

## 4. AI-Generated Visuals

Brands are increasingly using AI tools to generate unique visual content, illustrations, and backgrounds that feel fresh and custom without the high cost of custom illustration.

## 5. Bento Grid Layouts

Inspired by Japanese bento boxes, this grid layout organizes content in unequal blocks of varying sizes, creating visual interest and clear information hierarchy.

## Conclusion

Staying ahead of design trends requires constant learning and experimentation. The key is to adopt trends that serve your users and brand, not just follow them blindly.
  `,
  tags: ['Web Design', 'UI/UX', 'Trends', '2024'],
};

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await blogAPI.getOne(slug);
        setPost(data.data);
      } catch { setPost({ ...demoPost, slug }); }
      finally { setLoading(false); }
    };
    fetch();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  if (loading) return (
    <div className="bg-dark min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!post) return null;

  return (
    <div className="bg-dark min-h-screen">
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <div className="relative h-[50vh] overflow-hidden">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="section-container pb-10">
              <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-5 text-sm">
                <ArrowLeft size={16} /> Back to Blog
              </Link>
              <span className="tag mb-3 inline-flex">{post.category}</span>
              <h1 className="text-3xl md:text-5xl font-bold font-display text-white leading-tight max-w-3xl">{post.title}</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="section-container py-12">
          <div className="max-w-3xl mx-auto">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400 mb-10 pb-8 border-b border-dark-border">
              <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} />{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime} min read</span>
              <button onClick={handleShare} className="ml-auto flex items-center gap-1.5 text-primary hover:text-accent transition-colors">
                <Share2 size={14} /> Share
              </button>
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-invert prose-lg max-w-none"
              style={{ color: '#9ca3af', lineHeight: 1.8 }}
            >
              {post.content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i} className="text-white font-bold text-2xl mt-10 mb-4 font-display">{line.slice(3)}</h2>;
                if (line.startsWith('# ')) return <h1 key={i} className="text-white font-bold text-3xl mt-10 mb-4 font-display">{line.slice(2)}</h1>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className="text-gray-400 mb-4 leading-relaxed">{line}</p>;
              })}
            </motion.div>

            {/* Tags */}
            {post.tags && (
              <div className="mt-12 pt-8 border-t border-dark-border">
                <div className="flex flex-wrap gap-2 items-center">
                  <Tag size={16} className="text-gray-500" />
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs bg-white/5 text-gray-400 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-12 p-8 rounded-2xl neon-border bg-gradient-to-br from-primary/5 to-secondary/5 text-center">
              <h3 className="text-white font-bold text-xl mb-2">Need help with your project?</h3>
              <p className="text-gray-400 mb-5">Let's build something amazing together.</p>
              <Link to="/contact" className="btn-primary px-8 py-3">Start Your Project →</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
