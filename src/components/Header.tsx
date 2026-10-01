import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ShoppingBag, User as UserIcon, Shield, Package, LogOut, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    user,
    cartTotalCount,
    setCartOpen,
    activeView,
    setActiveView,
    logout,
    quickSwitchRole,
  } = useStore();

  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/90 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      {/* Slim notification bar */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 text-center tracking-wide font-normal flex items-center justify-center gap-3">
        <span>Complimentary expedited courier dispatch on all orders exceeding $150</span>
        <span className="hidden sm:inline text-stone-500">·</span>
        <span className="hidden sm:inline text-stone-400">Guaranteed 3-day regional transit</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center">
          <button
            onClick={() => setActiveView('catalog')}
            className="font-serif text-2xl font-bold tracking-tight text-stone-900 hover:text-stone-700 transition-colors focus-visible:outline-none"
          >
            Atelier
          </button>
        </div>

        {/* Zone 2: 4-6 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveView('catalog')}
            className={`transition-colors hover:text-stone-900 pb-0.5 border-b-2 ${
              activeView === 'catalog' ? 'border-stone-900 text-stone-900 font-semibold' : 'border-transparent'
            }`}
          >
            Catalog
          </button>

          <button
            onClick={() => setActiveView('tracking')}
            className={`transition-colors hover:text-stone-900 pb-0.5 border-b-2 ${
              activeView === 'tracking' ? 'border-stone-900 text-stone-900 font-semibold' : 'border-transparent'
            }`}
          >
            Order Tracker
          </button>

          {user && (
            <button
              onClick={() => setActiveView('orders')}
              className={`transition-colors hover:text-stone-900 pb-0.5 border-b-2 ${
                activeView === 'orders' ? 'border-stone-900 text-stone-900 font-semibold' : 'border-transparent'
              }`}
            >
              Order History
            </button>
          )}

          {user?.role === 'admin' ? (
            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-1.5 transition-colors pb-0.5 border-b-2 ${
                activeView === 'admin'
                  ? 'border-amber-700 text-amber-900 font-semibold'
                  : 'border-transparent text-amber-800 hover:text-amber-950'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </button>
          ) : (
            <button
              onClick={async () => {
                await quickSwitchRole('admin');
                setActiveView('admin');
              }}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 bg-stone-100/70 hover:bg-stone-200/70 px-2 py-1 rounded transition-colors"
              title="One-click switch to Admin mode for evaluation"
            >
              <Shield className="w-3 h-3 text-stone-500" />
              <span>Switch to Admin</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3">
          {/* User Account / Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(prev => !prev)}
                className="flex items-center gap-2 py-1.5 px-3 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden sm:inline max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                {user.role === 'admin' && (
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                )}
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-xl shadow-lg p-2 z-50 text-xs text-stone-700 animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-stone-100 mb-1">
                    <p className="font-semibold text-stone-900 truncate">{user.name}</p>
                    <p className="text-stone-500 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('orders');
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors text-left"
                  >
                    <Package className="w-4 h-4 text-stone-500" />
                    <span>My Past Orders</span>
                  </button>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setActiveView('admin');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-50 text-amber-900 transition-colors text-left"
                    >
                      <Shield className="w-4 h-4 text-amber-600" />
                      <span>Admin Management</span>
                    </button>
                  )}

                  <div className="my-1 border-t border-stone-100"></div>

                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActiveView('auth')}
              className="px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Sign In
            </button>
          )}

          {/* Cart Bag Button */}
          <button
            onClick={() => setCartOpen(true)}
            aria-label="View shopping cart"
            className="relative p-2.5 text-stone-800 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-[11px] font-mono font-medium rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center ring-2 ring-white tabular-nums">
                {cartTotalCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
