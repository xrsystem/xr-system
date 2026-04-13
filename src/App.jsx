import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { Analytics } from '@vercel/analytics/react';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Careers from './pages/Careers';
import NotFound from './pages/NotFound';
import AdminBlogManager from './pages/AdminBlogManager';
import AdminBlogEditor from './pages/AdminBlogEditor';
import { PrivacyPolicy, TermsOfService } from './pages/Legal';
import PaymentSuccess from './pages/PaymentSuccess';

import ClientPortal from './pages/ClientPortal'; 
import SecretAdminLogin from './pages/SecretAdminLogin'; 

import Invoice from './pages/Invoice'; 

import AdminLayout from './components/AdminLayout'; 
import DashboardHome from './pages/DashboardHome';
import CrmLeads from './pages/CrmLeads'; 
import ContentManager from './pages/ContentManager'; 
import Billing from './pages/Billing';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="blogs" element={<AdminBlogManager />} />
          <Route path="blogs/new" element={<AdminBlogEditor />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          
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
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
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