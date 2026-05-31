import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Zap, Shield, Heart, Trophy, Layout, Code, Search, Rocket, Check, ShoppingCart, ChevronLeft, ChevronRight, Loader2, Image as ImageIcon, Users, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Helmet } from 'react-helmet-async'; 
import axios from 'axios'; 
import SEO from '../components/SEO';

export default function Home() {
  const scrollRef = useRef(null);
  
  const [siteSettings, setSiteSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/site-settings')
      .then(res => {
        if (res.data && res.data.settings) {
          setSiteSettings(res.data.settings);
        }
      })
      .catch(err => console.error("Error fetching settings:", err))
      .finally(() => {
        setIsLoading(false); 
      });
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  const testimonials = [
    { 
      name: 'JS Mahato', 
      role: 'Founder, XR System', 
      image: siteSettings?.team?.jsMahato || null,
      text: 'We are committed to delivering high-quality digital solutions that drive real business growth for our clients in Ranchi and beyond.' 
    },
    { 
      name: 'Suryanshu Kumar Nayak', 
      role: 'COO, XR System', 
      image: siteSettings?.team?.monuNayak || null,
      text: 'We believe in building long-term relationships with our clients by providing exceptional support and innovative technology.' 
    },
    { 
      name: 'Chandi Charan Sahu', 
      role: 'CTO, XR System', 
      image: siteSettings?.team?.chandiSahu || null,
      text: 'Our technical vision is built on scalable architecture, ensuring we deliver robust, secure, and future-proof software to all our clients.' 
    },
    { 
      name: 'Priyanshu Gupta', 
      role: 'CFO, XR System', 
      image: siteSettings?.team?.priyanshuGupta || null,
      text: 'Our focus on affordability and quality makes us the preferred choice for businesses looking to establish a strong online presence.' 
    },
  ];

  const services = [
    {
      id: 'web-development',
      title: "Web Development",
      description: "Business Websites That Generate Leads. We build fast, responsive, and SEO-friendly websites tailored to your business goals.",
      icon: Code,
    },
    {
      id: 'ui-ux',
      title: "UI/UX Design",
      description: "User-Centric Interfaces. We design intuitive and visually appealing interfaces that provide a seamless user experience.",
      icon: Layout,
    },
    {
      id: 'seo',
      title: "SEO Services",
      description: "Get Found on Google. Our SEO strategies help your business rank higher and attract more customers organically.",
      icon: Search,
    },
    {
      id: 'digital-marketing',
      title: "Digital Marketing",
      description: "Data-driven marketing strategies to grow your online presence. From social media management to paid advertising.",
      icon: Zap,
    },
    {
      id: 'ecommerce',
      title: "E-Commerce Solutions",
      description: "Complete e-commerce setups to help you sell online. From product management to secure payment integration.",
      icon: ShoppingCart,
    },
  ];

  const steps = [
    { number: '01', title: 'Share Requirement', desc: 'Tell us about your business goals and project needs.' },
    { number: '02', title: 'Design & Develop', desc: 'Our experts build your custom solution with precision.' },
    { number: '03', title: 'Review & Launch', desc: 'We refine the product based on your feedback and go live.' },
    { number: '04', title: 'Ongoing Support', desc: 'We provide continuous maintenance and updates.' },
  ];

  return (
    <div className="flex flex-col bg-white overflow-hidden">
      <SEO 
        title="XR System | Software Service Company in Ranchi, Jharkhand | SEO & Digital Marketing Services" 
        description="XR System is a leading software service company in Ranchi, Jharkhand offering web design, SEO services, digital marketing, and UI/UX design to help businesses grow online and get more customers." 
        keywords="Software Service Company, Website Development Company in Ranchi, Web Design Company in Ranchi, SEO Services in Ranchi Jharkhand, Digital Marketing Company in Ranchi, UI UX Design Services Ranchi, E-commerce Website Development Ranchi, XR System"
      />
      
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "XR System",
            "image": "https://xrsystem.in/favicon.png", 
            "@id": "https://xrsystem.in/",
            "url": "https://xrsystem.in/",
            "telephone": "+919110047180",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Lower Burdwan Compound, Lalpur",
              "addressLocality": "Ranchi",
              "addressRegion": "Jharkhand",
              "postalCode": "834001",
              "addressCountry": "IN"
            },
            "priceRange": "₹₹",
            "sameAs": [
              "https://x.com/xrsystem",
              "https://www.linkedin.com/company/xrsystem/",
              "https://github.com/xrsystem",
              "https://www.instagram.com/xrsystem.in",
              "https://www.youtube.com/channel/UCy0jrE3QfB4q_dYFnK51-DQ",
              "https://www.reddit.com/user/XRsystem"
            ]
          })}
        </script>
      </Helmet>

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 overflow-hidden">
        
        <div className="absolute inset-0 -z-10 bg-slate-50/40">
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-size-[24px_24px] opacity-40"></div>
          
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 -left-20 lg:-left-40 w-100 h-100 lg:w-150 lg:h-150 bg-brand-300/30 rounded-full blur-[120px]" 
          />
          
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 -right-20 lg:-right-40 w-100 h-100 lg:w-150 lg:h-150 bg-indigo-400/20 rounded-full blur-[120px]" 
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-brand-100 shadow-sm text-brand-600 text-sm font-bold mb-8 cursor-pointer"
              >
                <Rocket size={16} className="text-brand-500" />
                Leading Tech Agency in Ranchi
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-display font-bold leading-[1.1] mb-6 tracking-tight text-slate-900">
                We Build Websites That Help Your{' '}
                <span className="whitespace-nowrap">
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-600 to-indigo-400 inline-block mt-2">
                    Business Grow
                  </span>
                  <span className="inline-block mt-2 ml-3">🚀</span>
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                From simple websites to custom cloud platforms, we engineer digital experiences that convert visitors into loyal customers.
              </p>
              
              <div className="flex flex-wrap justify-center gap-5 mb-16 relative z-20">
                <Link
                  to="/contact"
                  className="group relative bg-brand-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.4)] hover:-translate-y-1 flex items-center gap-2 overflow-hidden"
                >
                  <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  Start Your Project
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/portfolio"
                  className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 hover:-translate-y-1 transition-all shadow-sm"
                >
                  View Portfolio
                </Link>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-8 text-slate-600 font-medium border-t border-slate-200/60 pt-10">
                {['Based in Ranchi', 'Fast Delivery', 'Affordable Pricing'].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 shadow-sm border border-brand-100/50">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative">
        <div className="absolute top-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">Core Services</h2>
            <p className="text-slate-600 text-lg">
              We provide business-focused digital solutions designed to drive real results and scalable growth.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative group/slider"
          >
            <button onClick={() => scroll('left')} className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white border border-slate-200 items-center justify-center text-slate-600 hover:bg-brand-600 hover:text-white transition-all shadow-lg opacity-0 group-hover/slider:opacity-100 hover:scale-110">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => scroll('right')} className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white border border-slate-200 items-center justify-center text-slate-600 hover:bg-brand-600 hover:text-white transition-all shadow-lg opacity-0 group-hover/slider:opacity-100 hover:scale-110">
              <ChevronRight size={24} />
            </button>

            <div 
              ref={scrollRef}
              className="flex gap-6 md:gap-8 overflow-x-auto pb-12 pt-4 snap-x snap-mandatory scrollbar-hide no-scrollbar px-4 md:px-0"
            >
              {services.map((service, i) => (
                <div
                  key={i}
                  className="min-w-full md:min-w-100 bg-white p-10 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(99,102,241,0.08)] hover:-translate-y-2 hover:border-brand-100 transition-all duration-500 group snap-center flex flex-col"
                >
                  <div className="w-16 h-16 bg-linear-to-br from-brand-50 to-brand-100 rounded-2xl flex items-center justify-center text-brand-600 mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-white">
                    <service.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-slate-900 mb-4 tracking-tight group-hover:text-brand-600 transition-colors">{service.title}</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed font-light grow">{service.description}</p>
                  <HashLink smooth to={`/services#${service.id}`} className="text-brand-600 font-bold flex items-center gap-2 group/link mt-auto bg-brand-50/50 w-fit px-5 py-2.5 rounded-full hover:bg-brand-100 transition-colors">
                    Learn More
                    <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                  </HashLink>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">How It Works</h2>
            <p className="text-slate-600 text-lg">
              A transparent, proven 4-step process to bring your digital vision to life.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-linear-to-r from-brand-100 via-brand-200 to-brand-100 z-0"></div>

            {steps.map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative z-10 group"
              >
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white border-4 border-brand-50 rounded-full flex items-center justify-center text-2xl font-display font-bold text-brand-600 mb-6 group-hover:border-brand-100 group-hover:scale-110 transition-all shadow-sm">
                    {step.number}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-600 text-sm font-bold mb-6">
                <Trophy size={16} />
                The XR Advantage
              </div>
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-8 tracking-tight">Why Choose <span className="text-brand-600">XR System?</span></h2>
              <p className="text-slate-600 text-lg mb-12 leading-relaxed font-light">
                We combine local expertise with global standards. We don't just write code; we build scalable digital assets designed for maximum ROI.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
                {[
                  { title: 'Fast Delivery', desc: 'Optimized workflows ensure your projects launch on schedule without sacrificing quality.', icon: <Zap /> },
                  { title: 'Secure Code', desc: 'Enterprise-grade security is baked into the heart of our MERN stack development process.', icon: <Shield /> },
                  { title: 'Client Centric', desc: 'Your business goals dictate our technical decisions. We work as an extension of your team.', icon: <Heart /> },
                  { title: 'Dedicated Support', desc: 'Direct access to your developers via our customized client portals and ticketing systems.', icon: <Activity /> },
                ].map((item, i) => (
                  <div key={i} className="space-y-4 group">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-slate-100">
                      {item.icon}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Clean Image Container (No floating badges) */}
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand-500/10 border-8 border-white bg-slate-100 min-h-100 lg:min-h-150 w-full flex items-center justify-center relative z-10">
                {isLoading ? (
                  <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
                  </div>
                ) : siteSettings?.homeBanner ? (
                  <img 
                    src={siteSettings.homeBanner} 
                    alt="XR System Operations" 
                    className="w-full h-full object-cover absolute inset-0 hover:scale-105 transition-transform duration-700" 
                    fetchPriority="high" 
                    decoding="async" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon size={48} className="mb-4 opacity-50" />
                    <p className="font-display font-bold tracking-widest uppercase text-sm">Banner Missing</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🌟 TESTIMONIALS */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">What Our Leaders Say</h2>
            <p className="text-slate-600 text-lg">
              Our commitment to technical excellence and client success starts from the top.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_rgba(99,102,241,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-full group"
              >
                <div className="flex text-amber-400 mb-6 gap-1">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill="currentColor" />)}
                </div>
                <p className="mb-8 text-slate-700 leading-relaxed font-light italic grow">"{t.text}"</p>
                
                <div className="flex items-center gap-4 border-t border-slate-100 pt-6 mt-auto">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-brand-100 shrink-0 bg-brand-50 flex items-center justify-center group-hover:border-brand-400 transition-colors">
                    {isLoading ? (
                      <div className="w-full h-full bg-slate-200 animate-pulse" />
                    ) : t.image ? (
                      <img 
                        src={t.image} 
                        alt={t.name} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                        loading="lazy" 
                      />
                    ) : (
                      <span className="text-brand-600 font-bold text-xl">{t.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-display font-bold text-slate-900 tracking-tight leading-tight">{t.name}</p>
                    <p className="text-[11px] text-brand-600 font-bold uppercase tracking-widest mt-1">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}