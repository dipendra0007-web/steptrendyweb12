import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ArrowLeft, X, Save, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { techStackAPI } from '../../utils/api';
import toast from 'react-hot-toast';

function TechForm({ item, onSave, onCancel }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: item || {} });
  
  const onSubmit = async (data) => {
    try {
      if (item?._id) {
        await techStackAPI.update(item._id, data);
        toast.success('Tech item updated!');
      } else {
        await techStackAPI.create(data);
        toast.success('Tech item created!');
      }
      onSave();
    } catch {
      toast.error('Failed to save');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">{item ? 'Edit Tech Item' : 'Add Tech Item'}</h2>
          <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-lg"><X size={18} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Technology Name *</label>
            <input {...register('name', { required: true })} className="input-dark" placeholder="e.g. React.js" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Logo URL (svg/png) *</label>
            <input {...register('photo', { required: true })} className="input-dark" placeholder="https://..." />
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

export default function AdminTechStack() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await techStackAPI.getAll();
      setItems(data.data || []);
    } catch {
      toast.error('Failed to load tech stack');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this tech stack item?')) return;
    try {
      await techStackAPI.remove(id);
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
            <h1 className="text-white font-bold text-2xl">Tech Stack</h1>
            <p className="text-gray-400 text-sm">{items.length} technologies</p>
          </div>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm py-2.5">
          <Plus size={16} /> Add Tech
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader size={32} className="animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <div key={item._id} className="glass-card p-5 flex flex-col items-center justify-between relative group">
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-1 hover:bg-primary/10 rounded text-gray-400 hover:text-primary"><Edit2 size={12} /></button>
                <button onClick={() => handleDelete(item._id)} className="p-1 hover:bg-red-500/10 rounded text-gray-400 hover:text-red-400"><Trash2 size={12} /></button>
              </div>
              <div className="w-12 h-12 mb-3 flex items-center justify-center">
                <img src={item.photo} alt={item.name} className="max-w-full max-h-full object-contain" />
              </div>
              <span className="text-white font-medium text-sm text-center">{item.name}</span>
              <span className="text-[10px] text-gray-600 mt-1">Order: {item.order || 0}</span>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-6 glass-card p-12 text-center"><p className="text-gray-400">No tech items yet.</p></div>
          )}
        </div>
      )}

      {showForm && <TechForm item={editing} onSave={() => { setShowForm(false); setEditing(null); fetch(); }} onCancel={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}
