import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, quickSwitchRole, user } = useStore();

  return (
    <footer className="bg-stone-950 text-stone-400 text-xs border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-tight text-white block">
              Atelier
            </span>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              An independent archive and purveyor of functional design objects, analog audio monitors, and architectural desk accessories.
            </p>
            <div className="text-[11px] text-stone-500">
              Kyoto · Portland · Stockholm
            </div>
          </div>

          {/* Nav Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] block">
              Navigation
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Full Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('tracking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Order Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Order Archive
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Col 2 */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] block">
              Provenance & Policies
            </span>
            <ul className="space-y-2 text-stone-400">
              <li>Small-Batch Artisan Sourcing</li>
              <li>Complimentary Courier Dispatch (&gt; $150)</li>
              <li>30-Day Evaluation & Exchanges</li>
              <li>2-Year Atelier Guarantee</li>
            </ul>
          </div>

          {/* Administration & Fast Demo */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] block">
              System & Administration
            </span>
            <p className="text-xs text-stone-400">
              Full-stack relational persistence powered by Express REST APIs with role-based access control.
            </p>
            <div className="pt-2">
              {user?.role === 'admin' ? (
                <button
                  onClick={() => setActiveView('admin')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/60 text-amber-300 border border-amber-800/80 rounded-lg text-xs hover:bg-amber-900/60 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Open Admin Control Panel</span>
                </button>
              ) : (
                <button
                  onClick={async () => {
                    await quickSwitchRole('admin');
                    setActiveView('admin');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-stone-300 border border-stone-800 rounded-lg text-xs hover:bg-stone-800 hover:text-white transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Switch to Admin Mode</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Quiet copyright */}
        <div className="mt-12 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Atelier Commerce Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Terms of Service</span>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Security Invariants</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
