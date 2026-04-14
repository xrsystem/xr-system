import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import { BookOpen, TrendingUp, Code2, Sparkles } from 'lucide-react';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    axios.get('/api/blogs')
      .then(res => {
        if (res.data?.data?.blogs) {
          setBlogs(res.data.data.blogs);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const filteredBlogs = activeCategory === 'All' 
    ? blogs 
    : blogs.filter(blog => blog.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const categories = [
    { name: 'All', icon: <BookOpen size={16} /> },
    { name: 'Growth', icon: <TrendingUp size={16} /> },
    { name: 'Tech', icon: <Code2 size={16} /> }, 
    { name: 'Case Studies', icon: <Sparkles size={16} /> },
  ];

  return (
    <div className="pt-32 pb-24 px-6">
      <SEO title="Insights | XR System" />
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight text-slate-900">
            Resources & <span className="text-brand-600">Insights</span>
          </h1>
          <p className="text-slate-500 text-xl leading-relaxed">
            We don't just build software; we study what makes digital products succeed.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === cat.name 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        <div className="space-y-20">
          {filteredBlogs.map((post) => (
            <Link key={post._id} to={`/blog/${post.slug}`} className="group block">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-5 order-2 md:order-1">
                  
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                    <span className="text-brand-600 bg-brand-50 px-3 py-1 rounded-full">{post.category}</span>
                    <span className="text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <h2 className="text-3xl font-display font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 font-serifBody text-lg line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex items-center gap-3 pt-4">
                    {/* 🟢 FIX 2: Company Logo yahan add kiya hai */}
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm p-1.5">
                      <img src="/favicon.png" alt="XR System" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">XR System Team</div>
                      <div className="text-xs text-slate-500">Read Article →</div>
                    </div>
                  </div>

                </div>
                
                <div className="md:col-span-5 order-1 md:order-2 aspect-4/3 rounded-3xl overflow-hidden shadow-sm">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}