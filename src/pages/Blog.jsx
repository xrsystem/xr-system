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
        } else {
          setBlogs([]);
        }
      })
      .catch(err => {
        console.error("Error fetching blogs:", err);
        setBlogs([]);
      });
  }, []);

  const filteredBlogs = activeCategory === 'All' 
    ? blogs 
    : blogs.filter(blog => blog.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const categories = [
    { name: 'All', icon: <BookOpen size={16} /> },
    { name: 'Growth', icon: <TrendingUp size={16} /> },
    { name: 'Engineering', icon: <Code2 size={16} /> },
    { name: 'Case Studies', icon: <Sparkles size={16} /> },
  ];

  return (
    <div className="pt-32 pb-24 px-6">
      <SEO 
        title="Resources & Insights | XR System" 
        description="Discover expert perspectives on software engineering, digital marketing, and strategies to scale your business."
      />
      
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight text-slate-900">
            Resources & <span className="text-brand-600">Insights</span>
          </h1>
          <p className="text-slate-500 text-xl leading-relaxed">
            We don't just build software; we study what makes digital products succeed. 
            Here is our playbook on engineering, design, and business growth.
          </p>
        </div>

        {/*  Category Filters  */}
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

        {/*  Blog List */}
        <div className="space-y-20">
          {filteredBlogs && filteredBlogs.length > 0 ? (
            filteredBlogs.map((post) => (
              <Link key={post._id} to={`/blog/${post.slug}`} className="group block">
                <div className="grid md:grid-cols-12 gap-8 items-center">
                  
                  {/* Text Content */}
                  <div className="md:col-span-7 space-y-5 order-2 md:order-1">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                      <span className="text-brand-600 bg-brand-50 px-3 py-1 rounded-full">{post.category}</span>
                      <span className="text-slate-400">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    
                    <h2 className="text-3xl font-display font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-tight">
                      {post.title}
                    </h2>
                    
                    <p className="text-slate-600 leading-relaxed font-serifBody text-lg line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-3 pt-4">
                      <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">XR</div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">XR System Team</div>
                        <div className="text-xs text-slate-500 font-medium">Read Article →</div>
                      </div>
                    </div>
                  </div>

                  {/* Image Content */}
                  <div className="md:col-span-5 order-1 md:order-2">
                    <div className="aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center bg-brand-50 text-brand-200">
                           <Code2 size={48} />
                         </div>
                      )}
                    </div>
                  </div>

                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">No insights found</h3>
              <p className="text-slate-500">We are currently cooking up some great content for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}