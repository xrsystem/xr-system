import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <SEO title="404 - Page Not Found" description="The page you are looking for does not exist." />
      <div className="text-center max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-display font-bold text-brand-600/20">404</h1>
          <div className="relative -mt-20">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Page Not Found</h2>
            <p className="text-slate-600 mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
            </p>
          </div>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-brand-600 text-white px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-white text-slate-900 border border-slate-200 px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
