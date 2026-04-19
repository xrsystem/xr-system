import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Code2, Github, Twitter, Linkedin, Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import { motion } from 'motion/react'; 

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-white group"
          >
            <motion.div 
              className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20"
              whileHover={{ 
                scale: 1.1, 
                rotate: 12 
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Code2 size={24} strokeWidth={2.5} />
            </motion.div>
            <span className="text-xl font-display font-bold tracking-tight">
              XR <span className="text-brand-600 group-hover:text-brand-400 transition-colors">System</span>
            </span>
          </Link>
          
          <p className="text-sm leading-relaxed max-w-sm">
            Empowering businesses with cutting-edge IT solutions. From web development to digital marketing, we help you scale in the digital era.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a href="https://x.com/xrsystem" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all hover:-translate-y-1 shadow-md">
              <Twitter size={18} />
            </a>
            <a href="https://www.linkedin.com/company/xrsystem/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all hover:-translate-y-1 shadow-md">
              <Linkedin size={18} />
            </a>
            <a href="https://github.com/xrsystem" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all hover:-translate-y-1 shadow-md">
              <Github size={18} />
            </a>
            <a href="https://www.instagram.com/xrsystem.in" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all hover:-translate-y-1 shadow-md">
              <Instagram size={18} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all hover:-translate-y-1 shadow-md">
              <Facebook size={18} />
            </a>
            <a href="https://www.youtube.com/channel/UCy0jrE3QfB4q_dYFnK51-DQ" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all hover:-translate-y-1 shadow-md">
              <Youtube size={18} />
            </a>
            <a href="https://www.reddit.com/user/XRsystem" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all hover:-translate-y-1 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.56 12 8 12.562 8 13.25c0 .687.56 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.562-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.561-1.249-1.249-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-brand-400 transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
            <li><Link to="/services" className="hover:text-brand-400 transition-colors">Our Services</Link></li>
            <li><Link to="/blog" className="hover:text-brand-400 transition-colors">Blog</Link></li>
            <li><Link to="/careers" className="hover:text-brand-400 transition-colors">Careers</Link></li>
            <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact</Link></li>
            <li><Link to="/login" className="hover:text-brand-400 transition-colors">Client Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Services</h4>
          <ul className="space-y-4 text-sm">
            <li><HashLink smooth to="/services#web-development" className="hover:text-brand-400 transition-colors">Web Development & Design</HashLink></li>
            <li><HashLink smooth to="/services#ui-ux" className="hover:text-brand-400 transition-colors">UI/UX Design</HashLink></li>
            <li><HashLink smooth to="/services#seo" className="hover:text-brand-400 transition-colors">SEO </HashLink></li>
            <li><HashLink smooth to="/services#digital-marketing" className="hover:text-brand-400 transition-colors">Digital Marketing</HashLink></li>
            <li><HashLink smooth to="/services#ecommerce" className="hover:text-brand-400 transition-colors">E-commerce Solutions</HashLink></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Contact Info</h4>
          <ul className="space-y-4 text-sm relative">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-brand-500 shrink-0 mt-0.5" />
              <a 
                href="https://maps.app.goo.gl/RWoqLtS6cjxLgPPh9" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-brand-400 transition-colors"
              >
                Lower Burdwan Compound, Lalpur, Ranchi, 834001, Jharkhand.
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-brand-500 shrink-0" />
              <a href="tel:+919110047180" className="hover:text-brand-400 transition-colors">
                +91 9110047180
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-brand-500 shrink-0" />
              <a href="mailto:support@xrsystem.in" className="hover:text-brand-400 transition-colors">
                support@xrsystem.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col md:grid md:grid-cols-2 justify-between items-center gap-4 text-xs">
        <p>© 2026 XR System. All rights reserved.</p>
        <div className="flex gap-6 md:justify-end">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}