import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Check, ArrowRight, CheckCircle2, Zap, Search, Layout, HelpCircle, 
  AlertTriangle, FileText, CreditCard, RefreshCw, Plus, Code2, 
  ShoppingCart, Palette, BarChart3, Star, Loader2, Trophy, PackageX
} from 'lucide-react';
import SEO from '../components/SEO';
import QuoteModal from '../components/QuoteModal';
import axios from 'axios';

const iconMap = { 'Plus': Plus, 'Search': Search, 'Layout': Layout, 'Zap': Zap, 'FileText': FileText };

export default function Pricing() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivePlans = async () => {
      try {
        const response = await axios.get('/api/pricing');
        if (response.data?.data?.plans) {
          setPlans(response.data.data.plans);
        } else {
          setPlans([]);
        }
      } catch (error) {
        console.error("Failed to fetch plans", error);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivePlans();
  }, []);

  const openQuote = (plan) => {
    setSelectedPlan(plan);
    setIsQuoteOpen(true);
  };

  const getPlans = (cat) => plans.filter(p => p.category === cat);
  
  const webPlans = getPlans('Web Development');
  const seoPlans = getPlans('SEO');
  const uiuxPlans = getPlans('UI/UX Design');
  const dmPlans = getPlans('Digital Marketing');
  const ecomPlans = getPlans('E-commerce');
  const maintenancePlans = getPlans('Maintenance');
  const comboPlans = getPlans('Combo Plans');
  const addonPlans = getPlans('Add-on');

  const PlanCard = ({ plan, i }) => {
    const isMonthly = ['SEO', 'Digital Marketing', 'Maintenance'].includes(plan.category);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
        whileHover={{ y: -10 }}
        className={`relative bg-white p-10 rounded-[3rem] border transition-all duration-500 flex flex-col h-full ${
          plan.isPopular 
            ? 'border-brand-600 shadow-2xl shadow-brand-600/10 z-10' 
            : 'border-slate-100 hover:border-brand-200 shadow-sm hover:shadow-xl'
        }`}
      >
        {plan.isPopular && (
          <div className="absolute top-0 right-12 -translate-y-1/2 bg-brand-600 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl flex items-center gap-2">
            <Star size={12} className="fill-white" />
            Most Popular
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-2 tracking-tight">{plan.name}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{plan.description}</p>
        </div>

        <div className="mb-10">
          {plan.originalPrice && plan.originalPrice > plan.price && (
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl text-slate-400 line-through font-medium">₹{plan.originalPrice.toLocaleString()}</span>
              {plan.discountBadge && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">{plan.discountBadge}</span>
              )}
            </div>
          )}
          
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-display font-bold text-slate-900 tracking-tight">₹{plan.price.toLocaleString()}</span>
            {isMonthly && <span className="text-slate-500 text-sm">/month</span>}
          </div>
          <p className="text-xs text-slate-400 mt-2 italic">
            {isMonthly ? 'Recurring monthly billing' : 'Starting price (One-time)'}
          </p>
        </div>

        <ul className="space-y-4 mb-12 flex-1">
          {plan.features?.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm font-medium">
              <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.isPopular ? 'bg-brand-100 text-brand-600' : 'bg-slate-50 text-slate-400'}`}>
                <Check size={12} strokeWidth={3} />
              </div>
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={() => openQuote(plan)}
          className={`w-full py-5 rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2 ${
            plan.isPopular 
              ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-xl shadow-brand-600/20' 
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {isMonthly ? 'Start Monthly Plan' : 'Get Started'} <ArrowRight size={18} />
        </button>
      </motion.div>
    );
  };

  const PricingSection = ({ title, icon: Icon, data }) => {
    if (data.length === 0) return null;
    return (
      <div className="mb-32">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/20">
            <Icon size={24} />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight uppercase">{title}</h2>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {data.map((plan, i) => <PlanCard key={plan._id || i} plan={plan} i={i} />)}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24">
      <SEO title="Pricing Plans | XR System" description="Transparent pricing for web development, maintenance, and IT solutions by XR System in Ranchi." />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-bold mb-6">
            <CreditCard size={16} /> Transparent Pricing
          </motion.div>
          <h1 className="text-4xl lg:text-6xl font-display font-bold text-slate-900 mb-6 tracking-tight">Choose the Perfect <span className="text-brand-600">Plan</span></h1>
          <p className="text-xl text-slate-600 font-light leading-relaxed">Real-world ready solutions for your business. No hidden charges, just pure quality and value.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-brand-600 mb-4" />
            <p className="text-slate-500 font-medium">Loading pricing plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="bg-white p-12 rounded-4xl border border-slate-100 text-center shadow-sm max-w-2xl mx-auto mb-32">
             <PackageX className="mx-auto h-12 w-12 text-slate-300 mb-4" />
             <h3 className="text-xl font-bold text-slate-900 mb-2">Custom Pricing Only</h3>
             <p className="text-slate-500 mb-8">We are currently updating our standard packages. Please request a custom quote for your requirements.</p>
             <button 
               onClick={() => openQuote({ name: 'Custom Inquiry', category: 'General', price: 0 })}
               className="bg-brand-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-700 transition-all inline-flex items-center gap-2"
             >
               Request Custom Quote <ArrowRight size={18} />
             </button>
          </div>
        ) : (
          <>
            <PricingSection title="Web Development Packages" icon={Code2} data={webPlans} />
            <PricingSection title="SEO & Content" icon={BarChart3} data={seoPlans} />
            <PricingSection title="UI/UX Design" icon={Palette} data={uiuxPlans} />
            <PricingSection title="Digital Marketing" icon={Zap} data={dmPlans} />
            <PricingSection title="E-Commerce Solutions" icon={ShoppingCart} data={ecomPlans} />
            <PricingSection title="Monthly Maintenance Plans" icon={RefreshCw} data={maintenancePlans} />
            <PricingSection title="Combo Plans (High Conversion)" icon={Trophy} data={comboPlans} />

            {addonPlans.length > 0 && (
              <div className="mb-32">
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-12 text-center tracking-tight uppercase">Add-on Services</h2>
                <div className="flex flex-wrap justify-center gap-6">
                  {addonPlans.map((addon, i) => {
                    const Icon = iconMap[addon.iconName] || Plus;
                    return (
                      <motion.div
                        key={addon._id || i}
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center group hover:border-brand-200 transition-all w-full sm:w-50"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Icon size={24} />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1">{addon.name}</h4>
                        <p className="text-brand-600 font-bold text-sm">₹{addon.price.toLocaleString()}</p>
                        <button onClick={() => openQuote(addon)} className="mt-4 text-xs font-bold text-slate-500 hover:text-brand-600">Add to Project &rarr;</button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        <div className="mb-32 bg-amber-50 border border-amber-100 rounded-[3rem] p-10 lg:p-16">
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle className="text-amber-600" size={32} />
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Important Notes</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center shrink-0 font-bold text-xs mt-1">!</div>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Request Scope:</strong> Any request outside the initial project scope will be considered a new task and will be charged extra.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center shrink-0 font-bold text-xs mt-1">!</div>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Ongoing Improvements:</strong> We continuously improve our systems. Major updates to your existing site after launch may require a separate quote.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center shrink-0 font-bold text-xs mt-1">!</div>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Extra Charges:</strong> Premium plugins, themes, or third-party API costs are not included in the plan prices and must be paid by the client.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center shrink-0 font-bold text-xs mt-1">!</div>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Content Delivery:</strong> Project timelines start only after all required content (text, images, logos) is provided by the client.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-32">
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="text-brand-600" />
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Payment Terms</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">1</div>
                  <p className="text-slate-600 text-sm font-medium">50% Advance payment required to start project</p>
                </li>
                <li className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">2</div>
                  <p className="text-slate-600 text-sm font-medium">50% on completion before delivery</p>
                </li>
                <li className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">3</div>
                  <p className="text-slate-600 text-sm font-medium">For larger projects: milestone-based payments</p>
                </li>
              </ul>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <HelpCircle className="text-brand-600" size={20} />
                  <h4 className="font-bold text-slate-900">Support Policy</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">Free support for 7 days after delivery. Ongoing support available via monthly maintenance plans.</p>
              </section>
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <RefreshCw className="text-brand-600" size={20} />
                  <h4 className="font-bold text-slate-900">Revision Policy</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">Limited revisions based on plan. Additional revisions will be chargeable at standard rates.</p>
              </section>
            </div>
          </div>

          <div className="space-y-12">
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">What’s Included?</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Included
                  </h4>
                  <ul className="space-y-3">
                    {['Design + Development', 'Basic SEO setup', 'Mobile responsiveness'].map((item, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-center gap-2 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-red-500 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <AlertTriangle size={16} /> Not Included
                  </h4>
                  <ul className="space-y-3">
                    {['Domain & Hosting', 'Paid plugins/tools', 'Third-party subscriptions'].map((item, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-center gap-2 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="text-brand-400" />
                <h3 className="text-xl font-bold tracking-tight">Terms & Conditions</h3>
              </div>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />No refund after project has started</li>
                <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />Client must provide content on time</li>
                <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />Delay from client may affect delivery timeline</li>
              </ul>
            </section>
          </div>
        </div>

        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-600">Got questions? We've got answers.</p>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {[
              { q: "How long does it take to build a website?", a: "A basic website takes 5-7 days, while a standard business website takes 10-15 days. Premium projects depend on complexity." },
              { q: "Do I need to pay everything upfront?", a: "No, we follow a 50% advance and 50% on completion model for most projects." },
              { q: "Is domain and hosting included?", a: "Domain and hosting are not included in the base price but can be added as an add-on service." },
              { q: "Can I upgrade my plan later?", a: "Yes, you can upgrade your maintenance plan or add new features to your website at any time." }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-3 flex items-start gap-2">
                  <HelpCircle className="text-brand-600 shrink-0 mt-1" size={18} />
                  {faq.q}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-32 text-center">
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-slate-900 mb-8 tracking-tight">Ready to start your project?</h2>
          <button 
            onClick={() => openQuote({ name: 'Custom Inquiry', category: 'General', price: 0 })}
            className="bg-brand-600 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-brand-700 transition-all shadow-2xl shadow-brand-600/20 flex items-center gap-3 mx-auto"
          >
            Get a Free Quote <ArrowRight />
          </button>
        </div>
      </div>

      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} selectedPlan={selectedPlan} />
    </div>
  );
}