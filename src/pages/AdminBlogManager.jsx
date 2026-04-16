import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function AdminBlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/api/blogs');
      if (res.data?.data?.blogs) {
        setBlogs(res.data.data.blogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      try {
        await axios.delete(`/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}` }
        });
        setBlogs(blogs.filter(blog => blog._id !== id));
      } catch (error) {
        alert("Delete failed! Please check backend.");
        console.error(error);
      }
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Blog Manager</h2>
        <Link to="/admin/blogs/new" className="bg-brand-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-brand-700 transition-colors w-full sm:w-auto">
          <Plus size={18} /> Write New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wider">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blogs.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">No stories found.</td></tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{blog.title}</td>
                    <td className="p-4 text-sm text-slate-600 font-medium">{blog.category}</td>
                    <td className="p-4 text-sm text-slate-500">{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Live">
                          <Eye size={18} />
                        </a>
                        <button onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(blog._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}