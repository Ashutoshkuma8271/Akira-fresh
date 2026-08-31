import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, FileText, Lock, RefreshCcw, Truck, HelpCircle, AlertTriangle, Eye, Activity, Heart } from 'lucide-react';
import { PageTransition } from '../components/common/PageTransition';

const SECTIONS = [
  { id: 'privacy', label: 'Privacy Policy', icon: Shield },
  { id: 'terms', label: 'Terms of Service', icon: FileText },
  { id: 'cookies', label: 'Cookie Policy', icon: Eye },
  { id: 'refund', label: 'Refund Policy', icon: RefreshCcw },
  { id: 'cancellation', label: 'Cancellation Policy', icon: AlertTriangle },
  { id: 'shipping', label: 'Shipping Policy', icon: Truck },
  { id: 'returns', label: 'Return & Exchange Policy', icon: Heart },
  { id: 'disclaimer', label: 'Allergen & Food Safety', icon: HelpCircle },
  { id: 'accessibility', label: 'Accessibility Statement', icon: Activity },
  { id: 'security', label: 'Security & Vulnerability', icon: Lock }
];

export const StaticLegalPages = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('privacy');

  // Sync active section with hash or path parameter on mount / change
  useEffect(() => {
    const path = location.pathname.replace(/^\//, '');
    const found = SECTIONS.find(s => s.id === path || path.startsWith(s.id));
    if (found) {
      setActiveSection(found.id);
    }
  }, [location]);

  const IconComponent = SECTIONS.find(s => s.id === activeSection)?.icon || Shield;

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-charcoal-900 dark:text-ivory-100 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Sticky Left Sidebar Navigation */}
        <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24 space-y-4">
          <div className="bg-white dark:bg-forest-900 rounded-3xl p-5 border border-gray-200 dark:border-forest-800 shadow-sm space-y-2">
            <h3 className="font-serif text-sm font-bold text-charcoal-950 dark:text-white uppercase tracking-wider px-3 mb-4">
              Legal & Compliance
            </h3>
            <nav className="space-y-1.5 flex flex-wrap lg:flex-col">
              {SECTIONS.map(s => {
                const NavIcon = s.icon;
                const isActive = activeSection === s.id;
                return (
                  <Link
                    key={s.id}
                    to={`/${s.id}`}
                    onClick={() => setActiveSection(s.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-leaf-500/10 border-l-4 border-leaf-500 text-leaf-700 dark:text-leaf-400'
                        : 'text-charcoal-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-forest-850 hover:text-charcoal-950 dark:hover:text-white'
                    }`}
                  >
                    <NavIcon className={`w-4 h-4 ${isActive ? 'text-leaf-500' : 'text-gray-400'}`} />
                    <span>{s.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Quick Support Card */}
          <div className="hidden lg:block bg-leaf-gradient text-forest-950 rounded-3xl p-6 shadow-leaf-sm relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <h4 className="font-serif text-base font-black">Concierge Support</h4>
              <p className="text-[11px] leading-relaxed opacity-90 font-medium">
                If you have legal, privacy, or food safety inquiries, reach our administrative desk.
              </p>
              <div className="pt-2 text-xs font-extrabold space-y-1">
                <p>📞 +91 63862 56770</p>
                <p>✉️ ashutoshgifthamper9334@gmail.com</p>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
              <Shield className="w-32 h-32" />
            </div>
          </div>
        </aside>

        {/* Dynamic Legal Document Content Display */}
        <main className="flex-1 bg-white dark:bg-forest-900 border border-gray-200 dark:border-forest-800 rounded-3xl p-6 sm:p-10 shadow-sm leading-relaxed text-xs sm:text-sm text-charcoal-700 dark:text-gray-300 min-w-0">
          <div className="flex items-center gap-3 pb-6 border-b border-gray-100 dark:border-forest-800 mb-8">
            <div className="p-3 bg-leaf-500/10 rounded-2xl">
              <IconComponent className="w-6 h-6 text-leaf-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-leaf-600 dark:text-leaf-400 font-bold">
                Official Document
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-charcoal-950 dark:text-white leading-none mt-0.5">
                {SECTIONS.find(s => s.id === activeSection)?.label}
              </h1>
            </div>
          </div>

          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <p><strong>Effective Date:</strong> August 29, 2026</p>
              <p>
                At A_S FOODY, we value your privacy and are committed to protecting your personal information. This Privacy Policy details how we collect, process, and secure user information when you place orders or create accounts on our direct-to-consumer storefront.
              </p>
              
              <h3 className="font-serif text-base font-bold text-charcoal-950 dark:text-white mt-4">1. Data We Collect</h3>
              <p>We collect and process the following information necessary to fulfill e-commerce services:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Account Credentials:</strong> Full Name, Email Address, Phone Number, and Bcrypt-encrypted password hash.</li>
                <li><strong>Delivery Coordinates:</strong> Physical shipping addresses, cities, state, and pincodes for cold-chain routing.</li>
                <li><strong>Local Storage:</strong> Essential session tokens, shopping cart states, and theme configurations.</li>
              </ul>

              <h3 className="font-serif text-base font-bold text-charcoal-950 dark:text-white mt-4">2. Purpose of Processing</h3>
              <p>We use collected data strictly to execute orders, verify registration OTP codes, facilitate secure administrator logins, and dispatch transaction receipt logs.</p>

              <h3 className="font-serif text-base font-bold text-charcoal-950 dark:text-white mt-4">3. Third-Party Integrations</h3>
              <p>Your transactions are supported by vetted cloud partners:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Supabase:</strong> For cloud relational data hosting.</li>
                <li><strong>Razorpay:</strong> Secure payment processing (compliance handled directly at the gateway).</li>
                <li><strong>Cloudinary:</strong> Optimized image CDN delivery.</li>
              </ul>
              
              <h3 className="font-serif text-base font-bold text-charcoal-950 dark:text-white mt-4">4. Data Deletion Rights</h3>
              <p>You can request complete deletion of your account and personal data by contacting us directly at our privacy email desk: <strong>ashutoshgifthamper9334@gmail.com</strong>.</p>
            </div>
          )}

          {activeSection === 'terms' && (
            <div className="space-y-6">
              <p><strong>Effective Date:</strong> August 29, 2026</p>
              <p>
                Welcome to A_S FOODY. These Terms of Service govern your purchase of gourmet ready-to-cook snacks, raw meats, and cold-chain items. By accessing or using our storefront, you agree to comply with these terms.
              </p>

              <h3 className="font-serif text-base font-bold text-charcoal-950 dark:text-white mt-4">1. Accounts & Ordering</h3>
              <p>To place orders, customers must create a verified account using a valid email and phone number. You are solely responsible for securing your authorization tokens.</p>

              <h3 className="font-serif text-base font-bold text-charcoal-950 dark:text-white mt-4">2. Product Descriptions & Pricing</h3>
              <p>We strive to accurately describe all ready-to-cook snack items, ingredients, and pricing. All prices are displayed in Indian Rupees (INR) and are inclusive of standard local taxes unless specified otherwise.</p>

              <h3 className="font-serif text-base font-bold text-charcoal-950 dark:text-white mt-4">3. Delivery & Cold-Chain Integrity</h3>
              <p>Our products are shipped blast-frozen and require immediate freezer storage upon receipt. A_S FOODY is not responsible for food spoilage caused by delivery delays due to inaccurate address data provided by the customer.</p>
            </div>
          )}

          {activeSection === 'cookies' && (
            <div className="space-y-6">
              <p>
                A_S FOODY utilizes browser local storage to deliver a seamless and high-speed shopping experience. We do not use third-party advertising cookies or cross-site behavioral tracking scripts.
              </p>

              <h3 className="font-serif text-base font-bold text-charcoal-950 dark:text-white mt-4">Essential Storage Items</h3>
              <p>The following parameters are stored locally on your device to enable core storefront functionalities:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>as_commerce_user:</strong> Securely caches customer authentication state.</li>
                <li><strong>as_commerce_token:</strong> JSON Web Token (JWT) authorizing secure checkout requests.</li>
                <li><strong>as_commerce_cart:</strong> Saves your current item quantities.</li>
                <li><strong>as_commerce_wishlist:</strong> Stores saved favorites across browser reloads.</li>
                <li><strong>as_commerce_theme:</strong> Caches dark/light mode UI preferences.</li>
              </ul>
            </div>
          )}

          {activeSection === 'refund' && (
            <div className="space-y-6">
              <p>
                Due to the perishable nature of ready-to-cook snacks, fresh meats, and cold-chain delicacies, orders are generally non-returnable. We prioritize food safety and cannot accept food returns back into our central cold warehouse.
              </p>

              <h3 className="font-serif text-base font-bold text-charcoal-950 dark:text-white mt-4">Taste & Spoilage Guarantee</h3>
              <p>If you receive a package where the cold-chain was compromised (e.g. thawed dry ice, broken seal, or stale product), you must submit a refund claim within **24 hours** of delivery. Contact our support desk at <strong>ashutoshgifthamper9334@gmail.com</strong> with photos of the package. Approved claims will receive store credit or direct bank refunds to the original payment card.</p>
            </div>
          )}

          {activeSection === 'cancellation' && (
            <div className="space-y-6">
              <h3 className="font-serif text-base font-bold text-charcoal-950 dark:text-white">Order Cancellation Rules</h3>
              <p>Because we prepare snacks fresh and dispatch them via express 2-hour sub-zero cold networks, cancellations are governed by tight windows:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Before Dispatch:</strong> You can cancel your order penalty-free within **30 minutes** of placement by checking your account order panel or contacting support.</li>
                <li><strong>After Dispatch:</strong> Once your package leaves our Central Cold Hub in Dhaka Village, the order is locked and cannot be cancelled or modified.</li>
              </ul>
            </div>
          )}

          {activeSection === 'shipping' && (
            <div className="space-y-6">
              <h3 className="font-serif text-base font-bold text-charcoal-950 dark:text-white">Cold-Chain Shipping Policy</h3>
              <p>We deliver restaurant-grade fresh snacks across Delhi NCR utilizing customized sub-zero logistics:</p>
              
              <h4 className="font-semibold text-charcoal-900 dark:text-white mt-2">1. Delivery Zones & Delivery Timeframes</h4>
              <p>We currently ship to verified pin codes in Delhi, Noida, Gurugram, Faridabad, and Ghaziabad. We offer standard same-day delivery slots and 2-hour express delivery for supported hubs.</p>

              <h4 className="font-semibold text-charcoal-900 dark:text-white mt-2">2. Shipping Fees</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Standard Cold Delivery:</strong> Free on orders above ₹999. (₹99 flat fee otherwise).</li>
                <li><strong>Express 2-Hour Delivery:</strong> ₹149 delivery surcharge.</li>
                <li><strong>Same-Day Priority Slot:</strong> ₹249 delivery surcharge.</li>
              </ul>
            </div>
          )}

          {activeSection === 'returns' && (
            <div className="space-y-6">
              <h3 className="font-serif text-base font-bold text-charcoal-950 dark:text-white">Product Returns Policy</h3>
              <p>To maintain FSSAI food safety certifications, physical returns of consumed or opened raw food packs are strictly prohibited. Food items cannot be re-stocked. If you receive the incorrect product item, do not break the outer plastic seal, and contact support within 24 hours to schedule an exchange.</p>
            </div>
          )}

          {activeSection === 'disclaimer' && (
            <div className="space-y-6 border-l-4 border-amber-500 pl-4 bg-amber-500/5 py-4 pr-4 rounded-xl">
              <h3 className="font-serif text-base font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Allergen Warning & Safe Handling Guidelines</span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm">
                * **Allergens:** Our snack items are prepared in a kitchen that handles nuts, dairy, wheat, gluten, and eggs. Please check the ingredient labels carefully if you have severe food allergies.
                <br /><br />
                * **Storage:** Always store blast-frozen kebabs and ready-to-cook delicacies at **-18°C** or below. Do not refreeze items once completely thawed.
                <br /><br />
                * **Safe Cooking:** Raw marinated meats and ready-to-cook cutlets must be pan-fried, grilled, or air-fried thoroughly to a safe internal core temperature of at least **74°C** before consumption.
              </p>
            </div>
          )}

          {activeSection === 'accessibility' && (
            <div className="space-y-6">
              <h3 className="font-serif text-base font-bold text-charcoal-950 dark:text-white">Accessibility Statement</h3>
              <p>
                A_S FOODY is committed to providing a digitally accessible storefront for all users, including those utilizing screen readers, keyboard navigation, or assistive devices. We continuously audit our contrast ratios, aria-labels, and page structural elements to meet the Web Content Accessibility Guidelines (WCAG 2.1 Level AA) standards.
              </p>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              <h3 className="font-serif text-base font-bold text-charcoal-950 dark:text-white">Security & Vulnerability Disclosure</h3>
              <p>
                Security is core to our storefront. User session authentication is protected by JWT headers, and passwords are encrypted using Bcrypt with a high cost-factor. Database queries are sanitized to protect against SQL injections.
              </p>
              <h4 className="font-semibold text-charcoal-900 dark:text-white mt-4">Vulnerability Reporting</h4>
              <p>If you are a security researcher and discover a vulnerability, please disclose it responsibly by contacting our security responses desk directly: <strong>ashutoshgifthamper9334@gmail.com</strong>. Do not perform public disclosures until we have addressed the issue.</p>
            </div>
          )}

        </main>
      </div>
    </PageTransition>
  );
};
