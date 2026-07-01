import { useState, useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function ImageUpload({ value, onChange, label = 'Image', aspect = 'video' }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    
    // Size check (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10MB limit.');
      return;
    }

    // Type check
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await adminAPI.upload(formData);
      if (data.success) {
        onChange(data.url);
        setUrlInput(data.url);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    onChange(urlInput);
    toast.success('Image URL set!');
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const aspectClasses = {
    square: 'aspect-square max-w-[180px] mx-auto',
    video: 'aspect-video w-full',
    wide: 'aspect-[21/9] w-full',
    auto: 'h-auto min-h-[150px] w-full'
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-gray-400 text-sm font-medium">{label}</label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-rose-400 hover:text-rose-300 transition flex items-center gap-1"
          >
            <X size={12} /> Remove
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {value ? (
          // Preview state
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative rounded-xl overflow-hidden border border-white/10 group ${aspectClasses[aspect] || 'aspect-video'}`}
          >
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary text-xs py-2 px-4"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold py-2 px-4 rounded-lg transition"
              >
                Remove
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </motion.div>
        ) : (
          // Upload Interface
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-4"
          >
            {/* Tabs */}
            <div className="flex border-b border-white/5 pb-2 gap-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('upload')}
                className={`pb-1 transition ${mode === 'upload' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-400'}`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setMode('url')}
                className={`pb-1 transition ${mode === 'url' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-400'}`}
              >
                Direct URL
              </button>
            </div>

            {mode === 'upload' ? (
              // Drag & Drop Box
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`relative border border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                  dragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-white/10 hover:border-white/20 hover:bg-white/[0.01]'
                } ${uploading ? 'pointer-events-none' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {uploading ? (
                  <div className="space-y-2 py-4">
                    <Loader2 className="animate-spin text-primary mx-auto" size={32} />
                    <p className="text-sm text-gray-400">Uploading to server...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-white/5 rounded-full inline-block text-gray-400">
                      <UploadCloud size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">Click to upload or drag & drop</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP, GIF, SVG (max. 10MB)</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // URL Paste
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/image.png"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="input-dark flex-1 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  className="btn-primary text-xs py-2.5 px-4"
                >
                  Apply
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
