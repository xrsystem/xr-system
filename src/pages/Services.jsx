import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Globe, Palette, ShoppingCart, Search, BarChart, Code, Lightbulb, ShieldCheck, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import axios from 'axios';

const iconMap = {
  Globe: Globe,
  Palette: Palette,
  ShoppingCart: ShoppingCart,
  Search: Search,
  BarChart: BarChart,
  Code: Code
};

const getSectionId = (title) => {
  const t = title.toLowerCase();
  if (t.includes('web development')) return 'web-development';
  if (t.includes('ui/ux') || t.includes('ui ux')) return 'ui-ux';
  if (t.includes('seo')) return 'seo';
  if (t.includes('e-commerce') || t.includes('ecommerce')) return 'ecommerce';
  if (t.includes('digital marketing')) return 'digital-marketing';
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveServices = async () => {
      try {
        const response = await axios.get('/api/services');
        if (response.data?.data?.services) {
          setServices(response.data.data.services);
        }
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveServices();
  }, []);

  return (
    <div className="pt-32 pb-24 px-6">
      <SEO 
        title="Services" 
        description="Detailed IT services including Web Development, UI/UX Design, SEO, and Digital Marketing in Ranchi." 
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl lg:text-7xl mb-8 font-display font-bold tracking-tight">Our <span className="text-brand-600">Expertise</span></h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            We offer a wide range of digital services to help your business thrive in the modern landscape.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 flex flex-col items-center justify-center">
             <Loader2 className="animate-spin text-brand-600 h-10 w-10 mb-4" />
             <p className="text-slate-500 font-medium">Loading our services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white p-12 rounded-4xl border border-slate-100 text-center shadow-sm max-w-2xl mx-auto">
             <h3 className="text-xl font-bold text-slate-900 mb-2">No services available</h3>
             <p className="text-slate-500">We are updating our service catalog. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-12">
            {services.map((service, i) => {
              const Icon = iconMap[service.iconName] || Globe;
              
              return (
                <motion.div
                  key={service._id}
                  id={getSectionId(service.title)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col lg:flex-row gap-12 p-10 lg:p-16 rounded-[3rem] bg-slate-50 border border-slate-100 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className="lg:w-1/2 space-y-8">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-brand-600 shadow-xl shadow-brand-600/10 mb-8">
                      <Icon size={40} />
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-display font-bold leading-tight tracking-tight">{service.title}</h2>
                    <p className="text-slate-600 text-lg leading-relaxed">{service.description}</p>
                    
                    <div className="grid sm:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-xs">
                          <Lightbulb size={16} className="text-brand-500" />
                          Key Features
                        </h4>
                        <ul className="space-y-3">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                              <div className="mt-1 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                <ShieldCheck size={12} className="text-emerald-600" />
                              </div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-xs">
                          <BarChart size={16} className="text-brand-500" />
                          Core Benefits
                        </h4>
                        <ul className="space-y-3">
                          {service.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                              <div className="mt-1 w-5 h-5 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                                <ShieldCheck size={12} className="text-brand-600" />
                              </div>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-1/2 w-full">
                    <div className="rounded-3xl overflow-hidden shadow-2xl aspect-video bg-slate-200">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}