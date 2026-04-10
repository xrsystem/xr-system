import { motion } from 'motion/react';
import SEO from '../components/SEO';

const LegalLayout = ({ title, lastUpdated, content }) => (
  <div className="pt-32 pb-24 px-6">
    <SEO title={title} description={`${title} for XR System.`} />
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl lg:text-7xl font-display font-bold mb-4">{title}</h1>
        <p className="text-slate-500 mb-12 font-medium uppercase tracking-widest text-sm">Last Updated: {lastUpdated}</p>
        
        <div className="space-y-12 text-slate-600 leading-relaxed">
          {content}
        </div>
      </motion.div>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-display font-bold text-slate-900">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

export const PrivacyPolicy = () => (
  <LegalLayout
    title="Privacy Policy"
    lastUpdated="April 03, 2026"
    content={
      <>
        <p className="text-lg">At XR System, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.</p>
        <Section title="1. Information We Collect">
          <p>We collect information you provide directly to us, such as when you fill out our contact form, including your name, email address, and message content.</p>
        </Section>
        <Section title="2. How We Use Your Information">
          <ul className="list-disc pl-6 space-y-2">
            <li>To respond to your inquiries and provide customer support.</li>
            <li>To improve our website and services.</li>
            <li>To send periodic updates or marketing communications (if you&apos;ve opted in).</li>
          </ul>
        </Section>
        <Section title="3. Data Security">
          <p>We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the internet is 100% secure.</p>
        </Section>
        <Section title="4. Third-Party Services">
          <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except to provide our services or as required by law.</p>
        </Section>
      </>
    }
  />
);

export const TermsOfService = () => (
  <LegalLayout
    title="Terms of Service"
    lastUpdated="April 03, 2026"
    content={
      <>
        <p className="text-lg">By accessing this website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        <Section title="1. Use License">
          <p>Permission is granted to temporarily download one copy of the materials on XR System&apos; website for personal, non-commercial transitory viewing only.</p>
        </Section>
        <Section title="2. Disclaimer">
          <p>The materials on this website are provided on an &apos;as is&apos; basis. XR System makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.</p>
        </Section>
        <Section title="3. Limitations">
          <p>In no event shall XR System or its suppliers be liable for any damages arising out of the use or inability to use the materials on this website.</p>
        </Section>
        <Section title="4. Governing Law">
          <p>These terms and conditions are governed by and construed in accordance with the laws of Jharkhand, India and you irrevocably submit to the exclusive jurisdiction of the courts in that State.</p>
        </Section>
      </>
    }
  />
);
