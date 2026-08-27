import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Mail, Phone, MapPin, Send, HelpCircle, ShieldCheck, Truck, RotateCcw, Snowflake, Flame } from 'lucide-react';

export const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How does Akira Fresh sub-zero cold chain delivery work?',
      a: 'All our gourmet ready-to-cook delicacies are IQF blast-frozen at -18°C directly after chef preparation and packed in specialized thermal insulation boxes with food-grade dry ice packs to ensure 100% frozen freshness right to your doorstep.'
    },
    {
      q: 'Do I need to defrost the kebabs and snacks before cooking?',
      a: 'No defrosting needed! You can place them straight from the freezer into a hot pan with a dab of desi ghee/oil or into an air fryer. They cook to golden perfection in 5 to 7 minutes.'
    },
    {
      q: 'What is your delivery timeframe across Delhi NCR?',
      a: 'We offer express 2-hour sub-zero delivery in major NCR hubs and same-day scheduled delivery slots across all 500+ supported pin codes.'
    },
    {
      q: 'Are your meats 100% antibiotic and preservative-free?',
      a: 'Yes, absolutely. We source exclusively from bio-secure certified farms and government-inspected pasture lamb with strict zero antibiotic and zero synthetic preservative policies.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn space-y-8 text-charcoal-900 dark:text-ivory-100">
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-leaf-700 dark:text-lime-400">Customer Support & FAQs</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-950 dark:text-white mt-1">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div
            key={i}
            className="bg-white dark:bg-forest-900 rounded-2xl border border-gray-200 dark:border-forest-800 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              className="w-full text-left p-5 flex items-center justify-between font-bold text-sm text-charcoal-950 dark:text-white hover:text-leaf-600 dark:hover:text-leaf-400 transition-colors cursor-pointer"
            >
              <span>{f.q}</span>
              <span className="text-lg text-leaf-600 dark:text-lime-400">{openFaq === i ? '−' : '+'}</span>
            </button>
            {openFaq === i && (
              <div className="px-5 pb-5 text-xs sm:text-sm text-charcoal-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-forest-800 pt-3">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ContactPage = () => {
  const { addToast } = useToast();
  const [msg, setMsg] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Thank you! Your message has been received. Our team will contact you shortly.', 'success');
    setMsg({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn text-charcoal-900 dark:text-ivory-100">
      <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-forest-800 shadow-sm space-y-6">
        <div className="text-center max-w-md mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-leaf-700 dark:text-lime-400">Direct Support</span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-950 dark:text-white mt-1">Contact Akira Fresh</h1>
          <p className="text-xs text-charcoal-600 dark:text-gray-400 mt-2">
            Have questions about party catering, bulk orders, or cold-chain delivery? We are here to help.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto text-xs">
          <input
            type="text"
            required
            placeholder="Your Full Name"
            value={msg.name}
            onChange={(e) => setMsg({ ...msg, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-forest-850 text-charcoal-950 dark:text-white rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-leaf-500"
          />
          <input
            type="email"
            required
            placeholder="Email Address"
            value={msg.email}
            onChange={(e) => setMsg({ ...msg, email: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-forest-850 text-charcoal-950 dark:text-white rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-leaf-500"
          />
          <textarea
            required
            rows="4"
            placeholder="How can our culinary team help you today?"
            value={msg.message}
            onChange={(e) => setMsg({ ...msg, message: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-forest-850 text-charcoal-950 dark:text-white rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-leaf-500"
          />
          <button
            type="submit"
            className="w-full py-3.5 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs sm:text-sm rounded-xl shadow-sm cursor-pointer hover:scale-102 transition-all"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

