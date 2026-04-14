import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/blogs')
      .then(res => {
        const foundPost = res.data.data.blogs.find(b => b.slug === slug);
        setPost(foundPost);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-600 w-10 h-10" /></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold">Post not found :(</div>;

  return (
    <article className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
      <SEO 
        title={`${post.title} | XR System`} 
        description={post.excerpt} 
      />

      <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 font-medium mb-8 transition-colors">
        <ArrowLeft size={18} /> Back to stories
      </Link>

      <div className="flex items-center gap-3 text-sm text-brand-600 font-bold uppercase tracking-widest mb-6">
        <span>{post.category}</span>
        <span className="text-slate-300">•</span>
        <span className="text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-8">
        {post.title}
      </h1>

      {post.coverImage && (
        <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12 bg-slate-100">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div 
        className="prose prose-lg max-w-none 
                   prose-headings:font-serif-heading prose-headings:font-bold prose-headings:tracking-tight 
                   prose-p:font-serif-body prose-p:leading-relaxed prose-p:text-slate-700
                   prose-a:text-brand-600 prose-blockquote:border-l-brand-600 prose-blockquote:font-serif-body prose-blockquote:italic
                   prose-li:font-serif-body mt-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}