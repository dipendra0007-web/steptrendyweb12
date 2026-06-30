import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Trash2, Loader, Eye, Save, Plus, Mail, Phone, MapPin, MessageSquare, Clock
} from 'lucide-react';
import { contactAPI, settingAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const statusColors = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  read: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  replied: 'bg-green-500/10 text-green-400 border-green-500/20',
  closed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function AdminMessages() {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  
  // Contact details settings state
  const [settings, setSettings] = useState(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [whatsapp, setWhatsapp] = useState('');
  const [workingHours, setWorkingHours] = useState([]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await contactAPI.getAll({ limit: 100 });
      setMessages(data.data || []);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await settingAPI.get();
      if (data.data) {
        setSettings(data.data);
        setEmails(data.data.emails || []);
        setPhones(data.data.phoneNumbers || []);
        setAddresses(data.data.addresses || []);
        setWhatsapp(data.data.whatsapp || '');
        setWorkingHours(data.data.workingHours || []);
      }
    } catch {
      toast.error('Failed to load contact settings');
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchSettings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await contactAPI.updateStatus(id, status);
      toast.success(`Marked as ${status}`);
      fetchMessages();
      if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await contactAPI.remove(id);
      toast.success('Message deleted');
      setSelected(null);
      fetchMessages();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleSaveContactDetails = async () => {
    setIsSavingSettings(true);
    try {
      const { _id, __v, createdAt, updatedAt, ...rest } = settings || {};
      const payload = {
        ...rest,
        emails,
        phoneNumbers: phones,
        addresses,
        whatsapp,
        workingHours
      };
      await settingAPI.update(payload);
      toast.success('Contact info saved successfully!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Helper arrays update functions
  const addEmail = () => setEmails([...emails, '']);
  const editEmail = (idx, val) => {
    const updated = [...emails];
    updated[idx] = val;
    setEmails(updated);
  };
  const removeEmail = (idx) => setEmails(emails.filter((_, i) => i !== idx));

  const addPhone = () => setPhones([...phones, '']);
  const editPhone = (idx, val) => {
    const updated = [...phones];
    updated[idx] = val;
    setPhones(updated);
  };
  const removePhone = (idx) => setPhones(phones.filter((_, i) => i !== idx));

  const addAddress = () => setAddresses([...addresses, '']);
  const editAddress = (idx, val) => {
    const updated = [...addresses];
    updated[idx] = val;
    setAddresses(updated);
  };
  const removeAddress = (idx) => setAddresses(addresses.filter((_, i) => i !== idx));

  const addWorkingHour = () => setWorkingHours([...workingHours, { days: '', time: '' }]);
  const editWorkingHour = (idx, field, val) => {
    const updated = [...workingHours];
    updated[idx][field] = val;
    setWorkingHours(updated);
  };
  const removeWorkingHour = (idx) => setWorkingHours(workingHours.filter((_, i) => i !== idx));

  return (
    <div className="min-h-screen bg-dark">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="p-2 hover:bg-white/5 rounded-lg"><ArrowLeft size={18} className="text-gray-400" /></Link>
          <div>
            <h1 className="text-white font-bold text-2xl">Contact Us Manager</h1>
            <p className="text-gray-400 text-sm">Manage contact info and public submissions</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-4 border-b border-dark-border mb-6">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'inquiries' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Inquiries ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Contact Info Details
          </button>
        </div>

        {activeTab === 'inquiries' ? (
          loading ? (
            <div className="flex justify-center py-20"><Loader size={32} className="animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Message List */}
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="glass-card p-12 text-center"><p className="text-gray-400">No inquiries yet.</p></div>
                ) : messages.map((msg) => (
                  <div
                    key={msg._id}
                    onClick={() => { setSelected(msg); if (msg.status === 'new') handleStatusUpdate(msg._id, 'read'); }}
                    className={`glass-card p-5 cursor-pointer transition-all hover:border-primary/20 ${selected?._id === msg._id ? 'border-primary/30' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-semibold text-sm">{msg.name}</p>
                          {msg.status === 'new' && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                        </div>
                        <p className="text-gray-400 text-xs mb-1">{msg.email}</p>
                        <p className="text-gray-500 text-xs line-clamp-1">{msg.projectDetails}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs border capitalize ${statusColors[msg.status]}`}>{msg.status}</span>
                        <span className="text-gray-600 text-xs">{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Detail */}
              <div className="sticky top-6">
                {selected ? (
                  <motion.div key={selected._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-white font-bold">{selected.name}</h3>
                      <button onClick={() => handleDelete(selected._id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
                    </div>
                    <div className="space-y-3 text-sm mb-5">
                      <div className="flex justify-between"><span className="text-gray-500">Email</span><a href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a></div>
                      {selected.phone && <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="text-white">{selected.phone}</span></div>}
                      {selected.company && <div className="flex justify-between"><span className="text-gray-500">Company</span><span className="text-white">{selected.company}</span></div>}
                      {selected.budget && <div className="flex justify-between"><span className="text-gray-500">Budget</span><span className="text-white">{selected.budget}</span></div>}
                      <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="text-white">{new Date(selected.createdAt).toLocaleString()}</span></div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/3 border border-white/5 mb-5">
                      <p className="text-gray-500 text-xs mb-2">Project Details:</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{selected.projectDetails}</p>
                    </div>
                    <div className="flex gap-2">
                      <a href={`mailto:${selected.email}?subject=Re: Your Inquiry - StepTrendy`} onClick={() => handleStatusUpdate(selected._id, 'replied')} className="btn-primary flex-1 text-sm text-center py-2.5 justify-center flex gap-1 font-semibold">Reply</a>
                      <button onClick={() => handleStatusUpdate(selected._id, 'closed')} className="btn-outline px-4 py-2.5 text-sm">Close</button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="glass-card p-12 text-center">
                    <Eye size={32} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Select a submission to view details</p>
                  </div>
                )}
              </div>
            </div>
          )
        ) : (
          <div className="glass-card p-8 space-y-6 max-w-3xl">
            {/* Emails */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="text-white font-semibold flex items-center gap-2"><Mail size={16} className="text-primary" /> Emails</h3>
                <button onClick={addEmail} className="btn-outline py-1 px-3 text-xs"><Plus size={12} /> Add Email</button>
              </div>
              <div className="space-y-2">
                {emails.map((e, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input value={e} onChange={(ev) => editEmail(idx, ev.target.value)} className="input-dark py-2 flex-1" placeholder="e.g. info@company.com" />
                    <button onClick={() => removeEmail(idx)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Phones */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="text-white font-semibold flex items-center gap-2"><Phone size={16} className="text-[#7C3AED]" /> Call Us Numbers</h3>
                <button onClick={addPhone} className="btn-outline py-1 px-3 text-xs"><Plus size={12} /> Add Phone</button>
              </div>
              <div className="space-y-2">
                {phones.map((p, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input value={p} onChange={(ev) => editPhone(idx, ev.target.value)} className="input-dark py-2 flex-1" placeholder="e.g. +977-9800000000" />
                    <button onClick={() => removePhone(idx)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Addresses */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="text-white font-semibold flex items-center gap-2"><MapPin size={16} className="text-[#00D4FF]" /> Locations (Visit Us)</h3>
                <button onClick={addAddress} className="btn-outline py-1 px-3 text-xs"><Plus size={12} /> Add Location</button>
              </div>
              <div className="space-y-2">
                {addresses.map((a, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input value={a} onChange={(ev) => editAddress(idx, ev.target.value)} className="input-dark py-2 flex-1" placeholder="e.g. Kathmandu, Nepal" />
                    <button onClick={() => removeAddress(idx)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold flex items-center gap-2 border-b border-white/5 pb-2">
                <MessageSquare size={16} className="text-green-400" /> WhatsApp Number
              </h3>
              <input value={whatsapp} onChange={(ev) => setWhatsapp(ev.target.value)} className="input-dark" placeholder="e.g. +9779800000000" />
            </div>

            {/* Working Hours */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="text-white font-semibold flex items-center gap-2"><Clock size={16} className="text-yellow-400" /> Working Hours</h3>
                <button onClick={addWorkingHour} className="btn-outline py-1 px-3 text-xs"><Plus size={12} /> Add Row</button>
              </div>
              <div className="space-y-2">
                {workingHours.map((wh, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input value={wh.days} onChange={(ev) => editWorkingHour(idx, 'days', ev.target.value)} className="input-dark py-2 flex-1" placeholder="e.g. Monday - Friday" />
                    <input value={wh.time} onChange={(ev) => editWorkingHour(idx, 'time', ev.target.value)} className="input-dark py-2 flex-1" placeholder="e.g. 9:00 AM - 6:00 PM" />
                    <button onClick={() => removeWorkingHour(idx)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Action */}
            <div className="flex justify-end pt-4 border-t border-dark-border">
              <button onClick={handleSaveContactDetails} disabled={isSavingSettings} className="btn-primary px-6 py-3">
                {isSavingSettings ? <Loader size={16} className="animate-spin" /> : <><Save size={16} /> Save Changes</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
