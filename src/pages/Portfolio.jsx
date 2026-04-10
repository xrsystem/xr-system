import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Loader2, Briefcase } from 'lucide-react';
import { cn } from '../lib/utils';
import SEO from '../components/SEO';
import axios from 'axios';

const categories = ['All', 'Web Development', 'UI/UX Design', 'SEO', 'Digital Marketing', 'E-commerce'];

export default function Portfolio() {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveProjects = async () => {
      try {
        const response = await axios.get('/api/portfolio');
        if (response.data?.data?.projects) {
          setProjects(response.data.data.projects);
        }
      } catch (error) {
        console.error("Failed to fetch active projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveProjects();
  }, []);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="pt-32 pb-24 px-6">
      <SEO 
        title="Portfolio" 
        description="Showcase of our successful projects in web development, SEO, digital marketing, and design in Ranchi." 
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <h1 className="text-5xl lg:text-7xl mb-8 font-display font-bold tracking-tight">Our <span className="text-brand-600">Work</span></h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Explore our latest projects and see how we&apos;ve helped businesses achieve their digital goals.
          </p>
        </div>

        <div className="relative -mx-6 px-6 md:mx-0 md:px-0 mb-12 md:mb-16">
          <div 
            className="flex md:flex-wrap md:justify-center gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "whitespace-nowrap shrink-0 snap-start px-6 py-2.5 rounded-full text-sm font-semibold transition-all",
                  filter === cat ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 flex flex-col items-center justify-center">
             <Loader2 className="animate-spin text-brand-600 h-10 w-10 mb-4" />
             <p className="text-slate-500 font-medium">Loading amazing projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white p-12 rounded-4xl border border-slate-100 text-center shadow-sm max-w-2xl mx-auto">
             <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-4" />
             <h3 className="text-xl font-bold text-slate-900 mb-2">No projects found</h3>
             <p className="text-slate-500">Check back later for exciting new work in this category!</p>
          </div>
        ) : (
          <motion.layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {filteredProjects.map((project) => {
                const techArray = typeof project.techStack === 'string' 
                  ? project.techStack.split(',').map(t => t.trim()).filter(Boolean)
                  : project.techStack || [];

                return (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group relative rounded-4xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col"
                  >
                    <div className="relative aspect-4/3 overflow-hidden shrink-0 bg-slate-100">
                      <img
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      
                      <div className="hidden lg:flex absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0">
                        <div className="space-y-3">
                          <div className="text-brand-400 text-xs font-bold uppercase tracking-widest">{project.category}</div>
                          <h3 className="text-white text-2xl font-display font-bold tracking-tight">{project.title}</h3>
                          <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed">{project.description}</p>
                          
                          <div className="flex flex-wrap gap-2 pt-2">
                            {techArray.map((tech, idx) => (
                              <span key={idx} className="text-[10px] bg-white/20 text-white px-2 py-1 rounded-md border border-white/10 backdrop-blur-sm font-bold">
                                {tech}
                              </span>
                            ))}
                          </div>

                          {project.liveLink && (
                            <div className="pt-4">
                              <a 
                                href={project.liveLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all shadow-xl"
                              >
                                <ExternalLink size={20} />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col p-6 lg:hidden">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-brand-600 text-[10px] font-bold uppercase tracking-widest mb-1">{project.category}</div>
                          <h3 className="text-slate-900 text-xl font-display font-bold tracking-tight">{project.title}</h3>
                        </div>
                        {project.liveLink && (
                          <a 
                            href={project.liveLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 shrink-0 rounded-full bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-brand-50 hover:text-brand-600 transition-all ml-4"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {techArray.map((tech, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-semibold">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.layout>
        )}
      </div>
    </div>
  );
}