import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Heart, Users, Award, Coffee, Twitter, Linkedin } from 'lucide-react';
import SEO from '../components/SEO';
import { adminService } from '../services/adminService';

export default function About() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await adminService.getContent();
        const websiteContent = res.data.data.find((d) => d.id === 'website');
        setContent(websiteContent);
      } catch (err) {
        console.error("Failed to fetch about content", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const about = content?.about || {
    description: "XR System is a leading IT services company dedicated to helping businesses thrive in the digital age. Based in Ranchi, we specialize in delivering cutting-edge technology solutions.",
    mission: "To deliver exceptional technology solutions that empower our clients and drive digital transformation.",
    vision: "To be the global leader in innovative software development and digital services."
  };

  const team = content?.team || [
    { name: 'JS Mahato', role: 'Founder & CEO', image: 'https://picsum.photos/seed/jsmahato/600/800' },
    { name: 'Monu Kumar Nayak', role: 'Co-Founder', image: 'https://picsum.photos/seed/monu/600/800' },
    { name: 'Priyanshu Kumar', role: 'CFO', image: 'https://picsum.photos/seed/priyanshu/600/800' },
  ];

  return (
    <div className="pt-32 pb-24 px-6">
      <SEO 
        title="About Us" 
        description="Learn about XR System, our mission, vision, and the expert team behind our software services." 
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-4xl mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl lg:text-8xl font-display font-bold leading-tight mb-8">
              We are <span className="text-brand-600">XR System</span>
            </h1>
            <p className="text-2xl text-slate-600 leading-relaxed font-light">
              {about.description}
            </p>
          </motion.div>
        </div>

        {/* Mission/Vision/Values */}
        <div className="grid lg:grid-cols-3 gap-12 mb-32">
          {[
            { title: 'Our Mission', icon: <Target className="text-brand-600" size={32} />, text: about.mission },
            { title: 'Our Vision', icon: <Eye className="text-brand-600" size={32} />, text: about.vision },
            { title: 'Our Values', icon: <Heart className="text-brand-600" size={32} />, text: 'Integrity, Excellence, Innovation, and Client-Centricity are at the core of everything we do.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-3xl bg-slate-50 border border-slate-100"
            >
              <div className="mb-6">{item.icon}</div>
              <h3 className="text-2xl mb-4">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {[
            { label: 'Founded', value: '2018', icon: <Award className="text-brand-500" size={24} /> },
            { label: 'Projects Done', value: '500+', icon: <Target className="text-brand-500" size={24} /> },
            { label: 'Team Members', value: '50+', icon: <Users className="text-brand-500" size={24} /> },
            { label: 'Coffee Cups', value: '10k+', icon: <Coffee className="text-brand-500" size={24} /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <div className="text-5xl font-display font-bold text-slate-900 mb-2 tracking-tight">{stat.value}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-5xl font-display font-bold mb-6 tracking-tight">Meet Our <span className="text-brand-600">Leadership</span></h2>
            <p className="text-slate-600 text-lg">The brilliant minds behind our success and your digital growth.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -15 }}
                className="group"
              >
                <div className="relative rounded-[2.5rem] overflow-hidden mb-8 aspect-3/4 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-600 transition-colors cursor-pointer">
                        <Twitter size={18} />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-600 transition-colors cursor-pointer">
                        <Linkedin size={18} />
                      </div>
                    </div>
                  </div>
                </div>
                <h4 className="text-2xl font-display font-bold mb-1 tracking-tight">{member.name}</h4>
                <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}