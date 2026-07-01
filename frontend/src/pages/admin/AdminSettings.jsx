import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { settingAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/common/ImageUpload';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [socials, setSocials] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  
  const { register, handleSubmit, setValue, watch } = useForm();

  const logo = watch('logo');
  const favicon = watch('favicon');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await settingAPI.get();
        const settings = data.data;
        if (settings) {
          setValue('websiteName', settings.websiteName);
          setValue('logo', settings.logo);
          setValue('favicon', settings.favicon);
          setValue('copyrightText', settings.copyrightText);
          setValue('whatsapp', settings.whatsapp);
          setValue('emails', settings.emails?.join(', ') || '');
          setValue('phoneNumbers', settings.phoneNumbers?.join(', ') || '');
          setValue('addresses', settings.addresses?.join(' | ') || '');
          
          setSocials(settings.socials || []);
          setWorkingHours(settings.workingHours || []);
        }
      } catch {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [setValue]);

  const addSocial = () => {
    setSocials([...socials, { name: '', icon: '', link: '' }]);
  };

  const removeSocial = (idx) => {
    setSocials(socials.filter((_, i) => i !== idx));
  };

  const handleSocialChange = (idx, field, value) => {
    const updated = [...socials];
    updated[idx][field] = value;
    setSocials(updated);
  };

  const addWorkingHour = () => {
    setWorkingHours([...workingHours, { days: '', time: '' }]);
  };

  const removeWorkingHour = (idx) => {
    setWorkingHours(workingHours.filter((_, i) => i !== idx));
  };

  const handleWorkingHourChange = (idx, field, value) => {
    const updated = [...workingHours];
    updated[idx][field] = value;
    setWorkingHours(updated);
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    
    // Parse fields
    const emails = data.emails?.split(',').map(e => e.trim()).filter(Boolean) || [];
    const phoneNumbers = data.phoneNumbers?.split(',').map(p => p.trim()).filter(Boolean) || [];
    const addresses = data.addresses?.split('|').map(a => a.trim()).filter(Boolean) || [];
    
    const payload = {
      websiteName: data.websiteName,
      logo: data.logo,
      favicon: data.favicon,
      copyrightText: data.copyrightText,
      whatsapp: data.whatsapp,
      emails,
      phoneNumbers,
      addresses,
      socials,
      workingHours
    };

    try {
      await settingAPI.update(payload);
      toast.success('Settings saved successfully!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/admin" className="p-2 hover:bg-white/5 rounded-lg"><ArrowLeft size={18} className="text-gray-400" /></Link>
        <div>
          <h1 className="text-white font-bold text-2xl">Website Settings</h1>
          <p className="text-gray-400 text-sm">Identity, Contact Info, Copyright & Socials</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader size={32} className="animate-spin text-primary" /></div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
          {/* Identity */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-white font-bold text-lg border-b border-dark-border pb-2">Website Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1.5">Website Name</label>
                <input {...register('websiteName')} className="input-dark" placeholder="StepTrendy Technologies" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1.5">Copyright Text</label>
                <input {...register('copyrightText')} className="input-dark" placeholder="© 2026 StepTrendy..." />
              </div>
              <div className="flex flex-col gap-2">
                <ImageUpload
                  value={logo}
                  onChange={(url) => setValue('logo', url)}
                  label="Logo"
                  aspect="square"
                />
              </div>
              <div className="flex flex-col gap-2">
                <ImageUpload
                  value={favicon}
                  onChange={(url) => setValue('favicon', url)}
                  label="Favicon"
                  aspect="square"
                />
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-white font-bold text-lg border-b border-dark-border pb-2">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1.5">Email Addresses (comma separated)</label>
                <input {...register('emails')} className="input-dark" placeholder="info@steptrendy.com, sales@..." />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1.5">Phone Numbers (comma separated)</label>
                <input {...register('phoneNumbers')} className="input-dark" placeholder="+977-98000000, +91-980000" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1.5">WhatsApp Number</label>
                <input {...register('whatsapp')} className="input-dark" placeholder="+977980000000" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1.5">Office Addresses (separated by |)</label>
                <input {...register('addresses')} className="input-dark" placeholder="Surat, India | Kathmandu, Nepal" />
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-dark-border pb-2">
              <h3 className="text-white font-bold text-lg">Working Hours</h3>
              <button type="button" onClick={addWorkingHour} className="btn-outline py-1 px-3 text-xs"><Plus size={12} /> Add Row</button>
            </div>
            <div className="space-y-3">
              {workingHours.map((wh, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input value={wh.days} onChange={(e) => handleWorkingHourChange(idx, 'days', e.target.value)} className="input-dark py-2" placeholder="e.g. Monday - Friday" />
                  <input value={wh.time} onChange={(e) => handleWorkingHourChange(idx, 'time', e.target.value)} className="input-dark py-2" placeholder="e.g. 9:00 AM - 6:00 PM" />
                  <button type="button" onClick={() => removeWorkingHour(idx)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={16} /></button>
                </div>
              ))}
              {workingHours.length === 0 && <p className="text-gray-500 text-sm">No working hours configured.</p>}
            </div>
          </div>

          {/* Socials */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-dark-border pb-2">
              <h3 className="text-white font-bold text-lg">Social Media Links</h3>
              <button type="button" onClick={addSocial} className="btn-outline py-1 px-3 text-xs"><Plus size={12} /> Add Link</button>
            </div>
            <div className="space-y-3">
              {socials.map((s, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center border-b border-dark-border/30 pb-3 sm:border-0 sm:pb-0">
                  <input value={s.name} onChange={(e) => handleSocialChange(idx, 'name', e.target.value)} className="input-dark py-2" placeholder="e.g. Facebook" />
                  <input value={s.icon} onChange={(e) => handleSocialChange(idx, 'icon', e.target.value)} className="input-dark py-2" placeholder="Lucide icon: Facebook, Twitter" />
                  <div className="flex gap-2 items-center">
                    <input value={s.link} onChange={(e) => handleSocialChange(idx, 'link', e.target.value)} className="input-dark py-2 flex-1" placeholder="https://..." />
                    <button type="button" onClick={() => removeSocial(idx)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {socials.length === 0 && <p className="text-gray-500 text-sm">No social media links configured.</p>}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={isSaving} className="btn-primary px-8 py-3">
              {isSaving ? <Loader size={16} className="animate-spin" /> : <><Save size={16} /> Save Settings</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
