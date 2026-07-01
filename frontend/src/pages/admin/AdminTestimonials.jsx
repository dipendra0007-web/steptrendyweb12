import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Loader, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { testimonialAPI } from '../../utils/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/common/ImageUpload';

function TestimonialForm({ item, onSave, onCancel }) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({ defaultValues: item || { rating: 5 } });
  const avatar = watch('avatar');

  const onSubmit = async (data) => {
    data.rating = Number(data.rating);
    try {
      if (item?._id) { await testimonialAPI.update(item._id, data); toast.success('Updated!'); }
      else { await testimonialAPI.create(data); toast.success('Created!'); }
      onSave();
    } catch { toast.error('Failed to save'); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">{item ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
          <button onClick={onCancel}><X size={18} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="block text-gray-400 text-sm mb-1.5">Name *</label><input {...register('name', { required: true })} className="input-dark" placeholder="Client Name" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-gray-400 text-sm mb-1.5">Role</label><input {...register('role')} className="input-dark" placeholder="CEO" /></div>
            <div><label className="block text-gray-400 text-sm mb-1.5">Company</label><input {...register('company')} className="input-dark" placeholder="Company Name" /></div>
          </div>
          <div><label className="block text-gray-400 text-sm mb-1.5">Rating</label>
            <select {...register('rating')} className="input-dark appearance-none">
              {[5,4,3,2,1].map(r => <option key={r} value={r} className="bg-dark">{r} Stars</option>)}
            </select>
          </div>
          <div>
            <ImageUpload
              value={avatar}
              onChange={(url) => setValue('avatar', url)}
              label="Avatar"
              aspect="square"
            />
          </div>
          <div><label className="block text-gray-400 text-sm mb-1.5">Feedback *</label><textarea {...register('feedback', { required: true })} className="input-dark resize-none" rows={4} placeholder="Client feedback..." /></div>
          <div><label className="block text-gray-400 text-sm mb-1.5">Project Name</label><input {...register('project')} className="input-dark" placeholder="Project Name" /></div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center py-3">
              {isSubmitting ? <Loader size={16} className="animate-spin" /> : <><Save size={16} /> Save</>}
            </button>
            <button type="button" onClick={onCancel} className="btn-outline px-6">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try { const { data } = await testimonialAPI.getAll({ status: 'all' }); setItems(data.data || []); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await testimonialAPI.remove(id); toast.success('Deleted'); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link to="/admin"><ArrowLeft size={18} className="text-gray-400" /></Link>
          <div><h1 className="text-white font-bold text-2xl">Testimonials</h1><p className="text-gray-400 text-sm">{items.length} testimonials</p></div>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm py-2.5"><Plus size={16} /> Add Testimonial</button>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader size={32} className="animate-spin text-primary" /></div> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item._id} className="glass-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={item.avatar || `https://ui-avatars.com/api/?name=${item.name}&background=5B8CFF&color=fff`} alt={item.name}
                    className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-white font-semibold text-sm">{item.name}</p>
                    <p className="text-gray-400 text-xs">{item.role} at {item.company}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-1.5 hover:bg-primary/10 rounded-lg text-gray-400 hover:text-primary"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">{Array.from({ length: item.rating }).map((_, i) => <Star key={i} size={14} className="text-yellow-400" fill="currentColor" />)}</div>
              <p className="text-gray-400 text-sm line-clamp-3 italic">"{item.feedback}"</p>
              {item.project && <p className="text-primary text-xs mt-3">Project: {item.project}</p>}
            </div>
          ))}
          {items.length === 0 && <div className="col-span-3 glass-card p-12 text-center"><p className="text-gray-400">No testimonials yet.</p></div>}
        </div>
      }
      {showForm && <TestimonialForm item={editing} onSave={() => { setShowForm(false); setEditing(null); fetch(); }} onCancel={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}
