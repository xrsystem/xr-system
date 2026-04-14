import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);

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

  return (
    <div className="pt-32 pb-24 px-6">
      <SEO title="Blog | Digital Insights & Tech Trends - XR System" />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-display font-bold mb-4">Our Stories</h1>
        <p className="text-slate-500 text-xl mb-16">Insights on software, SEO, and growing businesses in Ranchi.</p>

        <div className="space-y-20">
          {blogs && blogs.length > 0 ? (
            blogs.map((post) => (
              <Link key={post._id} to={`/blog/${post.slug}`} className="group block">
                <div className="grid md:grid-cols-3 gap-8 items-start">
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 text-sm text-brand-600 font-bold uppercase tracking-widest">
                      <span>{post.category}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-3xl font-bold group-hover:text-brand-600 transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 leading-relaxed line-clamp-3 font-light text-lg">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs">XR</div>
                      <span className="text-sm font-medium text-slate-900">{post.author}</span>
                    </div>
                  </div>
                  <div className="aspect-video md:aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                    {post.coverImage && (
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500 text-lg">
              No stories published yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}