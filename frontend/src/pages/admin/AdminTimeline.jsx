import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ArrowLeft, X, Save, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { timelineAPI } from '../../utils/api';
import toast from 'react-hot-toast';

function TimelineForm({ item, onSave, onCancel }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: item || {} });
  
  const onSubmit = async (data) => {
    try {
      if (item?._id) {
        await timelineAPI.update(item._id, data);
        toast.success('Timeline item updated!');
      } else {
        await timelineAPI.create(data);
        toast.success('Timeline item created!');
      }
      onSave();
    } catch {
      toast.error('Failed to save');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">{item ? 'Edit Timeline Item' : 'Add Timeline Item'}</h2>
          <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-lg"><X size={18} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Year *</label>
            <input {...register('year', { required: true })} className="input-dark" placeholder="e.g. 2026" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Title/Milestone *</label>
            <input {...register('title', { required: true })} className="input-dark" placeholder="e.g. Rebranding and Expansion" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Description *</label>
            <textarea {...register('desc', { required: true })} className="input-dark resize-none" rows={4} placeholder="Describe the milestone..." />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Display Order</label>
            <input type="number" {...register('order')} className="input-dark" placeholder="0" />
          </div>
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

export default function AdminTimeline() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await timelineAPI.getAll();
      setItems(data.data || []);
    } catch {
      toast.error('Failed to load timeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this timeline item?')) return;
    try {
      await timelineAPI.remove(id);
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
            <h1 className="text-white font-bold text-2xl">Our Journey (Timeline)</h1>
            <p className="text-gray-400 text-sm">{items.length} milestones</p>
          </div>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm py-2.5">
          <Plus size={16} /> Add Milestone
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader size={32} className="animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="glass-card p-6 flex justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-primary font-bold text-lg font-display">{item.year}</span>
                  <h3 className="text-white font-bold text-base">{item.title}</h3>
                </div>
                <p className="text-gray-400 text-sm">{item.desc}</p>
                <span className="text-xs text-gray-600 mt-2 block">Order: {item.order || 0}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-2 hover:bg-primary/10 rounded-lg text-gray-400 hover:text-primary"><Edit2 size={15} /></button>
                <button onClick={() => handleDelete(item._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="glass-card p-12 text-center"><p className="text-gray-400">No milestones yet.</p></div>
          )}
        </div>
      )}

      {showForm && <TimelineForm item={editing} onSave={() => { setShowForm(false); setEditing(null); fetch(); }} onCancel={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}
