import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';
import JoditEditor from 'jodit-react';

export default function AdminBlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [blog, setBlog] = useState({ title: '', excerpt: '', content: '', category: 'Tech', coverImage: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      axios.get('/api/blogs')
        .then(res => {
          const allBlogs = res.data?.data?.blogs || [];
          const foundBlog = allBlogs.find(b => b._id === id);
          if (foundBlog) {
            setBlog(foundBlog);
          }
        })
        .catch(err => console.error("Error fetching blog for edit:", err))
        .finally(() => setLoadingData(false));
    }
  }, [id, isEditMode]);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Tell your story...',
    height: 400,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_as_html',
    processPasteHTML: true,
    pastePlainHTML: false, 
    cleanHTML: false,
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|', 
      'ul', 'ol', '|', 'font', 'fontsize', 'brush', 'paragraph', '|', 
      'link', 'align', 'undo', 'redo', 'hr', 'eraser', 'fullsize'
    ],
    uploader: {
      insertImageAsBase64URI: true
    }
  }), []);

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
      console.error("Upload failed:", err);
      alert("Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!blog.title || !blog.content) {
      alert("Please add at least a title and content!");
      return;
    }
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}` };
      
      if (isEditMode) {
        await axios.put(`/api/blogs/${id}`, blog, { headers });
      } else {
        await axios.post('/api/blogs', blog, { headers });
      }
      
      navigate('/admin/blogs');
    } catch (err) { 
      alert("Error saving blog! Backend routing check karein."); 
    } finally { 
      setSaving(false); 
    }
  };

  if (loadingData) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600 w-10 h-10" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold">{isEditMode ? "Editing Story" : "Drafting New Story"}</h2>
        <div className="flex gap-3">
          <button onClick={() => navigate('/admin/blogs')} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="bg-brand-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-bold hover:bg-brand-700 disabled:opacity-50">
            <Save size={18} /> {saving ? "Saving..." : (isEditMode ? "Update Now" : "Publish Now")}
          </button>
        </div>
      </div>

      <div className="space-y-8 mt-8">
        <input 
          type="text" 
          placeholder="Title of the story..." 
          className="w-full text-5xl font-display font-bold border-none outline-none placeholder:text-slate-200 bg-transparent"
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
              {uploadingImage ? "Uploading..." : blog.coverImage ? "Change Cover Image" : "Upload Cover Image"}
            </div>
          </div>
          
          {blog.coverImage && (
             <img src={blog.coverImage} alt="Cover Preview" className="h-10 w-10 object-cover rounded-lg border border-slate-200 shadow-sm" />
          )}
        </div>

        <textarea 
          placeholder="Write a short teaser (Excerpt)..." 
          className="w-full text-xl text-slate-500 border-none outline-none resize-none h-20 bg-transparent"
          value={blog.excerpt}
          onChange={e => setBlog({...blog, excerpt: e.target.value})}
        />

        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 mb-12">
          <JoditEditor
            value={blog.content}
            config={config}
            onBlur={newContent => setBlog({...blog, content: newContent})}
          />
        </div>
      </div>
    </div>
  );
}