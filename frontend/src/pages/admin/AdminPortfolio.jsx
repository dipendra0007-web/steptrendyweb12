import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, ArrowLeft, X, Save, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { portfolioAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/common/ImageUpload';

const categories = ['web', 'mobile', 'ui-ux', 'branding', 'ai', 'software'];

function PortfolioForm({ item, onSave, onCancel }) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: item || {}
  });

  const coverImage = watch('coverImage');

  const onSubmit = async (data) => {
    data.technologies = data.technologies?.split(',').map(t => t.trim()).filter(Boolean) || [];
    try {
      if (item?._id) {
        await portfolioAPI.update(item._id, data);
        toast.success('Project updated!');
      } else {
        await portfolioAPI.create(data);
        toast.success('Project created!');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl glass-card p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">{item ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-lg"><X size={18} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-gray-400 text-sm mb-1.5">Project Title *</label>
              <input {...register('title', { required: true })} className="input-dark" placeholder="Project Title" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Category *</label>
              <select {...register('category', { required: true })} className="input-dark appearance-none">
                {categories.map(c => <option key={c} value={c} className="bg-dark capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Client *</label>
              <input {...register('client', { required: true })} className="input-dark" placeholder="Client Name" />
            </div>
            <div className="col-span-2">
              <ImageUpload
                value={coverImage}
                onChange={(url) => setValue('coverImage', url)}
                label="Cover Image *"
                aspect="video"
              />
              <input type="hidden" {...register('coverImage', { required: true })} />
              {errors.coverImage && <span className="text-xs text-rose-500 block mt-1">Cover image is required</span>}
            </div>
            <div className="col-span-2">
              <label className="block text-gray-400 text-sm mb-1.5">Short Description</label>
              <input {...register('shortDescription')} className="input-dark" placeholder="Brief one-line description" />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-400 text-sm mb-1.5">Full Description *</label>
              <textarea {...register('description', { required: true })} className="input-dark resize-none" rows={4} placeholder="Detailed project description..." />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Technologies (comma separated)</label>
              <input {...register('technologies')} className="input-dark" placeholder="React, Node.js, MongoDB" defaultValue={item?.technologies?.join(', ')} />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Duration</label>
              <input {...register('duration')} className="input-dark" placeholder="4 Weeks" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Live URL</label>
              <input {...register('liveUrl')} className="input-dark" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">GitHub URL</label>
              <input {...register('githubUrl')} className="input-dark" placeholder="https://github.com/..." />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer">
                <input type="checkbox" {...register('featured')} className="accent-primary" defaultChecked={item?.featured} />
                Featured Project
              </label>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Status</label>
              <select {...register('status')} className="input-dark appearance-none">
                <option value="published" className="bg-dark">Published</option>
                <option value="draft" className="bg-dark">Draft</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center py-3">
              {isSubmitting ? <Loader size={16} className="animate-spin" /> : <><Save size={16} /> Save Project</>}
            </button>
            <button type="button" onClick={onCancel} className="btn-outline px-6">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminPortfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await portfolioAPI.getAll({ limit: 100, status: 'all' });
      setProjects(data.data || []);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await portfolioAPI.remove(id);
      toast.success('Project deleted');
      fetchProjects();
    } catch { toast.error('Failed to delete'); }
  };

  const handleSave = () => { setShowForm(false); setEditing(null); fetchProjects(); };

  return (
    <div className="min-h-screen bg-dark">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 hover:bg-white/5 rounded-lg transition-colors"><ArrowLeft size={18} className="text-gray-400" /></Link>
            <div>
              <h1 className="text-white font-bold text-2xl">Portfolio Manager</h1>
              <p className="text-gray-400 text-sm">{projects.length} projects</p>
            </div>
          </div>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm py-2.5">
            <Plus size={16} /> Add Project
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader size={32} className="animate-spin text-primary" /></div>
        ) : projects.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-400 mb-4">No projects yet. Add your first project!</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">Add Project</button>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left text-xs text-gray-500 font-medium px-5 py-3.5">Project</th>
                    <th className="text-left text-xs text-gray-500 font-medium px-5 py-3.5">Category</th>
                    <th className="text-left text-xs text-gray-500 font-medium px-5 py-3.5">Client</th>
                    <th className="text-left text-xs text-gray-500 font-medium px-5 py-3.5">Status</th>
                    <th className="text-left text-xs text-gray-500 font-medium px-5 py-3.5">Views</th>
                    <th className="text-right text-xs text-gray-500 font-medium px-5 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id} className="border-b border-dark-border/50 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-dark-card">
                            <img src={project.coverImage} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{project.title}</p>
                            {project.featured && <span className="text-xs text-primary">Featured</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><span className="text-gray-400 text-sm capitalize">{project.category}</span></td>
                      <td className="px-5 py-4"><span className="text-gray-400 text-sm">{project.client}</span></td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${project.status === 'published' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-5 py-4"><span className="text-gray-400 text-sm">{project.views}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/portfolio/${project.slug}`} target="_blank" className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"><Eye size={15} /></Link>
                          <button onClick={() => { setEditing(project); setShowForm(true); }} className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors text-gray-400 hover:text-primary"><Edit2 size={15} /></button>
                          <button onClick={() => handleDelete(project._id)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showForm && <PortfolioForm item={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}
