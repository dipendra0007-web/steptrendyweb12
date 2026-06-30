import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ArrowLeft, X, Save, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { serviceAPI } from '../../utils/api';
import toast from 'react-hot-toast';

function ServiceForm({ item, onSave, onCancel }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: item || { status: 'active', featured: false } });
  
  const onSubmit = async (data) => {
    try {
      if (item?._id) {
        await serviceAPI.update(item._id, data);
        toast.success('Service updated!');
      } else {
        await serviceAPI.create(data);
        toast.success('Service created!');
      }
      onSave();
    } catch {
      toast.error('Failed to save service');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">{item ? 'Edit Service' : 'Add Service'}</h2>
          <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-lg"><X size={18} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Service Title *</label>
            <input {...register('title', { required: true })} className="input-dark" placeholder="e.g. Web Development" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Category *</label>
            <input {...register('category', { required: true })} className="input-dark" placeholder="e.g. web, mobile, ui-ux" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Icon (Lucide Name) *</label>
            <input {...register('icon', { required: true })} className="input-dark" placeholder="e.g. Globe, Smartphone, Palette" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Short Description *</label>
            <input {...register('shortDescription', { required: true })} className="input-dark" placeholder="Brief tagline" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Full Details *</label>
            <textarea {...register('description', { required: true })} className="input-dark resize-none" rows={4} placeholder="Full details..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Price</label>
              <input {...register('price')} className="input-dark" placeholder="e.g. ₹45,000" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Duration</label>
              <input {...register('duration')} className="input-dark" placeholder="e.g. 4 Weeks" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer">
              <input type="checkbox" {...register('featured')} className="accent-primary" />
              Featured Service
            </label>
            <div>
              <select {...register('status')} className="input-dark py-2 px-3 text-sm appearance-none">
                <option value="active" className="bg-dark">Active</option>
                <option value="inactive" className="bg-dark">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center py-3">
              {isSubmitting ? <Loader size={16} className="animate-spin" /> : <><Save size={16} /> Save Service</>}
            </button>
            <button type="button" onClick={onCancel} className="btn-outline px-6">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminServices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await serviceAPI.getAll({ status: 'all' });
      setItems(data.data || []);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    try {
      await serviceAPI.remove(id);
      toast.success('Deleted');
      fetch();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="p-2 hover:bg-white/5 rounded-lg"><ArrowLeft size={18} className="text-gray-400" /></Link>
          <div>
            <h1 className="text-white font-bold text-2xl">Our Services</h1>
            <p className="text-gray-400 text-sm">{items.length} services available</p>
          </div>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm py-2.5">
          <Plus size={16} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader size={32} className="animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item._id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">{item.category}</span>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-1.5 hover:bg-primary/10 rounded-lg text-gray-400 hover:text-primary"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-gray-400 text-xs mb-3 font-mono">Icon: {item.icon}</p>
                <p className="text-gray-500 text-sm line-clamp-3">{item.description}</p>
              </div>
              <div className="border-t border-dark-border mt-4 pt-3 flex justify-between text-xs text-gray-400">
                <span>Price: {item.price || 'N/A'}</span>
                <span>Duration: {item.duration || 'N/A'}</span>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-3 glass-card p-12 text-center"><p className="text-gray-400">No services yet.</p></div>
          )}
        </div>
      )}

      {showForm && <ServiceForm item={editing} onSave={() => { setShowForm(false); setEditing(null); fetch(); }} onCancel={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}
