import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Eye, Heart, Award, Code, X, Briefcase, User } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';

export default function About() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    axios.get('/api/site-settings')
      .then(res => {
        if (res.data && res.data.settings) {
          setSiteSettings(res.data.settings);
        }
      })
      .catch(err => console.error("Error fetching settings:", err));
  }, []);

  const team = [
    { 
      id: 'js-mahato',
      name: 'JS Mahato', 
      role: 'Founder & CEO', 
      image: siteSettings?.team?.jsMahato || 'https://picsum.photos/seed/jsmahato/600/800', 
      bio: 'JS Mahato is a passionate developer and entrepreneur with a background in Information Technology. He founded XR System with the vision of helping businesses build a strong online presence through modern and affordable digital solutions. He focuses on web development, business strategy, and creating scalable digital products that deliver real results.',
      experience: 'Hands-on experience in Full Stack Web Development (MERN Stack) with real-world projects and startup-based solutions.',
      skills: ['Strategic Planning', 'Business Development', 'Tech Innovation']
    },
    { 
      id: 'monu-nayak',
      name: 'Suryanshu Kumar Nayak', 
      role: 'COO', 
      image: siteSettings?.team?.monuNayak || 'https://picsum.photos/seed/monu/600/800', 
      bio: 'Suryanshu Kumar Nayak oversees the overall operations and execution at XR System. He ensures that projects are delivered efficiently, timelines are maintained, and team coordination runs smoothly. His focus is on optimizing workflows, improving productivity, and maintaining high-quality service delivery for clients.',
      experience: 'Practical experience in operations management, team coordination, and project execution in a startup environment.',
      skills: ['Operations Management', 'Client Relations', 'Project Management']
    },
    { 
      id: 'chandi-charan-sahu',
      name: 'Chandi Charan Sahu', 
      role: 'CTO', 
      image: siteSettings?.team?.chandiSahu || 'https://picsum.photos/seed/chandi/600/800', 
      bio: 'Chandi Charan Sahu leads the technical development at XR System. With strong knowledge of modern web technologies, he focuses on building responsive, secure, and scalable web applications tailored to client needs.',
      experience: 'Hands-on experience in full-stack development using modern technologies with a focus on scalable web applications.',
      skills: ['System Architecture', 'Full-Stack Development', 'Tech Strategy']
    },
    { 
      id: 'priyanshu-gupta',
      name: 'Priyanshu Gupta', 
      role: 'CFO', 
      image: siteSettings?.team?.priyanshuGupta || 'https://picsum.photos/seed/priyanshu/600/800', 
      bio: 'Priyanshu Gupta manages financial planning and operational support at XR System. He ensures smooth financial processes and supports the team in maintaining efficient workflows and project execution.',
      experience: 'Experience in financial planning and operational coordination for startup-level execution.',
      skills: ['Financial Planning', 'Risk Management', 'Investment Strategy']
    },
  ];

  return (
    <div className="pt-32 pb-24 px-6">
      <SEO 
        title="About Us" 
        description="Learn about XR System, our mission, vision, and the expert team behind our software services in Ranchi." 
      />
      <div className="max-w-7xl mx-auto">
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
              XR System is a modern IT agency based in Lalpur, Ranchi. we specialize in delivering high-conversion websites and digital solutions that help businesses thrive in the digital age.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 mb-32">
          {[
            { title: 'Our Mission', icon: <Target className="text-brand-600" size={32} />, text: 'To deliver exceptional technology solutions that empower our clients and drive digital transformation.' },
            { title: 'Our Vision', icon: <Eye className="text-brand-600" size={32} />, text: 'To build powerful digital solutions that help businesses grow faster and stand out in the online world.' },
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
          {[
            { label: 'Modern Tech Stack', value: 'Expertise', icon: <Code className="text-brand-500" size={24} />, desc: 'We use the latest technologies like React, Node.js, and Tailwind CSS.' },
            { label: 'Client-Focused', value: 'Approach', icon: <Target className="text-brand-500" size={24} />, desc: 'Your business goals are our top priority in every project.' },
            { label: 'Realistic', value: 'Positioning', icon: <Award className="text-brand-500" size={24} />, desc: 'We provide honest advice and deliver what we promise.' },
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
              <div className="text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">{stat.value}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mb-4">{stat.label}</div>
              <p className="text-slate-500 text-sm">{stat.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-5xl font-display font-bold mb-6 tracking-tight">Meet Our <span className="text-brand-600">Leadership</span></h2>
            <p className="text-slate-600 text-lg">The dedicated team behind XR System.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -15 }}
                className="group cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                <div className="relative rounded-[2.5rem] overflow-hidden mb-8 aspect-3/4 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-brand-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-brand-600 px-6 py-2 rounded-full font-bold text-sm shadow-xl">View Profile</span>
                  </div>
                </div>
                <h4 className="text-xl font-display font-bold mb-1 tracking-tight">{member.name}</h4>
                <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">{member.role}</p>
                <p className="text-slate-500 text-sm line-clamp-2">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row z-101 max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-110 p-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-full transition-colors shadow-lg"
              >
                <X size={20} />
              </button>

              <div className="md:w-2/5 h-72 md:h-auto shrink-0 relative bg-slate-100">
                <img src={selectedMember.image} alt={selectedMember.name} className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
              </div>

              <div className="md:w-3/5 p-6 sm:p-8 md:p-10 lg:p-16 overflow-y-auto flex-1">
                <div className="mb-8 pr-8">
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">{selectedMember.name}</h2>
                  <p className="text-brand-600 font-bold uppercase tracking-[0.2em] text-xs md:text-sm">{selectedMember.role}</p>
                </div>

                <div className="space-y-6 md:space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">About</h4>
                      <p className="text-slate-600 leading-relaxed text-sm md:text-base">{selectedMember.bio}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Experience</h4>
                      <p className="text-slate-600 text-sm md:text-base">{selectedMember.experience}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-4">Key Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 text-slate-600 rounded-xl text-xs md:text-sm font-medium border border-slate-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}