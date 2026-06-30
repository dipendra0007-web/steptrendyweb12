import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import PageLoader from './components/common/PageLoader';
import CustomCursor from './components/common/CustomCursor';
import ScrollProgress from './components/common/ScrollProgress';
import ScrollToTop from './components/common/ScrollToTop';
import FloatingContact from './components/common/FloatingContact';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Careers = lazy(() => import('./pages/Careers'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const Team = lazy(() => import('./pages/Team'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPortfolio = lazy(() => import('./pages/admin/AdminPortfolio'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminCareers = lazy(() => import('./pages/admin/AdminCareers'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminAbout = lazy(() => import('./pages/admin/AdminAbout'));
const AdminTimeline = lazy(() => import('./pages/admin/AdminTimeline'));
const AdminTechStack = lazy(() => import('./pages/admin/AdminTechStack'));
const AdminProcess = lazy(() => import('./pages/admin/AdminProcess'));
const AdminPricing = lazy(() => import('./pages/admin/AdminPricing'));
const AdminFAQ = lazy(() => import('./pages/admin/AdminFAQ'));
const AdminTeam = lazy(() => import('./pages/admin/AdminTeam'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CustomCursor />
        <ScrollProgress />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f0f0f',
              color: '#fff',
              border: '1px solid rgba(91,140,255,0.2)',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#5B8CFF', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:slug" element={<ProjectDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/team" element={<Team />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/portfolio" element={<ProtectedRoute><AdminPortfolio /></ProtectedRoute>} />
            <Route path="/admin/blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
            <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
            <Route path="/admin/careers" element={<ProtectedRoute><AdminCareers /></ProtectedRoute>} />
            <Route path="/admin/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
            <Route path="/admin/about" element={<ProtectedRoute><AdminAbout /></ProtectedRoute>} />
            <Route path="/admin/timeline" element={<ProtectedRoute><AdminTimeline /></ProtectedRoute>} />
            <Route path="/admin/tech-stack" element={<ProtectedRoute><AdminTechStack /></ProtectedRoute>} />
            <Route path="/admin/process" element={<ProtectedRoute><AdminProcess /></ProtectedRoute>} />
            <Route path="/admin/pricing" element={<ProtectedRoute><AdminPricing /></ProtectedRoute>} />
            <Route path="/admin/faq" element={<ProtectedRoute><AdminFAQ /></ProtectedRoute>} />
            <Route path="/admin/team" element={<ProtectedRoute><AdminTeam /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <FloatingContact />
        <ScrollToTop />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
