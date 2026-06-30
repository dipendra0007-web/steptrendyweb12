import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { blogAPI } from '../../utils/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function BlogForm({ item, onSave, onCancel }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: item || { status: 'published' } });
  const onSubmit = async (data) => {
    data.tags = data.tags?.split(',').map(t => t.trim()).filter(Boolean) || [];
    try {
      if (item?._id) { await blogAPI.update(item._id, data); toast.success('Updated!'); }
      else { await blogAPI.create(data); toast.success('Created!'); }
      onSave();
    } catch { toast.error('Failed to save'); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl glass-card p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">{item ? 'Edit Post' : 'New Blog Post'}</h2>
          <button onClick={onCancel}><X size={18} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="block text-gray-400 text-sm mb-1.5">Title *</label><input {...register('title', { required: true })} className="input-dark" placeholder="Blog post title" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-gray-400 text-sm mb-1.5">Category *</label><input {...register('category', { required: true })} className="input-dark" placeholder="Design, Dev, AI..." /></div>
            <div><label className="block text-gray-400 text-sm mb-1.5">Author</label><input {...register('author')} className="input-dark" placeholder="StepTrendy Team" /></div>
          </div>
          <div><label className="block text-gray-400 text-sm mb-1.5">Cover Image URL</label><input {...register('coverImage')} className="input-dark" placeholder="https://..." /></div>
          <div><label className="block text-gray-400 text-sm mb-1.5">Excerpt *</label><textarea {...register('excerpt', { required: true })} className="input-dark resize-none" rows={2} placeholder="Short description..." /></div>
          <div><label className="block text-gray-400 text-sm mb-1.5">Content *</label><textarea {...register('content', { required: true })} className="input-dark resize-none font-mono text-sm" rows={10} placeholder="Full blog post content (supports ## headings, paragraphs)" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-gray-400 text-sm mb-1.5">Tags (comma separated)</label><input {...register('tags')} className="input-dark" placeholder="React, Web Dev" defaultValue={item?.tags?.join(', ')} /></div>
            <div><label className="block text-gray-400 text-sm mb-1.5">Status</label>
              <select {...register('status')} className="input-dark appearance-none">
                <option value="published" className="bg-dark">Published</option>
                <option value="draft" className="bg-dark">Draft</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center py-3">
              {isSubmitting ? <Loader size={16} className="animate-spin" /> : <><Save size={16} /> Save Post</>}
            </button>
            <button type="button" onClick={onCancel} className="btn-outline px-6">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try { const { data } = await blogAPI.getAll({ limit: 100, status: 'all' }); setPosts(data.data || []); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await blogAPI.remove(id); toast.success('Deleted'); fetchPosts(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link to="/admin"><ArrowLeft size={18} className="text-gray-400" /></Link>
          <div><h1 className="text-white font-bold text-2xl">Blog Manager</h1><p className="text-gray-400 text-sm">{posts.length} posts</p></div>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm py-2.5"><Plus size={16} /> New Post</button>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader size={32} className="animate-spin text-primary" /></div> :
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  {['Title', 'Category', 'Author', 'Status', 'Views', 'Actions'].map(h => (
                    <th key={h} className={`text-left text-xs text-gray-500 font-medium px-5 py-3.5 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} className="border-b border-dark-border/50 hover:bg-white/2">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {post.coverImage && <div className="w-10 h-8 rounded overflow-hidden flex-shrink-0 bg-dark-card"><img src={post.coverImage} alt="" className="w-full h-full object-cover" /></div>}
                        <p className="text-white text-sm font-medium line-clamp-1">{post.title}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className="text-gray-400 text-sm">{post.category}</span></td>
                    <td className="px-5 py-4"><span className="text-gray-400 text-sm">{post.author}</span></td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${post.status === 'published' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>{post.status}</span>
                    </td>
                    <td className="px-5 py-4"><span className="text-gray-400 text-sm">{post.views}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditing(post); setShowForm(true); }} className="p-1.5 hover:bg-primary/10 rounded-lg text-gray-400 hover:text-primary"><Edit2 size={15} /></button>
                        <button onClick={() => handleDelete(post._id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {posts.length === 0 && <div className="p-12 text-center"><p className="text-gray-400">No posts yet.</p></div>}
          </div>
        </div>
      }
      {showForm && <BlogForm item={editing} onSave={() => { setShowForm(false); setEditing(null); fetchPosts(); }} onCancel={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}
