import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

export default function AdminBlogEditor() {
  const navigate = useNavigate();
  const [blog, setBlog] = useState({ title: '', excerpt: '', content: '', category: 'Tech', coverImage: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/blogs', blog);
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

        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Category (e.g. SEO, Web)" 
            className="bg-slate-100 px-4 py-1 rounded-full text-sm outline-none border-none"
            value={blog.category}
            onChange={e => setBlog({...blog, category: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Cover Image URL" 
            className="flex-1 bg-slate-50 px-4 py-1 rounded-full text-sm outline-none border border-dashed border-slate-300"
            value={blog.coverImage}
            onChange={e => setBlog({...blog, coverImage: e.target.value})}
          />
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