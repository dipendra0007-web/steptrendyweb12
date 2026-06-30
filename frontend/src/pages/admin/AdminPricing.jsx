import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ArrowLeft, X, Save, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { pricingAPI } from '../../utils/api';
import toast from 'react-hot-toast';

function PricingForm({ item, onSave, onCancel }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: item ? {
      ...item,
      features: item.features?.join(', ')
    } : { currency: 'INR', featured: false }
  });
  
  const onSubmit = async (data) => {
    data.features = data.features?.split(',').map(f => f.trim()).filter(Boolean) || [];
    try {
      if (item?._id) {
        await pricingAPI.update(item._id, data);
        toast.success('Pricing plan updated!');
      } else {
        await pricingAPI.create(data);
        toast.success('Pricing plan created!');
      }
      onSave();
    } catch {
      toast.error('Failed to save plan');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">{item ? 'Edit Pricing Plan' : 'Add Pricing Plan'}</h2>
          <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-lg"><X size={18} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Plan Name *</label>
            <input {...register('name', { required: true })} className="input-dark" placeholder="e.g. Premium Plan" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-gray-400 text-sm mb-1.5">Price *</label>
              <input {...register('price', { required: true })} className="input-dark" placeholder="e.g. 45,000 or Contact Us" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Currency</label>
              <select {...register('currency')} className="input-dark appearance-none">
                <option value="INR" className="bg-dark">INR (₹)</option>
                <option value="NPR" className="bg-dark">NPR (रू)</option>
                <option value="USD" className="bg-dark">USD ($)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Period</label>
              <input {...register('period')} className="input-dark" placeholder="e.g. month, project" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Card Color Accent</label>
              <input {...register('color')} className="input-dark" placeholder="e.g. #5B8CFF, #7C3AED" />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Tagline / Short description</label>
            <input {...register('tagline')} className="input-dark" placeholder="e.g. Best for growing startups" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Features (comma separated) *</label>
            <textarea {...register('features', { required: true })} className="input-dark resize-none" rows={3} placeholder="Figma designs, 5 pages React, Contact form, SEO" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer">
              <input type="checkbox" {...register('featured')} className="accent-primary" />
              Featured / Popular Plan
            </label>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Order</label>
              <input type="number" {...register('order')} className="input-dark py-2 w-20" placeholder="0" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center py-3">
              {isSubmitting ? <Loader size={16} className="animate-spin" /> : <><Save size={16} /> Save Plan</>}
            </button>
            <button type="button" onClick={onCancel} className="btn-outline px-6">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminPricing() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await pricingAPI.getAll();
      setItems(data.data || []);
    } catch {
      toast.error('Failed to load pricing plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this plan?')) return;
    try {
      await pricingAPI.remove(id);
      toast.success('Deleted');
      fetch();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const getCurrencySymbol = (cur) => {
    if (cur === 'NPR') return 'रू';
    if (cur === 'USD') return '$';
    return '₹';
  };

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="p-2 hover:bg-white/5 rounded-lg"><ArrowLeft size={18} className="text-gray-400" /></Link>
          <div>
            <h1 className="text-white font-bold text-2xl">Pricing Plans</h1>
            <p className="text-gray-400 text-sm">{items.length} plans available</p>
          </div>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm py-2.5">
          <Plus size={16} /> Add Plan
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader size={32} className="animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className={`glass-card p-6 flex flex-col justify-between relative ${item.featured ? 'border-primary/40 bg-primary/2' : ''}`}>
              {item.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] uppercase font-bold py-1 px-3 rounded-full">POPULAR</span>
              )}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white font-bold text-lg">{item.name}</h3>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-1.5 hover:bg-primary/10 rounded-lg text-gray-400 hover:text-primary"><Edit2 size={13} /></button>
                    <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={13} /></button>
                  </div>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-white">{getCurrencySymbol(item.currency)}</span>
                  <span className="text-4xl font-extrabold text-white">{item.price}</span>
                  {item.period && <span className="text-gray-500 text-xs">/{item.period}</span>}
                </div>
                {item.tagline && <p className="text-gray-400 text-xs mb-4">{item.tagline}</p>}
                <ul className="space-y-2 text-sm text-gray-400 border-t border-dark-border pt-4">
                  {item.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="text-[10px] text-gray-600 mt-6 block">Order: {item.order || 0} | Color: {item.color}</span>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-3 glass-card p-12 text-center"><p className="text-gray-400">No plans yet.</p></div>
          )}
        </div>
      )}

      {showForm && <PricingForm item={editing} onSave={() => { setShowForm(false); setEditing(null); fetch(); }} onCancel={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}
