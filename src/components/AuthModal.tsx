import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { X, Lock, Mail, User, Shield, AlertCircle, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { activeView, setActiveView, login, register, quickSwitchRole } = useStore();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  if (activeView !== 'auth') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        await register({ name, email, password, phone, address, city, postalCode });
      } else {
        await login(email, password);
      }
      setActiveView('catalog');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomer = async () => {
    setLoading(true);
    setError(null);
    try {
      await quickSwitchRole('user');
      setActiveView('catalog');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      await quickSwitchRole('admin');
      setActiveView('admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Close Button */}
        <button
          onClick={() => setActiveView('catalog')}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">Atelier Security</span>
          <h2 className="font-serif text-2xl font-medium text-stone-900">
            {isRegister ? 'Create Your Account' : 'Account Access'}
          </h2>
          <p className="text-xs text-stone-500">
            {isRegister ? 'Register for direct order tracking & express checkout.' : 'Sign in to review saved orders and delivery status.'}
          </p>
        </div>

        {/* Quick Demo Logins Banner */}
        <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
          <div className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider flex items-center justify-between">
            <span>Instant Demo Access</span>
            <span className="text-stone-400 font-normal">No typing required</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoCustomer}
              disabled={loading}
              className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <User className="w-3.5 h-3.5 text-stone-600" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              disabled={loading}
              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block text-stone-600 font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Marcus Vance"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          )}

          <div>
            <label className="block text-stone-600 font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@store.com or admin@store.com"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-stone-600 font-medium mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Street Address (Optional)</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Street and apartment"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Portland"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    placeholder="97201"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm"
          >
            <span>{loading ? 'Authenticating...' : isRegister ? 'Complete Registration' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Register/Login */}
        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500">
          {isRegister ? (
            <span>
              Already possess an Atelier account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError(null);
                }}
                className="font-medium text-stone-900 underline hover:text-stone-700"
              >
                Sign in
              </button>
            </span>
          ) : (
            <span>
              New to Atelier?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError(null);
                }}
                className="font-medium text-stone-900 underline hover:text-stone-700"
              >
                Create an account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
