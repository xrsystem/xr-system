import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Code2, Github, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
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
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all">
              <Linkedin size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all">
              <Github size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-brand-400 transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
            <li><Link to="/services" className="hover:text-brand-400 transition-colors">Our Services</Link></li>
            <li><Link to="/careers" className="hover:text-brand-400 transition-colors">Careers</Link></li>
            <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact</Link></li>
            <li><Link to="/login" className="hover:text-brand-400 transition-colors">Client Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Services</h4>
          <ul className="space-y-4 text-sm">
            <li><HashLink smooth to="/services#web-development" className="hover:text-brand-400 transition-colors">Web Development</HashLink></li>
            <li><HashLink smooth to="/services#ui-ux" className="hover:text-brand-400 transition-colors">UI/UX Design</HashLink></li>
            <li><HashLink smooth to="/services#seo" className="hover:text-brand-400 transition-colors">SEO & Content</HashLink></li>
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
                href="https://www.google.com/maps/search/?api=1&query=Lalpur,Ranchi,Jharkhand,India" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-brand-400 transition-colors"
              >
                Lalpur, Ranchi, Jharkhand, India
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
              <a href="mailto:connect@xrsystem.in" className="hover:text-brand-400 transition-colors">
                connect@xrsystem.in
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