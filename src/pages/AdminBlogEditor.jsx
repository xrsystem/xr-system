import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function AdminBlogEditor() {
  const navigate = useNavigate();
  const [blog, setBlog] = useState({ title: '', excerpt: '', content: '', category: 'Tech', coverImage: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}`
        }
      });
      
      if(res.data.success) {
        setBlog({ ...blog, coverImage: res.data.secure_url });
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload fail ho gaya. Backend console check karo.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/blogs', blog, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}` }
      });
      navigate('/admin/blogs');
    } catch (err) { alert("Error saving blog"); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold">Drafting New Story</h2>
        <div className="flex gap-3">
          <button onClick={() => navigate('/admin/blogs')} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="bg-brand-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-bold hover:bg-brand-700 disabled:opacity-50">
            <Save size={18} /> {saving ? "Publishing..." : "Publish Now"}
          </button>
        </div>
      </div>

      <div className="space-y-8 mt-8">
        <input 
          type="text" 
          placeholder="Title of the story..." 
          className="w-full text-5xl font-display font-bold border-none outline-none placeholder:text-slate-200"
          value={blog.title}
          onChange={e => setBlog({...blog, title: e.target.value})}
        />

        <div className="flex flex-wrap gap-4 items-center">
          <input 
            type="text" 
            placeholder="Category (e.g. SEO, Web)" 
            className="bg-slate-100 px-4 py-2 rounded-xl text-sm outline-none border-none w-48"
            value={blog.category}
            onChange={e => setBlog({...blog, category: e.target.value})}
          />
          
          <div className="relative flex items-center">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploadingImage}
            />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 ${uploadingImage ? 'bg-slate-50 text-slate-400' : 'bg-white hover:bg-slate-50 text-slate-700'} transition-colors`}>
              {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
              {uploadingImage ? "Uploading..." : blog.coverImage ? "Change Cover" : "Upload Cover"}
            </div>
          </div>
          
          {blog.coverImage && (
             <img src={blog.coverImage} alt="Cover Preview" className="h-10 w-10 object-cover rounded-lg border border-slate-200 shadow-sm" />
          )}
        </div>

        <textarea 
          placeholder="Write a short teaser (Excerpt)..." 
          className="w-full text-xl text-slate-500 border-none outline-none resize-none h-20"
          value={blog.excerpt}
          onChange={e => setBlog({...blog, excerpt: e.target.value})}
        />

        <textarea 
          placeholder="Tell your story... (You can use HTML tags here)" 
          className="w-full text-lg leading-relaxed border-none outline-none min-h-100"
          value={blog.content}
          onChange={e => setBlog({...blog, content: e.target.value})}
        />
      </div>
    </div>
  );
}