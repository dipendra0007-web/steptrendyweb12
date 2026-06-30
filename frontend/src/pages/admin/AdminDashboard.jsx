import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, BookOpen, MessageSquare, Star, Briefcase,
  Settings, LogOut, Menu, X, Bell, BarChart3, Users, FileText, MessageCircle, Globe,
  Layers, Compass, Milestone, Award, Sliders, CreditCard, HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../utils/api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/services', label: 'Services', icon: Layers },
  { path: '/admin/portfolio', label: 'Portfolio', icon: FolderKanban },
  { path: '/admin/blog', label: 'Blog', icon: BookOpen },
  { path: '/admin/messages', label: 'Contact Us', icon: MessageSquare },
  { path: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { path: '/admin/careers', label: 'Careers', icon: Briefcase },
  { path: '/admin/about', label: 'About Us', icon: Compass },
  { path: '/admin/timeline', label: 'Journey', icon: Milestone },
  { path: '/admin/tech-stack', label: 'Tech Stack', icon: Award },
  { path: '/admin/process', label: 'Process', icon: Sliders },
  { path: '/admin/pricing', label: 'Pricing', icon: CreditCard },
  { path: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { path: '/admin/team', label: 'Team', icon: Users },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

const demoStats = {
  stats: { totalProjects: 24, totalBlogs: 18, totalMessages: 47, totalApplications: 12, totalTestimonials: 15, totalSubscribers: 230, newMessages: 5, newApplications: 3 },
  monthlyContacts: [
    { _id: { month: 1 }, count: 4 }, { _id: { month: 2 }, count: 7 },
    { _id: { month: 3 }, count: 5 }, { _id: { month: 4 }, count: 12 },
    { _id: { month: 5 }, count: 9 }, { _id: { month: 6 }, count: 15 },
  ],
  recentMessages: []
};

function Sidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-dark/80 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed left-0 top-0 h-full z-50 admin-sidebar flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-dark-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="StepTrendy" className="h-8 w-auto" />
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-white/5 rounded"><X size={18} className="text-gray-400" /></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                location.pathname === path
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-dark-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-gray-500 text-xs truncate">{user?.role}</p>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <Globe size={16} /> View Site
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

function StatCard({ icon: Icon, label, value, badge, color }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="glass-card p-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div className="flex-1">
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white font-bold text-2xl">{value}</p>
      </div>
      {badge > 0 && (
        <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30 font-medium">
          +{badge} new
        </span>
      )}
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(demoStats);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminAPI.getStats();
        setData(res.data.data);
      } catch { /* demo */ }
    };
    fetch();
  }, []);

  const chartData = data.monthlyContacts.map(d => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d._id.month - 1],
    contacts: d.count,
  }));

  const pieData = [
    { name: 'Projects', value: data.stats.totalProjects, color: '#5B8CFF' },
    { name: 'Blogs', value: data.stats.totalBlogs, color: '#7C3AED' },
    { name: 'Messages', value: data.stats.totalMessages, color: '#00D4FF' },
    { name: 'Subscribers', value: data.stats.totalSubscribers, color: '#22C55E' },
  ];

  const statCards = [
    { icon: FolderKanban, label: 'Total Projects', value: data.stats.totalProjects, color: '#5B8CFF' },
    { icon: FileText, label: 'Blog Posts', value: data.stats.totalBlogs, color: '#7C3AED' },
    { icon: MessageCircle, label: 'Messages', value: data.stats.totalMessages, badge: data.stats.newMessages, color: '#00D4FF' },
    { icon: Users, label: 'Subscribers', value: data.stats.totalSubscribers, color: '#22C55E' },
    { icon: Star, label: 'Testimonials', value: data.stats.totalTestimonials, color: '#FFD43B' },
    { icon: Briefcase, label: 'Applications', value: data.stats.totalApplications, badge: data.stats.newApplications, color: '#FF6B6B' },
  ];

  return (
    <div className="min-h-screen bg-dark flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-[260px] min-w-0">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-dark/90 backdrop-blur-md border-b border-dark-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-white/5 rounded-lg">
              <Menu size={20} className="text-gray-400" />
            </button>
            <div>
              <h1 className="text-white font-bold text-lg">Dashboard</h1>
              <p className="text-gray-500 text-xs">Welcome back! Here's what's happening.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {data.stats.newMessages > 0 && (
              <Link to="/admin/messages" className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Bell size={18} className="text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Link>
            )}
            <Link to="/" target="_blank" className="btn-outline text-xs py-1.5 px-3">View Site</Link>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {statCards.map((card) => <StatCard key={card.label} {...card} />)}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Area Chart */}
            <div className="lg:col-span-2 glass-card p-6">
              <h3 className="text-white font-bold text-lg mb-6">Monthly Inquiries</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="contactGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5B8CFF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#5B8CFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#555" tick={{ fill: '#888', fontSize: 12 }} />
                  <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '8px', color: '#fff' }} />
                  <Area type="monotone" dataKey="contacts" stroke="#5B8CFF" strokeWidth={2} fill="url(#contactGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="glass-card p-6">
              <h3 className="text-white font-bold text-lg mb-6">Content Overview</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map(({ name, color, value }) => (
                  <div key={name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                      <span className="text-gray-400">{name}</span>
                    </div>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h3 className="text-white font-bold text-lg mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              {navItems.slice(1).map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-primary/5 text-sm text-gray-300 hover:text-white transition-all">
                  <Icon size={16} /> {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
