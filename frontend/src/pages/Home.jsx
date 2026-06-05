import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Star, Zap, Shield, Heart, Trophy, Globe, Smartphone, Layout, Code, Database, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { adminService } from '../services/adminService';

const IconMap = {
  Globe: Globe,
  Smartphone: Smartphone,
  Layout: Layout,
  Code: Code,
  Database: Database,
  Search: Search,
};

export default function Home() {
  const [content, setContent] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, servicesRes] = await Promise.all([
          adminService.getContent(),
          adminService.getServices()
        ]);
        const websiteContent = contentRes.data.data.find((d) => d.id === 'website');
        setContent(websiteContent);
        setServices(servicesRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch home data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const hero = content?.homepage || {
    heroTitle: "Innovating the Future of Software",
    heroSubtitle: "We build high-performance web and mobile applications that drive growth and transform businesses. Your vision, our expertise.",
    ctaText: "Start Your Project"
  };

  const testimonials = content?.testimonials || [
    { name: 'Sarah Johnson', role: 'CEO, TechFlow', text: 'XR System transformed our legacy system into a modern, scalable platform. Their team is professional and highly skilled.' },
    { name: 'Michael Chen', role: 'Founder, GreenScale', text: 'The mobile app they developed for us has seen incredible user engagement. Their attention to detail in UI/UX is unmatched.' },
    { name: 'Emily Davis', role: 'Marketing Director, BrightPath', text: 'Our SEO rankings improved by 150% within six months of working with them. Truly a results-driven agency.' },
  ];

  return (
    <div className="flex flex-col">
      <SEO 
        title="Home" 
        description="XR System - Leading IT services company providing web development, mobile apps, and digital marketing." 
        keywords="IT services, software company, web development, mobile apps, UI/UX design"
      />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.1),transparent_50%)]" />
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              Leading IT Solutions Partner
            </div>
            <h1 className="text-6xl lg:text-8xl font-display font-bold leading-[1.1] mb-8 tracking-tight">
              {hero.heroTitle.split(' ').map((word, i) => 
                word.toLowerCase() === 'software' ? <span key={i} className="text-brand-600">{word} </span> : word + ' '
              )}
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-lg leading-relaxed font-light">
              {hero.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="bg-brand-600 text-white px-8 py-4 rounded-full font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/25 flex items-center gap-2"
              >
                {hero.ctaText}
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/portfolio"
                className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all"
              >
                View Portfolio
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://picsum.photos/seed/user${i}/100/100`}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex text-amber-400 mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-slate-500 font-medium">Trusted by 200+ companies</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-video lg:aspect-square">
              <img
                src="https://picsum.photos/seed/tech-office/1200/1200"
                alt="Modern Office"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 glass p-6 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-white font-bold">99.9% Client Satisfaction</p>
                    <p className="text-white/70 text-sm">Based on 500+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl mb-6">Our Core Services</h2>
            <p className="text-slate-600 text-lg">
              We provide a comprehensive suite of IT services tailored to your business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {services.slice(0, 3).map((service, i) => {
              const Icon = IconMap[service.icon] || Globe;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -15 }}
                  className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 group"
                >
                  <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-8 group-hover:scale-110 transition-transform">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4 tracking-tight">{service.title}</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed font-light">{service.description}</p>
                  <Link to="/services" className="text-brand-600 font-bold flex items-center gap-2 group/link">
                    Learn More
                    <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-5xl mb-8">Why Choose <span className="text-brand-600">XR System?</span></h2>
              <p className="text-slate-600 text-lg mb-12 leading-relaxed">
                We don't just build software; we build solutions that solve real business problems. Our approach combines technical excellence with strategic thinking.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { title: 'Fast Delivery', desc: 'We value your time and ensure projects are delivered on schedule.', icon: <Zap className="text-brand-500" /> },
                  { title: 'Secure Code', desc: 'Security is at the heart of our development process.', icon: <Shield className="text-brand-500" /> },
                  { title: 'Client Centric', desc: 'Your goals are our priority. We work as an extension of your team.', icon: <Heart className="text-brand-500" /> },
                  { title: 'Award Winning', desc: 'Recognized for excellence in design and development.', icon: <Trophy className="text-brand-500" /> },
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <h4 className="text-lg font-bold">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <img src="https://picsum.photos/seed/why1/400/600" alt="Work" className="rounded-3xl shadow-lg" referrerPolicy="no-referrer" />
                  <img src="https://picsum.photos/seed/why2/400/400" alt="Work" className="rounded-3xl shadow-lg" referrerPolicy="no-referrer" />
                </div>
                <div className="space-y-4">
                  <img src="https://picsum.photos/seed/why3/400/400" alt="Work" className="rounded-3xl shadow-lg" referrerPolicy="no-referrer" />
                  <img src="https://picsum.photos/seed/why4/400/600" alt="Work" className="rounded-3xl shadow-lg" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-5xl mb-6">What Our Clients Say</h2>
              <p className="text-slate-600 text-lg">
                Don't just take our word for it. Here's what our partners have to say about working with us.
              </p>
            </div>
            <Link to="/portfolio" className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all">
              View Case Studies
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 italic text-slate-700 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="flex text-amber-400 mb-8">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="mb-10 text-lg leading-relaxed font-light">"{t.text}"</p>
                <div className="flex items-center gap-4 not-italic">
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/client${i}/100/100`} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-brand-50" referrerPolicy="no-referrer" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center text-white border-2 border-white">
                      <Star size={10} fill="currentColor" />
                    </div>
                  </div>
                  <div>
                    <p className="font-display font-bold text-slate-900 text-lg tracking-tight">{t.name}</p>
                    <p className="text-xs text-brand-600 font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-slate-950 rounded-[4rem] p-12 lg:p-32 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.15),transparent_70%)]" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px]" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-5xl lg:text-7xl font-display font-bold mb-8 tracking-tight leading-tight">Ready to Build <br /> <span className="text-brand-500">Something Great?</span></h2>
            <p className="text-slate-400 text-xl lg:text-2xl mb-16 max-w-2xl mx-auto font-light leading-relaxed">
              Join 200+ companies that trust XR System for their digital transformation. Let's discuss your project today.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/contact" className="bg-brand-600 text-white px-12 py-6 rounded-full font-bold text-xl hover:bg-brand-700 transition-all shadow-2xl shadow-brand-600/30">
                {hero.ctaText}
              </Link>
              <Link to="/services" className="bg-white/5 text-white border border-white/10 backdrop-blur-md px-12 py-6 rounded-full font-bold text-xl hover:bg-white/10 transition-all">
                Explore Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}