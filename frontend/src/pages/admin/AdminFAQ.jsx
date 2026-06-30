import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ArrowLeft, X, Save, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { faqAPI } from '../../utils/api';
import toast from 'react-hot-toast';

function FAQForm({ item, onSave, onCancel }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: item || {} });
  
  const onSubmit = async (data) => {
    try {
      if (item?._id) {
        await faqAPI.update(item._id, data);
        toast.success('FAQ updated!');
      } else {
        await faqAPI.create(data);
        toast.success('FAQ created!');
      }
      onSave();
    } catch {
      toast.error('Failed to save FAQ');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">{item ? 'Edit FAQ' : 'Add FAQ'}</h2>
          <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-lg"><X size={18} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Question *</label>
            <input {...register('question', { required: true })} className="input-dark" placeholder="e.g. What is your development process?" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Answer *</label>
            <textarea {...register('answer', { required: true })} className="input-dark resize-none" rows={5} placeholder="Provide a detailed answer..." />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Display Order</label>
            <input type="number" {...register('order')} className="input-dark" placeholder="0" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center py-3">
              {isSubmitting ? <Loader size={16} className="animate-spin" /> : <><Save size={16} /> Save FAQ</>}
            </button>
            <button type="button" onClick={onCancel} className="btn-outline px-6">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminFAQ() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await faqAPI.getAll();
      setItems(data.data || []);
    } catch {
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this FAQ?')) return;
    try {
      await faqAPI.remove(id);
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
            <h1 className="text-white font-bold text-2xl">FAQs Manager</h1>
            <p className="text-gray-400 text-sm">{items.length} questions listed</p>
          </div>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm py-2.5">
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader size={32} className="animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="glass-card p-6 flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-white font-bold text-base mb-2">Q: {item.question}</h3>
                <p className="text-gray-400 text-sm whitespace-pre-line">A: {item.answer}</p>
                <span className="text-xs text-gray-600 mt-2 block">Order: {item.order || 0}</span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-2 hover:bg-primary/10 rounded-lg text-gray-400 hover:text-primary"><Edit2 size={15} /></button>
                <button onClick={() => handleDelete(item._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="glass-card p-12 text-center"><p className="text-gray-400">No FAQs yet.</p></div>
          )}
        </div>
      )}

      {showForm && <FAQForm item={editing} onSave={() => { setShowForm(false); setEditing(null); fetch(); }} onCancel={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}
