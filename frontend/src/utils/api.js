import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

// Request interceptor - attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('steptrendy_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('steptrendy_token');
      localStorage.removeItem('steptrendy_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default API;

// API calls
export const portfolioAPI = {
  getAll: (params) => API.get('/portfolio', { params }),
  getOne: (slug) => API.get(`/portfolio/${slug}`),
  create: (data) => API.post('/portfolio', data),
  update: (id, data) => API.put(`/portfolio/${id}`, data),
  remove: (id) => API.delete(`/portfolio/${id}`),
  like: (id) => API.put(`/portfolio/${id}/like`),
};

export const blogAPI = {
  getAll: (params) => API.get('/blog', { params }),
  getOne: (slug) => API.get(`/blog/${slug}`),
  getCategories: () => API.get('/blog/categories'),
  create: (data) => API.post('/blog', data),
  update: (id, data) => API.put(`/blog/${id}`, data),
  remove: (id) => API.delete(`/blog/${id}`),
};

export const contactAPI = {
  submit: (data) => API.post('/contact', data),
  getAll: (params) => API.get('/contact', { params }),
  updateStatus: (id, status) => API.put(`/contact/${id}`, { status }),
  remove: (id) => API.delete(`/contact/${id}`),
};

export const testimonialAPI = {
  getAll: (params) => API.get('/testimonials', { params }),
  create: (data) => API.post('/testimonials', data),
  update: (id, data) => API.put(`/testimonials/${id}`, data),
  remove: (id) => API.delete(`/testimonials/${id}`),
};

export const careerAPI = {
  getJobs: () => API.get('/careers'),
  getJob: (id) => API.get(`/careers/${id}`),
  apply: (id, data) => API.post(`/careers/${id}/apply`, data),
  createJob: (data) => API.post('/careers', data),
  updateJob: (id, data) => API.put(`/careers/${id}`, data),
  deleteJob: (id) => API.delete(`/careers/${id}`),
  getApplications: () => API.get('/careers/applications'),
};

export const serviceAPI = {
  getAll: (params) => API.get('/services', { params }),
  create: (data) => API.post('/services', data),
  update: (id, data) => API.put(`/services/${id}`, data),
  remove: (id) => API.delete(`/services/${id}`),
};

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  upload: (formData) => API.post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  setup: () => API.post('/auth/setup'),
};

export const newsletterAPI = {
  subscribe: (email) => API.post('/newsletter/subscribe', { email }),
};

// Site settings
export const settingAPI = {
  get: () => API.get('/settings'),
  update: (data) => API.put('/settings', data),
};

// Generic sections API creator helper
const createSectionAPI = (path) => ({
  getAll: () => API.get(`/sections/${path}`),
  getOne: (id) => API.get(`/sections/${path}/${id}`),
  create: (data) => API.post(`/sections/${path}`, data),
  update: (id, data) => API.put(`/sections/${path}/${id}`, data),
  remove: (id) => API.delete(`/sections/${path}/${id}`),
});

export const faqAPI = createSectionAPI('faq');
export const pricingAPI = createSectionAPI('pricing');
export const timelineAPI = createSectionAPI('timeline');
export const techStackAPI = createSectionAPI('tech-stack');
export const processAPI = createSectionAPI('process');
export const teamAPI = createSectionAPI('team');
export const aboutAPI = createSectionAPI('about');
