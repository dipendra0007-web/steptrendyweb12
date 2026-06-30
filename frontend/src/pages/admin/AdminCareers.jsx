import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Loader, MapPin, Clock, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { careerAPI } from '../../utils/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminCareers() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('jobs');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([careerAPI.getJobs(), careerAPI.getApplications()]);
      setJobs(jobsRes.data.data || []);
      setApplications(appsRes.data.data || []);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleDeleteJob = async (id) => {
    if (!confirm('Delete job?')) return;
    try { await careerAPI.deleteJob(id); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link to="/admin"><ArrowLeft size={18} className="text-gray-400" /></Link>
          <h1 className="text-white font-bold text-2xl">Careers</h1>
        </div>
        {tab === 'jobs' && <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm py-2.5"><Plus size={16} /> Add Job</button>}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[{ id: 'jobs', label: `Jobs (${jobs.length})` }, { id: 'applications', label: `Applications (${applications.length})` }].map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${tab === id ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}>{label}</button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader size={32} className="animate-spin text-primary" /></div> : tab === 'jobs' ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="glass-card p-6 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">{job.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${job.status === 'open' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{job.status}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{job.title}</h3>
                <p className="text-gray-400 text-sm">{job.department}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {job.experience}</span>
                  {job.salary && <span className="flex items-center gap-1"><DollarSign size={11} /> {job.salary}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(job); setShowForm(true); }} className="p-2 hover:bg-primary/10 rounded-lg text-gray-400 hover:text-primary"><Edit2 size={15} /></button>
                <button onClick={() => handleDeleteJob(job._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {jobs.length === 0 && <div className="glass-card p-12 text-center"><p className="text-gray-400">No jobs posted yet.</p></div>}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-dark-border">
              {['Applicant', 'Job', 'Email', 'Status', 'Date'].map(h => <th key={h} className="text-left text-xs text-gray-500 px-5 py-3.5">{h}</th>)}
            </tr></thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id} className="border-b border-dark-border/50 hover:bg-white/2">
                  <td className="px-5 py-4"><p className="text-white text-sm font-medium">{app.name}</p></td>
                  <td className="px-5 py-4"><p className="text-gray-400 text-sm">{app.job?.title || 'N/A'}</p></td>
                  <td className="px-5 py-4"><a href={`mailto:${app.email}`} className="text-primary text-sm hover:underline">{app.email}</a></td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize border ${
                      app.status === 'hired' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      app.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      app.status === 'shortlisted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>{app.status}</span>
                  </td>
                  <td className="px-5 py-4"><span className="text-gray-500 text-sm">{new Date(app.createdAt).toLocaleDateString()}</span></td>
                </tr>
              ))}
              {applications.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400">No applications yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
