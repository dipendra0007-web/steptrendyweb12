import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ArrowLeft, X, Save, Loader, Mail, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { teamAPI } from '../../utils/api';
import toast from 'react-hot-toast';

function TeamForm({ item, onSave, onCancel }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: item ? {
      ...item,
      linkedIn: item.socialLinks?.find(s => s.name === 'LinkedIn')?.link || '',
      gitHub: item.socialLinks?.find(s => s.name === 'GitHub')?.link || ''
    } : {}
  });
  
  const onSubmit = async (data) => {
    const socialLinks = [];
    if (data.linkedIn) socialLinks.push({ name: 'LinkedIn', link: data.linkedIn });
    if (data.gitHub) socialLinks.push({ name: 'GitHub', link: data.gitHub });
    
    const payload = {
      name: data.name,
      role: data.role,
      email: data.email,
      phone: data.phone,
      photo: data.photo,
      order: data.order,
      socialLinks
    };
    
    try {
      if (item?._id) {
        await teamAPI.update(item._id, payload);
        toast.success('Team member updated!');
      } else {
        await teamAPI.create(payload);
        toast.success('Team member created!');
      }
      onSave();
    } catch {
      toast.error('Failed to save team member');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">{item ? 'Edit Team Member' : 'Add Team Member'}</h2>
          <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-lg"><X size={18} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Name *</label>
            <input {...register('name', { required: true })} className="input-dark" placeholder="e.g. Dipendra Upadhyay" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Role *</label>
            <input {...register('role', { required: true })} className="input-dark" placeholder="e.g. Founder & CEO" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Email</label>
              <input type="email" {...register('email')} className="input-dark" placeholder="name@company.com" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Phone Number</label>
              <input {...register('phone')} className="input-dark" placeholder="+977-98..." />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Photo URL</label>
            <input {...register('photo')} className="input-dark" placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">LinkedIn Profile Link</label>
              <input {...register('linkedIn')} className="input-dark" placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">GitHub Profile Link</label>
              <input {...register('gitHub')} className="input-dark" placeholder="https://github.com/..." />
            </div>
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

export default function AdminTeam() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await teamAPI.getAll();
      setItems(data.data || []);
    } catch {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this team member?')) return;
    try {
      await teamAPI.remove(id);
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
            <h1 className="text-white font-bold text-2xl">Our Team</h1>
            <p className="text-gray-400 text-sm">{items.length} members listed</p>
          </div>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm py-2.5">
          <Plus size={16} /> Add Team Member
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader size={32} className="animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item._id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-dark-card border border-white/10 flex-shrink-0">
                    <img src={item.photo || `https://ui-avatars.com/api/?name=${item.name}&background=5B8CFF&color=fff`} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-1.5 hover:bg-primary/10 rounded-lg text-gray-400 hover:text-primary"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg">{item.name}</h3>
                <p className="text-primary text-sm font-semibold mb-3">{item.role}</p>
                <div className="space-y-1.5 text-xs text-gray-400 mb-4">
                  {item.email && <p className="flex items-center gap-1.5"><Mail size={12} /> {item.email}</p>}
                  {item.phone && <p className="flex items-center gap-1.5"><Phone size={12} /> {item.phone}</p>}
                </div>
              </div>
              <div className="border-t border-dark-border pt-3 flex items-center justify-between text-xs text-gray-500">
                <div className="flex gap-2">
                  {item.socialLinks?.map((s, idx) => (
                    <a key={idx} href={s.link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors">{s.name}</a>
                  ))}
                </div>
                <span>Order: {item.order || 0}</span>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-3 glass-card p-12 text-center"><p className="text-gray-400">No team members yet.</p></div>
          )}
        </div>
      )}

      {showForm && <TeamForm item={editing} onSave={() => { setShowForm(false); setEditing(null); fetch(); }} onCancel={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}
