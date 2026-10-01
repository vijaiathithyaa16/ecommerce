import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext.tsx';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { Catalog } from './components/Catalog.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutView } from './components/CheckoutView.tsx';
import { OrderTracker } from './components/OrderTracker.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { Footer } from './components/Footer.tsx';

const MainContent: React.FC = () => {
  const { activeView, selectedProduct, setSelectedProduct } = useStore();

  const handleExplore = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-stone-900">
      <Header />

      <main className="flex-1">
        {activeView === 'catalog' && (
          <>
            <Hero onExplore={handleExplore} />
            <Catalog />
          </>
        )}

        {activeView === 'checkout' && <CheckoutView />}

        {(activeView === 'tracking' || activeView === 'orders') && <OrderTracker />}

        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals and Drawers */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <CartDrawer />
      <AuthModal />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
