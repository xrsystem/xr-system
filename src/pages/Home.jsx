import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Zap, Shield, Heart, Trophy, Layout, Code, Search, Rocket, Check, ShoppingCart, ChevronLeft, ChevronRight, Loader2, Image as ImageIcon } from 'lucide-react';
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <SEO 
        title="XR System | Website Development Company in Ranchi, Jharkhand | SEO & Digital Marketing Services" 
        description="XR System is a leading website development company in Ranchi, Jharkhand offering web design, SEO services, digital marketing, and UI/UX design to help businesses grow online and get more customers." 
        keywords="Website Development Company in Ranchi, Web Design Company in Ranchi, SEO Services in Ranchi Jharkhand, Digital Marketing Company in Ranchi, UI UX Design Services Ranchi, E-commerce Website Development Ranchi, XR System"
      />
      
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "XR System",
            "image": "https://xrsystem.in/assets/logo.png",
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
              "https://www.instagram.com/xrsystem2026?igsh=dGhoa2NzdG9hYThj",
              "https://facebook.com/xrsystem",
              "https://youtube.com/@xrsystem",
              "https://reddit.com/user/xrsystem"
            ]
          })}
        </script>
      </Helmet>

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.1),transparent_50%)]" />
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-20 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-600 text-sm font-bold mb-8">
              <Rocket size={16} />
              Leading Agency in Ranchi
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight mb-8 tracking-tight max-w-4xl mx-auto">
              We Build Websites That Help Your <span className="text-brand-600">Business Grow 🚀</span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              From simple websites to custom platforms, we help businesses go online and get more customers.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link
                to="/contact"
                className="bg-brand-600 text-white px-8 py-4 rounded-full font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/25 flex items-center gap-2"
              >
                Start Your Project
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/portfolio"
                className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all"
              >
                View Portfolio
              </Link>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 font-medium border-t border-slate-100 pt-12">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                  <Check size={16} />
                </div>
                Based in Ranchi
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                  <Check size={16} />
                </div>
                Fast Delivery
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                  <Check size={16} />
                </div>
                Affordable Pricing
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl mb-6">Core Services</h2>
            <p className="text-slate-600 text-lg">
              We provide business-focused digital solutions designed to drive results.
            </p>
          </div>

          <div className="relative group/slider">
            <button 
              onClick={() => scroll('left')}
              className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200 items-center justify-center text-slate-600 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-xl opacity-0 group-hover/slider:opacity-100 active:scale-95"
            >
              <ChevronLeft size={24} />
            </button>

            <button 
              onClick={() => scroll('right')}
              className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200 items-center justify-center text-slate-600 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-xl opacity-0 group-hover/slider:opacity-100 active:scale-95"
            >
              <ChevronRight size={24} />
            </button>

            <div 
              ref={scrollRef}
              className="flex gap-6 md:gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide no-scrollbar px-4 md:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {services.map((service, i) => (
                <motion.div
                  key={i}
                  className="min-w-full md:min-w-100 bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 group snap-center md:snap-start"
                >
                  <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-8 group-hover:scale-110 transition-transform">
                    <service.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4 tracking-tight">{service.title}</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed font-light h-20 line-clamp-3">{service.description}</p>
                  <HashLink smooth to={`/services#${service.id}`} className="text-brand-600 font-bold flex items-center gap-2 group/link">
                    Learn More
                    <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                  </HashLink>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl mb-6">How It Works</h2>
            <p className="text-slate-600 text-lg">
              Our simple 4-step process to bring your digital vision to life.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all h-full">
                  <div className="text-4xl font-display font-bold text-brand-100 mb-4 group-hover:text-brand-200 transition-colors">
                    {step.number}
                  </div>
                  <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-slate-200 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-5xl mb-8">Why Choose <span className="text-brand-600">XR System?</span></h2>
              <p className="text-slate-600 text-lg mb-12 leading-relaxed">
                We combine local expertise with global standards to deliver exceptional value.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { title: 'Fast Delivery', desc: 'We value your time and ensure projects are delivered on schedule.', icon: <Zap className="text-brand-500" /> },
                  { title: 'Secure Code', desc: 'Security is at the heart of our development process.', icon: <Shield className="text-brand-500" /> },
                  { title: 'Client Centric', desc: 'Your goals are our priority. We work as an extension of your team.', icon: <Heart className="text-brand-500" /> },
                  { title: 'Dedicated Support', desc: 'We are always here to help you with any technical needs.', icon: <Trophy className="text-brand-500" /> },
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
            
              <div className="rounded-3xl overflow-hidden shadow-2xl bg-slate-200 h-125 flex items-center justify-center relative">
                {siteSettings?.homeBanner ? (
                  <img src={siteSettings.homeBanner} alt="XR System Banner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-brand-600 to-slate-900 flex flex-col items-center justify-center text-white/50">
                    <ImageIcon size={64} className="mb-4 opacity-50" />
                    <p className="font-display font-bold tracking-widest uppercase">Update Banner in Admin</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl mb-6">What Our Leaders Say</h2>
            <p className="text-slate-600 text-lg">
              Our commitment to excellence starts from the top.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 italic text-slate-700 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="flex text-amber-400 mb-6">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="mb-8 text-base leading-relaxed font-light">&quot;{t.text}&quot;</p>
                </div>
                <div className="flex items-center gap-4 not-italic mt-auto">
                  
                  
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-100 shrink-0 bg-brand-50 flex items-center justify-center">
                    {t.image ? (
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                    ) : (
                      <span className="text-brand-600 font-bold text-lg">{t.name.charAt(0)}</span>
                    )}
                  </div>

                  <div>
                    <p className="font-display font-bold text-slate-900 tracking-tight text-sm line-clamp-1">{t.name}</p>
                    <p className="text-[10px] text-brand-600 font-bold uppercase tracking-widest">{t.role}</p>
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