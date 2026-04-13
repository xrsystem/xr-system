import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit, Loader2, Eye } from 'lucide-react';
import axios from 'axios';

export default function AdminBlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/api/blogs');
      setBlogs(res.data.data.blogs);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bhai, pakka delete karna hai?")) return;
    await axios.delete(`/api/blogs/${id}`);
    fetchBlogs();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Manager</h2>
        <Link to="/admin/blogs/new" className="bg-brand-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold hover:bg-brand-700">
          <Plus size={20} /> Write New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="4" className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-brand-600" /></td></tr>
            ) : blogs.map(blog => (
              <tr key={blog._id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-semibold">{blog.title}</td>
                <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{blog.category}</span></td>
                <td className="px-6 py-4 text-slate-500">{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link to={`/blog/${blog.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-brand-600 inline-block"><Eye size={18} /></Link>
                  <button onClick={() => handleDelete(blog._id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}