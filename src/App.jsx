import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { Analytics } from '@vercel/analytics/react';
import axios from 'axios';
import { lazy, Suspense } from 'react';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use((config) => {
  if (config.method === 'get') {
    config.url = config.url + (config.url.includes('?') ? '&' : '?') + '_t=' + new Date().getTime();
  }
  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    alert("Mobile Error: " + error.message + " | URL: " + (error.config?.url || "Unknown"));
    return Promise.reject(error);
  }
);

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import AdminLayout from './components/AdminLayout'; 

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Contact = lazy(() => import('./pages/Contact'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Careers = lazy(() => import('./pages/Careers'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const AdminBlogManager = lazy(() => import('./pages/AdminBlogManager'));
const AdminBlogEditor = lazy(() => import('./pages/AdminBlogEditor'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const ClientPortal = lazy(() => import('./pages/ClientPortal')); 
const SecretAdminLogin = lazy(() => import('./pages/SecretAdminLogin')); 
const Invoice = lazy(() => import('./pages/Invoice')); 
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const CrmLeads = lazy(() => import('./pages/CrmLeads')); 
const ContentManager = lazy(() => import('./pages/ContentManager')); 
const Billing = lazy(() => import('./pages/Billing'));

const PrivacyPolicy = lazy(() => import('./pages/Legal').then(module => ({ default: module.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/Legal').then(module => ({ default: module.TermsOfService })));


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  
  if (!token || token === 'undefined' || token === 'null') {
    return <Navigate to="/xradmin" replace />;
  }
  
  return children;
};

function AppContent() {
  const location = useLocation();
  
  const isAuth = ['/login', '/xradmin'].includes(location.pathname) || 
                 location.pathname.startsWith('/admin') || 
                 location.pathname.startsWith('/invoice');

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {!isAuth && <Navbar />}
      <main className="grow">
        <Suspense fallback={<div className="h-[60vh] flex items-center justify-center text-slate-500">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            
            <Route path="/invoice/:id" element={<Invoice />} />
            
            <Route path="/login" element={<ClientPortal />} />

            <Route path="/xradmin" element={<SecretAdminLogin />} />

            <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />

            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminProvider>
                  <AdminLayout />
                </AdminProvider>
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="crm" element={<CrmLeads />} /> 
              <Route path="cms" element={<ContentManager />} />
              <Route path="billing" element={<Billing />} />
              <Route path="blogs" element={<AdminBlogManager />} />
              <Route path="blogs/new" element={<AdminBlogEditor />} />
              <Route path="blogs/edit/:id" element={<AdminBlogEditor />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      
      {!isAuth && <WhatsAppButton />} 
      
      {!isAuth && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <ErrorBoundary>
          <AuthProvider>
            <AppContent />
            <Analytics />
          </AuthProvider>
        </ErrorBoundary>
      </HelmetProvider>
    </BrowserRouter>
  );
}